import { FACINGS } from "../../src/fx/_kit/person.js";
import { frameDuration, spriteSheet } from "./fxlib.mjs";

const sides = "NESW";
const terrain = {
  "tiles/dirt-path": { option: "edges", connected: true },
  "tiles/stone-path": { option: "edges", connected: true },
  "tiles/pond": { option: "banks", connected: false, animated: true },
  "tiles/tilled-soil": { option: "edges", connected: false, options: { wet: 0 } },
};

export function sheetVariants(fx) {
  const [category] = fx.id.split("/");
  const { options, origin, size } = fx.meta;
  const variants = [];
  const add = (name, options, extra) => variants.push({ name, options, ...extra });
  const directional = (animations, viewport) => {
    for (const facing of FACINGS) {
      for (const anim of animations) add(`${facing}-${anim}`, { facing, anim }, { viewport });
    }
  };

  if (category === "characters") {
    directional(["idle", "walk"], { size: [32, 48], pivot: [16, 40] });
  } else if (category === "animals" && options.facing && options.anim) {
    directional(["idle", "walk", "graze"]);
  } else if (category === "farming") {
    const viewport = { size: [112, size[1]], pivot: [56, origin[1]] };
    for (const facing of FACINGS) add(facing, { facing }, { viewport, loop: false });
  } else if (category === "portraits") {
    for (const expression of ["smile", "neutral", "happy", "surprised"]) {
      for (const anim of ["idle", "talk"]) add(`${expression}-${anim}`, { expression, anim });
    }
  } else if (category === "crops") {
    for (let stage = 0; stage <= 4; stage++) add(`stage-${stage}`, { stage, plot: false });
  } else if (fx.id === "exploration/island-explorer") {
    directional(["idle", "walk"]);
  } else if (fx.id === "exploration/gather-swing") {
    for (const facing of FACINGS) {
      for (const tool of ["axe", "pickaxe"]) add(`${facing}-${tool}`, { facing, tool });
    }
  } else if (fx.id === "exploration/island-shore") {
    for (let mask = 0; mask < 16; mask++) {
      const edges = [...sides].filter((_, i) => mask & (1 << i)).join("");
      const available = ["NE", "SE", "SW", "NW"].filter((corner) => [...corner].every((side) => !edges.includes(side)));
      for (let submask = 0; submask < 2 ** available.length; submask++) {
        const corners = available.filter((_, i) => submask & (1 << i));
        const suffix = corners.length ? `-inside-${corners.join("-").toLowerCase()}` : "";
        add(`edge-${edges.toLowerCase() || "none"}${suffix}`, { edges, corners });
      }
    }
  } else if (Object.hasOwn(terrain, fx.id)) {
    const { option, connected, animated, options } = terrain[fx.id];
    for (let mask = 0; mask < 16; mask++) {
      const joins = [...sides].filter((_, i) => mask & (1 << i)).join("");
      const value = connected ? joins : [...sides].filter((side) => !joins.includes(side)).join("");
      add(`connect-${joins.toLowerCase() || "none"}`, { ...options, [option]: value }, { terrain: { joins, animated } });
    }
  }
  return variants;
}

// The Wang ring starts at the north edge and alternates edges and corners clockwise.
export function tiledTerrain(fx, clips, name) {
  const { w, h, fps } = clips[0].render;
  const frames = [], tiles = [], wangtiles = [];
  for (const { joins, animated, render } of clips) {
    const tileid = frames.length;
    const clip = animated ? render.frames : render.frames.slice(0, 1);
    frames.push(...clip);
    wangtiles.push({ tileid, wangid: [...sides].flatMap((side) => [joins.includes(side) ? 2 : 1, 0]) });
    if (clip.length > 1) tiles.push({
      id: tileid,
      animation: clip.map((_, i) => ({ tileid: tileid + i, duration: frameDuration(i, fps) })),
    });
  }

  const { png, json } = spriteSheet(fx, { w, h, fps, frames }, name);
  const { w: imagewidth, h: imageheight } = json.meta.size;
  const fullTile = wangtiles.at(-1).tileid;
  return {
    png,
    json: {
      type: "tileset", version: "1.10", name: fx.meta.name, tilewidth: w, tileheight: h,
      columns: imagewidth / w, tilecount: imagewidth * imageheight / (w * h),
      image: `${name}.png`, imagewidth, imageheight, margin: 0, spacing: 0, tiles,
      wangsets: [{
        name: fx.meta.name, type: "edge", tile: fullTile, wangtiles,
        colors: [
          { name: "Boundary", color: "#65834b", tile: 0, probability: 1 },
          { name: fx.meta.name, color: "#be985d", tile: fullTile, probability: 1 },
        ],
      }],
    },
  };
}
