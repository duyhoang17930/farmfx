---
name: farmfx
description: Make 2D top-down 3/4-perspective pixel art assets and animations for farming games (the cozy farming-sim look: 16 px tiles, things seen from above and in front) in code with the farmfx library (built on pixelfx) - crops that grow from seed to harvest, farm animals, tilled and watered soil tiles, buildings, weather and seasons, farm effects and UI, and farmer actions (hoe, water, sow, harvest) acted out by a character. Drop them into a game, recolor them per season, export sprite sheets, or draft, render, look and refine new ones until they look hand-animated. Use when someone wants farming or cozy-game pixel art, crop growth stages, animal sprite animations, farm tiles, or wants to use or export a farmfx asset in Godot, Unity, Phaser or a canvas game.
license: MIT
compatibility: Node 18 or newer. ffmpeg is optional (GIF and MP4 previews).
---

# farmfx

Pixel art for 2D top-down farming games, seen at a 3/4 angle, as code, built on pixelfx. Each effect is one file, `src/fx/<category>/<name>.js`, that draws into two buffers:
**color** (pixels: opaque, dithered or truly translucent) and **light** (additive glow). No images, so an effect
can be played live, recolored, mirrored, reseeded and rendered to a sprite sheet for any engine.

The method is Hugo Duprez's ([How to make (good) pixel art effects with
Claude](https://www.spritefusion.com/blog/how-to-make-good-pixel-art-effects-with-claude)): code is clay, trust
your eyes, feed your references. One-shot prompts make mediocre effects. Drafts you render, look at and refine
make good ones.

## Before anything

1. Work in a farmfx checkout. If the working directory has no `tools/render.mjs`, clone one next to the
   project: `git clone https://github.com/duyhoang17930/farmfx`. No install step: the tools use only Node.
2. Check it runs: `node tools/render.mjs crops/carrot` writes `records/crops/carrot/contact.png`. Open that PNG with
   your image-reading tool. That contact sheet is how you see every effect from now on.

## 1. Look for an existing effect first

`node tools/list.mjs <words>` searches ids, names, tags and descriptions (`node tools/list.mjs chicken`,
`node tools/list.mjs crop loop`). `docs/CATALOG.md` lists everything by category. Render the candidates and
look at them before choosing. Most requests are an existing effect with different options:

- `palette`: the main ramp, dark to bright, as hex strings. Any `PAL` ramp in `src/core/color.js` (fire ember
  lava smoke dust ice water electric volt poison holy heal arcane shadow blood earth stone gold leaf wood metal
  bone neon cyber matrix candy night) or your own. An autumn crop is `{"palette": PAL.gold}`.
- `seed` for a different but equivalent take; `flip` to face left; `angle` to rotate; `light` (0..1+) for glow
  strength; plus each effect's own knobs in its `meta.options` (size, count, radius, text, height...).
- Try options without editing code: `node tools/render.mjs crops/wheat --opts '{"palette":["#102","#215","#43a","#8cf","#fff"]}'`.

## 2. Put it in the game

**Canvas or WebGL games in JS or TS** (plain canvas, Phaser, PixiJS, Kaplay, three.js): use the code directly. It
has no dependencies; copy `src/core` and the effect files you need, or depend on the repo.

```js
import { createFrame, clearFrame, createFx, composite } from "farmfx";    // src/core/index.js
import * as carrot from "farmfx/fx/crops/carrot";                       // src/fx/crops/carrot.js

const frame = createFrame(320, 180);            // the game's pixel resolution; ox, oy scroll it with the camera
const img = new ImageData(320, 180);
const fx = createFx(carrot, { x: plot.x, y: plot.y });

// every tick
fx.update(dt);
clearFrame(frame);
fx.draw(frame, "back");    // what goes behind characters
drawCharacters();          // your own sprites, or draw them into frame.color yourself
fx.draw(frame, "front");
composite(frame, img.data, background);   // color over the background plus light; or null for transparent
ctx.putImageData(img, 0, 0);              // then scale the canvas up with image-rendering: pixelated
if (fx.done()) removeIt();               // one-shots end on their own; fx.stop() fades a loop out
```

Several effects can share one frame. In a WebGL engine, upload the composited RGBA to a texture each frame, or
render the effect to a sprite sheet once (below) and play it like any other animation.

**Any engine** (Godot, Unity, GameMaker, Defold, LÖVE, Bevy, Construct): export sprite sheets.
`node tools/render.mjs crops/carrot --sheet` writes `records/crops/carrot/carrot.png` (transparent
frames in a grid) and `carrot.json` (Aseprite-style frames, so Phaser's atlas loader, Godot and Unity Aseprite
importers and most tools read it; `meta.farmfx` has fps, loop, frame size, columns and the pivot). Set the
pivot to `meta.farmfx.pivot` (the effect's origin, e.g. the feet), import with nearest-neighbour filtering and no
compression, and play at `meta.farmfx.fps`. Glow is baked into the sheet as color with alpha, which reads as
additive over dark scenes; for bright scenes, render a recolored version or keep the effect on a dark layer.

For the full library: `node tools/render.mjs <category> --sheet` does a whole category.

**A farm chore needs a body behind it.** A soil burst alone looks like a sticker. Effects with a character carry an `act`: when the body winds
up, when to freeze, how the target reacts. Use it whichever way the game is built:

- With the stock character: `createAct(hoe, { x, y })` instead of `createFx`. `act.update(dt)`, `act.draw(frame)`, and throw the
  picture by `act.shake`. It holds still by itself during a freeze. `node tools/act.mjs <id> --sheet` bakes the lot into a sprite sheet.
- With the game's own character: read the timing, `hoe.act` or `meta.farmfx.act` in a sheet's JSON (`windup`, `recovery`, `hits`
  with `t` and `freeze`). Play the character's attack animation `windup` seconds before the effect, and at each hit stop updating
  everything, effect and characters both, for `freeze` seconds. Host-side hit-stop works on any effect, with or without an act.

`src/fx/farming/` has the farmer's chores acted out, wind-up to recovery: start there when someone asks for a farmer action.

## 3. Make a new one

**Read `docs/STYLE.md` first.** Every asset is drawn for a 2D top-down game at a 3/4 angle, the cozy farming-sim
look: a 16 x 16 px tile grid, the ground as a flat plan, standing things showing their front and their top, soft
contact shadows instead of a floor line, light from the top-left, warm hue-shifted colors with colored (never black)
outlines. The short version:

- **Size in tiles.** A crop is one tile, a tree 2 x 3, a chicken about one, a cow 2 x 2, a person 16 x 32. Canvases
  are whole tiles. The origin is the middle of the footprint's bottom edge, where it meets the ground.
- **No floor line, no sky.** Ground things (soil, water, furrows, puddles, splashes) are flat shapes seen from above;
  circles on the ground are ellipses twice as wide as tall. Particles land at their own depth, not on one line.
- **Shadows** are soft dark ellipses under whatever stands; they stay on the ground when it jumps.
- **Four facings** for animals and people: down, up, side (right; flip for left). Say in `desc` which ones it does.
- **Render previews on `bg: "field"`** (grass from above with a faint 16 px grid) to judge size and footing.

Then read `docs/AUTHORING.md`: it is the contract (meta, `draw(p, t, o)` for pure effects or `create(o)` for
simulated ones, local coordinates, seamless loops, ending empty), the toolkit, the painter API and the quality bar.
Then:

1. **Say it in one line** with art direction: what it is, its size in tiles, how it moves, its palette, its timing.
   "A carrot growing on one tile of tilled soil, seen from above and in front: a sprout pops up with a squash,
   feathery leaves unfurl, the orange shoulder swells out of the soil, a sparkle says it's ready."
2. **Find references** in the library: `node tools/list.mjs <words>`, then read the two or three closest effect
   files and borrow their techniques (`Particles` and `Bits` in `src/core/sim.js` for sparks, smoke and debris,
   `p.disc` for translucent volumes, `cycle` for seamless particles, `tileFbm` scrolls for flames and water). Look at
   the closest of [Hugo Duprez's effects](https://www.spritefusion.com/pixel-art-vfx) too: they are the quality bar.
   If his has more detail, light or life at the same size on screen, yours isn't done.
3. **Draft.** `node tools/new.mjs <category>/<name>` (add `--loop` for a loop) gives a working file. When the
   direction is open, write 3 to 5 genuinely different drafts (`<name>-a.js` .. `-e.js`), render them all
   (`node tools/render.mjs "<category>/<name>-*"`) and look at every contact sheet before choosing. Show the user
   the strongest two or three if they're around (`--gif` makes animations to share).
4. **Look, judge, fix.** Render, open `records/<id>/contact.png`, and judge like a picky pixel artist. Fix the
   worst thing, render again. Three rounds minimum; a showpiece takes more. `--all` shows every frame,
   `--mp4` shows motion at full speed.
5. **Act it out** if a character is involved: add `export const act` (see "Acts" in `docs/AUTHORING.md`), with a wind-up before t = 0,
   a pose change on the release frame, a freeze on contact and a recovery. `node tools/act.mjs <id>` shows consecutive 12 fps steps:
   judge motion from those and from `--mp4`, not from a contact sheet's samples.
6. **Check.** `node tools/check.mjs <id>` catches drawing outside the canvas, one-shots that don't end empty,
   loop seams, unseeded randomness and slow frames, and in an act: keys out of order, unknown pose fields and hands
   that teleport. Fix until it passes clean. Delete the drafts you didn't keep.

What to look for, and the usual fix:

| you see | fix |
|---|---|
| it looks side-on, like a platformer | lose the floor line; show the top as well as the front; flatten ground circles to 2:1 ellipses; a contact shadow under it |
| it doesn't sit on its tile | size it in whole tiles, put the origin at the middle of the footprint's bottom edge, check it on `bg: "field"` |
| outlines look harsh | color the outline one or two steps darker than what it wraps, break it where a highlight touches |
| it reads as mush at 1x | fewer colors, a clear silhouette, one focal point, bigger shapes |
| speckle: lone noise pixels inside shapes | threshold noise less, quantize with `at()`, no noise on small shapes |
| floaty, no punch | fast in, slow out (`ease.outQuart`/`outExpo`), a 1 to 2 frame white hero frame, shorter total time |
| stiff or mechanical | vary every particle (size, speed, delay, life), add secondary motion (sparks, smoke, debris) |
| washed out | less glow (k 0.2 to 0.5), darker edge steps, keep white for the hottest core only |
| flat | light from one side: brighter top-left, darker bottom-right step; a darker ramp step at the base |
| smooth gradients, vector look | hard ramp steps in color; softness only in light and in translucent smoke |
| a checkerboard where smoke should be | `SMOKE`, `VAPOUR` or `DUST` particles, or `p.disc`: truly translucent, lit on top |
| seam when a loop wraps | `cycle`, `loopNoise(phase)`, whole-cell `tileNoise` scrolls, `sin(phase * TAU * n)` |
| a one-shot that pops off | let it shrink, dither out or fall away before t = duration |
| a great effect on a dead character | give it an act: wind-up, release pose, freeze on contact, a target that reacts, recovery |
| the act feels weightless | a wind-up the opposite way to the blow, a longer freeze (up to 0.2 s), a bigger silhouette change, shake |
| the hit lands out of sync | move the hit key to the effect's own constant, not to a time you eyeballed |
| he holds the weapon badly | keep a bend in the elbow, shafts in front of the chest; on a swing the blade lags the hand; arms reach about 15 px and don't stretch, so step the body in |
| his arms cross or the pose looks flat | he faces three-quarters towards us: for open arms the near hand goes left (`fx < 0`), far hand right, with `turn: 1`; `yaw` really turns him |

Side-facing things face right, standing things meet the ground at y = 0, actor effects wrap `o.actor` (a 24 x 38 stock
character's mask and pixels), and nothing uses `Math.random`. The genre's conventions (the 3/4 view, the tile grid,
the cozy palette) are fine to follow; never copy a specific game's sprites, characters, palettes, UI or logos.

### People

Each villager has four indexed 24 × 26 sprite frames in `src/fx/characters/_art.js`,
ordered down, left, right, up, and a 40 × 48 bust in `src/fx/portraits/_art.js`.
Use up to 16 colors per palette. A period marks transparency. Pass `colors` as a
map from a palette symbol to a replacement color to recolor a character or portrait.
Set `season` to `spring`, `summer`, `autumn`, or `winter` on character, portrait, and
farming effects. Individual `colors` replacements take precedence over the seasonal tint.
The portrait data locates the near eye, far eye, and mouth for dialogue animation.

Add the villager's information in `src/fx/_kit/cast.js` and register the two assets
by following an existing pair of effect modules. The farming effects reuse the
indexed body with the hand and tool poses from `src/fx/_kit/person.js`. The parts in
`src/fx/_kit/parts.js` support custom procedural looks in that rig.

Shared helpers live in `src/fx/_kit/` (`creature.js` for outlined animals, `sprite.js` for outlined props,
`weather.js`, `water.js`, `nature.js`, `ui.js`). Import them with `../_kit/<name>.js`.

## 4. Native code instead of JS

If the game can't run JS and a sprite sheet isn't enough (an effect that follows a moving target, or needs
per-instance colors at runtime), port the effect. Pure effects are a function of time; simulated ones step the particles in
`src/core/sim.js`. Keep the two-buffer idea, the 4x4 Bayer threshold for dithered alpha and the palette ramp lookups.
Render the JS original and your port side by side to check they match.
