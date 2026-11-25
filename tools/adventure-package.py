"""Build the adventure ZIP and preview from a staged export. Requires Pillow."""

import argparse
import json
import os
from pathlib import Path, PurePosixPath
import subprocess
import wave
from zipfile import ZIP_DEFLATED, ZipFile

from PIL import GifImagePlugin, Image, ImageDraw, ImageFont


REPO = Path(__file__).resolve().parents[1]
GROUPS = json.loads((REPO / "tools/lib/adventure-groups.json").read_text(encoding="utf-8"))
PREVIEW_IDS = (
    "items/consumables/medium-energy-potion", "items/special/treasure-map", "items/seeds/corn-seed",
    "player/axe-swing", "tools/treasure-detector", "weapons/crystal-sword", "equipment/golden-armor",
    "enemies/crystal-slime", "bosses/frost-dragon", "animals/fox", "biomes/tropical/coral",
    "tiles/river-junction", "buildings/magic-tower", "objects/double-bed", "exploration/sailing-boat",
    "dungeons/laser-emitter", "combat/sword-slash", "fx/teleport-in", "weather/aurora", "ui/hud/minimap",
    "ui/menus/equipment-menu", "ui/components/circular-progress", "ui/notifications/island-unlock-toast",
    "skills/magic/teleportation", "emotes/happy", "particles/leaf", "lighting/torch-light",
    "transitions/circle-close",
)


def gif_frame(frame, alpha_threshold):
    transparent = frame.getchannel("A").point(lambda alpha: 255 if alpha < alpha_threshold else 0)
    palette = frame.convert("RGB").quantize(colors=255, dither=Image.Dither.NONE)
    colors = palette.getpalette()
    palette.putpalette(colors + [0] * (768 - len(colors)))
    palette.paste(255, mask=transparent)
    return palette


def export_clip(stage, clip, name):
    data = json.loads((stage / clip["data"]).read_text(encoding="utf-8"))
    meta = data["meta"]
    frames = data["frames"]
    if (meta["frameTags"][0]["name"] != name or clip["pivot"] != meta["farmfx"]["pivot"]
            or len(frames) != clip["frames"] or not frames):
        raise ValueError(f"Invalid clip metadata for {clip['data']}")
    with Image.open(stage / clip["image"]) as sheet:
        if sheet.mode != "RGBA" or sheet.size != (meta["size"]["w"], meta["size"]["h"]):
            raise ValueError(f"Invalid sprite sheet for {clip['data']}")
        images = []
        durations = []
        elapsed = 0
        for frame in frames:
            x, y, w, h = (frame["frame"][key] for key in ("x", "y", "w", "h"))
            images.append(sheet.crop((x, y, x + w, y + h)))
            end = elapsed + frame["duration"]
            durations.append(((end + 5) // 10 - (elapsed + 5) // 10) * 10)
            elapsed = end
    peak_alpha = max(image.getchannel("A").getextrema()[1] for image in images)
    if not peak_alpha:
        raise ValueError(f"Blank animation for {clip['data']}")
    indexed = [gif_frame(image, min(peak_alpha, 64)) for image in images]
    destination = stage / clip["gif"]
    destination.parent.mkdir(parents=True, exist_ok=True)
    loop = {"loop": 0} if clip["loop"] else {}
    header, _ = GifImagePlugin.getheader(indexed[0], info={"background": 255, "transparency": 255, **loop})
    with destination.open("wb") as gif:
        gif.writelines(header)
        # Write complete frames so clearing a frame works even when the next frame is empty.
        for index, (frame, duration) in enumerate(zip(indexed, durations)):
            gif.writelines(GifImagePlugin.getdata(frame, duration=duration, transparency=255,
                                                 disposal=2, include_color_table=index > 0))
        gif.write(b";")
    with Image.open(destination) as gif:
        count = gif.n_frames
        gif.seek(count - 1)
        gif.load()
        if count != len(frames) or gif.size != tuple(clip["frameSize"]) or (gif.info.get("loop") == 0) != clip["loop"]:
            raise ValueError(f"Invalid GIF for {clip['data']}")
    return [clip["image"], clip["data"], clip["gif"]]


def export_entry(stage, entry):
    paths = export_clip(stage, entry, entry["id"].rsplit("/", 1)[-1])
    names = set()
    for variant in entry["variants"]:
        name = variant["name"]
        if name in names or name != PurePosixPath(variant["image"]).stem:
            raise ValueError(f"Invalid variant name {name!r} in {entry['id']}")
        names.add(name)
        paths.extend(export_clip(stage, variant, name))
    return paths


def preview(stage, output, entries):
    canvas = Image.new("RGB", (1120, 676), "#211c2d")
    draw = ImageDraw.Draw(canvas)
    title = ImageFont.load_default(size=28)
    label = ImageFont.load_default(size=14)
    draw.text((18, 12), "FARMFX  |  ADVENTURE ASSET PACK", font=title, fill="#f3dfaf")
    for i, asset_id in enumerate(PREVIEW_IDS):
        x, y = 14 + i % 7 * 157, 58 + i // 7 * 153
        draw.rounded_rectangle((x, y, x + 145, y + 142), radius=6, fill="#362f45", outline="#594a65")
        with Image.open(stage / entries[asset_id]["gif"]) as gif:
            gif.seek(int(gif.n_frames * .38))
            art = gif.convert("RGBA")
        if art.getbbox():
            art = art.crop(art.getbbox())
        scale = min(5, 132 / art.width, 102 / art.height)
        art = art.resize((max(1, int(scale * art.width)), max(1, int(scale * art.height))),
                         Image.Resampling.NEAREST)
        canvas.paste(art, (x + (145 - art.width) // 2, y + 8 + (110 - art.height) // 2), art)
        name = asset_id.rsplit("/", 1)[-1].replace("-", " ")
        if len(name) > 20:
            name = name[:19] + "…"
        draw.text((x + 72, y + 123), name, font=label, fill="#f1e4ce", anchor="mt")
    canvas.save(output)


def group_commits():
    subjects = {f"Add {group} assets": group for group in GROUPS if group != "audio"}
    subjects["Add 90 game audio assets"] = "audio"
    log = subprocess.check_output(["git", "log", "--format=%h %s"], cwd=REPO, text=True, encoding="utf-8")
    commits = {}
    for line in log.splitlines():
        commit, subject = line.split(" ", 1)
        if subject in subjects:
            commits.setdefault(subjects[subject], commit)
    return commits


def package(stage, output):
    groups, entries, paths = {}, {}, []
    variant_count = 0
    for group, ids in GROUPS.items():
        if group == "audio":
            continue
        index = f"groups/{group.replace('/', '-')}.json"
        listing = json.loads((stage / index).read_text(encoding="utf-8"))
        if listing["group"] != group or [entry["id"] for entry in listing["entries"]] != [f"{group}/{i}" for i in ids]:
            raise ValueError(f"Asset list differs for {group}")
        groups[group] = {"index": index, "count": len(ids)}
        paths.append(index)
        for entry in listing["entries"]:
            entries[entry["id"]] = entry
            variant_count += len(entry["variants"])
            paths.extend(export_entry(stage, entry))
        print(f"{group} | {len(ids)} assets verified", flush=True)

    tool_index = "tool-upgrades/index.json"
    upgrades = json.loads((stage / tool_index).read_text(encoding="utf-8"))
    paths.append(tool_index)
    tiers = [f"tier-{i}" for i in range(1, 9)]
    for tool in upgrades:
        if [variant["name"] for variant in tool["variants"]] != tiers:
            raise ValueError(f"Incomplete tool tiers for {tool['id']}")
        variant_count += len(tiers)
        paths.extend(export_entry(stage, tool))

    audio_file = "audio/game-audio.json"
    audio = json.loads((REPO / audio_file).read_text(encoding="utf-8"))
    if sorted(asset["id"] for asset in audio) != sorted(GROUPS["audio"]):
        raise ValueError("Audio list differs from adventure manifest")
    gif_count = len(entries) + len(upgrades) + variant_count
    if len(paths) != len(set(paths)) or sum(path.endswith(".gif") for path in paths) != gif_count:
        raise ValueError("Duplicate paths or missing GIFs")
    manifest = {
        "groupCommits": group_commits(), "visualCount": len(entries), "audioCount": len(audio),
        "variantCount": variant_count, "gifCount": gif_count, "groups": groups,
        "audio": audio_file, "toolUpgrades": tool_index,
    }
    output.mkdir(parents=True, exist_ok=True)
    archive = output / "farmfx-a-md-assets.zip"
    preview_path = output / "farmfx-a-md-preview.png"
    pending_archive = archive.with_suffix(".zip.tmp")
    pending_preview = preview_path.with_suffix(".tmp.png")
    preview(stage, pending_preview, entries)
    with ZipFile(pending_archive, "w", ZIP_DEFLATED, compresslevel=4) as bundle:
        for name in ("LICENSE", "NOTICE.md", audio_file):
            bundle.write(REPO / name, name)
        for asset in audio:
            path = REPO / "audio" / asset["path"]
            with wave.open(str(path), "rb") as waveform:
                if waveform.getframerate() != 22050 or waveform.getnchannels() != 1:
                    raise ValueError(f"Unexpected audio format for {path}")
            bundle.write(path, f"audio/{asset['path']}")
        for path in sorted(paths):
            bundle.write(stage / path, path)
        bundle.write(pending_preview, "preview.png")
        bundle.writestr("index.json", json.dumps(manifest, indent=2) + "\n")
        bundle.writestr("README.txt",
                        "FarmFX adventure asset pack\n\nOpen index.json for the group manifests.\n"
                        "sprites/ and tool-upgrades/ contain transparent PNG sprite sheets and matching JSON.\n"
                        "gif/ contains previews of every base asset and variant.\n"
                        "audio/ contains PCM WAV files and an index with loop metadata.\n")
    with ZipFile(pending_archive) as bundle:
        corrupt = bundle.testzip()
        if corrupt:
            raise ValueError(f"Corrupt ZIP entry for {corrupt}")
    os.replace(pending_archive, archive)
    os.replace(pending_preview, preview_path)
    print(f"{archive}: {len(entries)} visual assets, {variant_count} variants, {gif_count} GIFs, {len(audio)} WAVs")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("stage", type=Path, help="directory produced by adventure-sheets.mjs")
    parser.add_argument("--out", type=Path, default=REPO / "sheets")
    args = parser.parse_args()
    package(args.stage, args.out)
