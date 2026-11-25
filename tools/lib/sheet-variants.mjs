import { FACINGS } from "../../src/fx/_kit/person.js";
import { frameDuration, spriteSheet } from "./fxlib.mjs";

const sides = "NESW";
const diagonals = ["NE", "SE", "SW", "NW"];
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
  } else if (fx.meta.clips && options.state) {
    for (const facing of FACINGS) for (const state of fx.meta.clips) {
      const loop=["idle","move","walk","eat","sleep","stunned"].includes(state);
      const events=loop?undefined:{...(state.startsWith("attack")?{damage:fx.meta.duration*0.39}:{}),completion:fx.meta.duration};
      add(`${facing}-${state}`,{facing,state},{loop,events});
    }
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
  } else if (category === "player") {
    for (const facing of FACINGS) add(facing, { facing });
  } else if (category === "tools" && Object.hasOwn(options, "tier")) {
    for (let tier=1;tier<=8;tier++) add(`tier-${tier}`,{tier});
  } else if (fx.id === "exploration/target-brackets") {
    for (const state of ["ready", "distant", "hostile"]) add(state, { state });
  } else if (fx.id === "fx/build-footprint") {
    add("valid", { blocked: [] });
    add("blocked", { blocked: [1] });
  } else if (fx.id === "fx/loot-flight") {
    for (const item of ["wood", "stone", "iron-ore", "iron-ingot", "coin", "quartz"]) add(item, { item });
  } else if (fx.id === "combat/ground-telegraph") {
    for (const shape of ["circle", "line", "cone"]) add(shape, { shape });
  } else if (fx.id === "ui/components/touch-action") {
    add("ready", { state: "ready" });
    add("pressed", { state: "pressed" });
    add("hold", { state: "pressed", progress: 0.65 });
    add("locked", { state: "locked" });
  } else if (fx.id === "objects/mist-beacon") {
    add("restored", { active: true });
    add("dormant", { active: false });
  } else if (fx.meta.autotile) {
    const mode=fx.meta.autotile;
    for (let mask=0;mask<16;mask++) {
      const edges=[...sides].filter((_,i)=>mask&(1<<i)).join("");
      const name=edges.toLowerCase()||"none";
      add(`edges-${name}`,{edges,corners:[]});
      if (["blend","shore","cliff","river"].includes(mode)) {
        const corners=["NE","SE","SW","NW"].filter(corner=>[...corner].every(side=>!edges.includes(side)));
        for (let bits=1;bits<2**corners.length;bits++) {
          const inside=corners.filter((_,i)=>bits&(1<<i));
          add(`edges-${name}-inside-${inside.join("-").toLowerCase()}`,{edges,corners:inside});
        }
      }
    }
  } else if (category === "machines" && options.facing) {
    const turns = options.turn ? ["left", "right"] : [undefined];
    for (const facing of ["north", "east", "south", "west"]) {
      for (const turn of turns) {
        const name = turn ? `${facing}-${turn}` : facing;
        const route = turn ? { facing, turn } : { facing };
        add(name, route);
        add(`${name}-idle`, { ...route, active: false });
      }
    }
  } else if (category === "machines" && options.active) {
    add("idle", { active: false });
  } else if (fx.id === "trees/tree-regrowth") {
    for (let stage = 0; stage <= 3; stage++) add(`stage-${stage}`, { stage });
  } else if (fx.id === "trees/falling-tree") {
    add("right", { flip: false });
    add("left", { flip: true });
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
        const joins = [...sides].filter(side => !edges.includes(side)).join("");
        add(`edge-${edges.toLowerCase() || "none"}${suffix}`, { edges, corners }, {
          terrain: { joins, corners, animated: true },
        });
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
  const hasCorners = clips.some(clip => clip.corners?.length);
  let fullTile = 0, boundaryTile = 0;
  for (const { joins, corners, animated, render } of clips) {
    const tileid = frames.length;
    const clip = animated ? render.frames : render.frames.slice(0, 1);
    frames.push(...clip);
    const wangid = [...sides].flatMap((side, i) => {
      const next = sides[(i + 1) % 4], edge = joins.includes(side);
      const corner = edge && joins.includes(next) && !corners?.includes(diagonals[i]);
      return [edge ? 2 : 1, hasCorners ? corner ? 2 : 1 : 0];
    });
    if (joins === sides && !corners?.length) fullTile = tileid;
    if (!joins) boundaryTile = tileid;
    wangtiles.push({ tileid, wangid });
    if (clip.length > 1) tiles.push({
      id: tileid,
      animation: clip.map((_, i) => ({ tileid: tileid + i, duration: frameDuration(i, fps) })),
    });
  }

  const { png, json } = spriteSheet(fx, { w, h, fps, frames }, name);
  const { w: imagewidth, h: imageheight } = json.meta.size;
  return {
    png,
    json: {
      type: "tileset", version: "1.10", name: fx.meta.name, tilewidth: w, tileheight: h,
      columns: imagewidth / w, tilecount: imagewidth * imageheight / (w * h),
      image: `${name}.png`, imagewidth, imageheight, margin: 0, spacing: 0, tiles,
      wangsets: [{
        name: fx.meta.name, type: hasCorners ? "mixed" : "edge", tile: fullTile, wangtiles,
        colors: [
          { name: "Boundary", color: "#65834b", tile: boundaryTile, probability: 1 },
          { name: fx.meta.name, color: "#be985d", tile: fullTile, probability: 1 },
        ],
      }],
    },
  };
}
