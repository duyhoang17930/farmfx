import { clearFrame, composite, createFrame, painterFor, ramp } from "../../src/core/index.js";
import { WINDKEEPER } from "../../src/fx/_kit/island-explorer.js";
import * as shore from "../../src/fx/exploration/coastal-shore.js";
import * as brackets from "../../src/fx/exploration/target-brackets.js";
import * as footprint from "../../src/fx/fx/build-footprint.js";
import * as telegraph from "../../src/fx/combat/ground-telegraph.js";
import * as touchAction from "../../src/fx/ui/components/touch-action.js";
import * as lootFlight from "../../src/fx/fx/loot-flight.js";
import { blueprints, clips, items, objects, treePalette } from "./art.js";
import { BRIDGE, canEnter, coast, GARDEN_WALK, HEIGHT, land, tileX, tileY, TILE, WIDTH } from "./islands.js";

const water = ramp(["#3d8296", "#509bad", "#64adba", "#8bc4c4", "#c7e9d9"]);
const surfaces = [
  shore.meta.options.palette,
  ["#4d4d74", "#665681", "#786694", "#866fa4", "#afa0cc"],
  ["#577e55", "#8fa969", "#9bb572", "#a8bd7e", "#d3d992"],
];
const beaches = [
  shore.meta.options.bank,
  ["#4f496b", "#76668b", "#9986aa", "#b5a0bd"],
  ["#81765d", "#a98b68", "#c8ad7b", "#e1c995"],
];
const fog = ramp(["#697797", "#8499ac", "#adc1ca", "#d4d9dc", "#f1e6e6"]);
const crystalColors = ["#40547c","#56789a","#78b5bd","#a0ddd5","#dbf4df"];
const W = WIDTH * TILE, H = HEIGHT * TILE;
const TAU = Math.PI * 2;

export function paint(frame, module, t, x, y, overrides, fade = 1) {
  const p = painterFor(frame);
  p.place(Math.round(x), Math.round(y));
  p.fade = fade;
  const options = { ...module.meta.options, ...overrides };
  const time = module.meta.loop ? t % module.meta.duration : Math.min(t, module.meta.duration);
  module.drawBack?.(p, time, options);
  module.draw(p, time, options);
}

export function iconUrl(module) {
  const frame = createFrame(...module.meta.size);
  paint(frame, module, 0.16, ...module.meta.origin);
  const canvas = document.createElement("canvas");
  canvas.width = frame.w;
  canvas.height = frame.h;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(frame.w, frame.h);
  composite(frame, image.data);
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

function paintSea(frame) {
  const { w, h, color } = frame;
  const step = new Uint8Array(w * h);
  for (let i = 0; i < step.length; i++) step[i] = color[i] ? 0 : 35;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (x) step[i] = Math.min(step[i], step[i - 1] + 3);
    if (y) {
      step[i] = Math.min(step[i], step[i - w] + 3);
      if (x) step[i] = Math.min(step[i], step[i - w - 1] + 4);
      if (x < w - 1) step[i] = Math.min(step[i], step[i - w + 1] + 4);
    }
  }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
    const i = y * w + x;
    if (x < w - 1) step[i] = Math.min(step[i], step[i + 1] + 3);
    if (y < h - 1) {
      step[i] = Math.min(step[i], step[i + w] + 3);
      if (x) step[i] = Math.min(step[i], step[i + w - 1] + 4);
      if (x < w - 1) step[i] = Math.min(step[i], step[i + w + 1] + 4);
    }
    if (!step[i]) continue;
    const ripple = Math.sin(x * 0.19 + y * 0.15) * 2;
    const depth = step[i] + ripple;
    color[i] = water[depth < 4 && (x + y * 2) % 19 < 8 ? 4 : depth < 11 + ripple ? 3 : depth < 24 ? 2 : 1];
  }
}

export function createScene(canvas, touchCanvas) {
  const ctx = canvas.getContext("2d", { alpha: false });
  const touchCtx = touchCanvas.getContext("2d");
  const touchFrame = createFrame(48, 48);
  const touchImage = touchCtx.createImageData(48, 48);
  const ground = createFrame(W, H);
  let frame, image, renderedUnlocked, touchKey;
  let left = 0, top = 0;

  function paintSample(target, entry, t) {
    paint(target, objects[entry.kind], t, entry.x, entry.y, {
      seed:entry.col*3+entry.row*17, tileX:entry.col, tileY:entry.row, ...entry.visual,
    });
  }

  function renderGround(unlocked) {
    renderedUnlocked = unlocked;
    clearFrame(ground);
    for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
      const island = land(x, y);
      if (!island) continue;
      paint(ground, shore, 0, tileX(x), tileY(y), {
        ...coast(x, y), tileX: x, tileY: y,
        palette: surfaces[island - 1], bank: beaches[island - 1],
      });
    }
    paintSea(ground);
    for (let row = 27; row <= 53; row++) {
      paint(ground,objects["tiles/dirt-path"],0,tileX(10),tileY(row),{
        edges:row===27?"S":row===53?"N":"NS", tileX:10, tileY:row,
        palette:["#a3996e","#b1a474","#b7a97a","#bcaf81","#bfb285"],
      });
    }
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    const scale = Math.max(1.48, box.height / 256, box.width / 384);
    const w = Math.min(384, Math.max(1, Math.round(box.width / scale)));
    const h = Math.min(256, Math.max(1, Math.round(box.height / scale)));
    if (frame?.w === w && frame?.h === h) return;
    canvas.width = w;
    canvas.height = h;
    frame = createFrame(w, h);
    image = ctx.createImageData(w, h);
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  function draw(state, t) {
    if (renderedUnlocked !== state.unlocked) renderGround(state.unlocked);
    const { player } = state;
    const clamp = (value, max) => Math.max(0, Math.min(max, Math.round(value)));
    left = frame.ox = clamp(player.x - frame.w / 2, W - frame.w);
    top = frame.oy = clamp(player.y - frame.h / 2, H - frame.h);
    frame.light.fill(0);
    for (let row = 0; row < frame.h; row++) {
      const from = (row + top) * W + left;
      frame.color.set(ground.color.subarray(from, from + frame.w), row * frame.w);
    }

    const p = painterFor(frame);
    for (let i = 0; i < 275; i++) {
      const wx = (i * 83 + Math.floor(t * (2 + i % 3))) % W;
      const wy = (i * 59) % H;
      if (!land(Math.floor(wx / TILE), Math.floor(wy / TILE))) {
        p.line(wx, wy, wx + 2 + i % 5, wy, water[i % 8 === 0 ? 4 : 3], 0.66);
      }
    }

    const placed = state.structures.filter(s => s.kind === "bridge");
    for (const [index,[col,row]] of BRIDGE.entries()) {
      const entry = placed.find(e => e.col === col && e.row === row);
      if (entry) paint(frame, objects.bridge, t, entry.x, entry.y, { ends: index ? "end" : "start" });
    }
    for (const [index,[col,row]] of GARDEN_WALK.entries()) {
      paint(frame, objects.bridge, t, tileX(col),tileY(row), {
        facing: "north-south", ends: index ? "end" : "start",
      });
    }
    for (const entry of state.scenery) {
      if (entry.ground && entry.x >= left-16 && entry.x <= left+frame.w+16 &&
          entry.y >= top-16 && entry.y <= top+frame.h+16) paintSample(frame,entry,t);
    }
    if (state.attack) paint(frame, telegraph, state.attack.t, state.attack.x, state.attack.y, state.attack);

    for (const node of state.nodes) {
      if (node.hp || node.respawn === undefined || !canEnter(node.island,state.unlocked)) continue;
      if (node.x < left-24 || node.x > left+frame.w+24 || node.y < top-18 || node.y > top+frame.h+24) continue;
      if (state.structures.some(entry => node.col >= entry.col && node.col < entry.col+entry.width && node.row === entry.row)) continue;
      paint(frame, objects[node.kind],t,node.x,node.y, {
        ...node.visual, stump: true, condition: node.kind === "flowers" ? "picked" : "depleted",
      });
    }

    if (state.placement) {
      const { col, row, kind, blocked, affordable } = state.placement;
      const { width, height } = blueprints[kind];
      if (kind === "bridge") {
        for (const [x, y] of BRIDGE) {
          if (x === col && y === row || state.structures.some(e => e.kind === "bridge" && e.col === x && e.row === y)) continue;
          paint(frame, footprint, t, tileX(x), tileY(y), { columns: 1, rows: 1, blocked: [] }, 0.59);
        }
      }
      paint(frame, footprint, t, tileX(col), tileY(row), {
        columns: width, rows: height, blocked,
        ...(!affordable ? { palette: ["#43384f", "#57435b", "#766079", "#a88da4", "#d8b9cd"] } : {}),
      });
    }

    const drawables = [...state.nodes, ...state.structures, ...state.fixtures, ...state.scenery]
      .filter(e => e.hp !== 0 && !e.ground && e.kind !== "bridge" && canEnter(e.island,state.unlocked));
    drawables.push(player);
    if (state.guardian.hp > 0 && state.unlocked) drawables.push(state.guardian);
    drawables.sort((a, b) => a.y - b.y);

    for (const entity of drawables) {
      if (entity.x < left - 60 || entity.x > left + frame.w + 60 ||
          entity.y < top - 45 || entity.y > top + frame.h + 65) continue;
      if (entity === player) {
        const clip = clips[player.action?.clip ?? (player.moving ? "walk" : "idle")];
        const blink = player.invulnerable > 0 && Math.floor(t * 14) % 2 === 0;
        paint(frame, clip, player.action?.t ?? t, player.x, player.y,
          { facing: player.facing, palette: WINDKEEPER, outfit: "windkeeper",
            ...(player.action?.clip === "gatherFlowers" ? {heldItem:"flower-seed"} : {}) }, blink ? 0.49 : 1);
      } else if (entity.name) {
        paintSample(frame,entity,t);
      } else {
        const activity = entity.kind === "beacon" ? { active: state.restored }
          : entity.kind === "forge" ? { active: state.jobs.some(job => job.station === entity.id) } : {};
        const styling = entity.kind === "pine" ? {
          palette: treePalette(entity.island,entity.visual.tint), chipped: entity.hp === 1,
        } : entity.kind === "crystals" ? { palette: crystalColors }
          : entity.kind === "flowers" && entity.island === 2 ? { tint: 1 }
          : entity.kind === "trailSign" ? { label: entity.island === 3 ? "VINH" : "VUON", pointing: "left" } : {};
        const seed = entity.col * 3 + entity.row * 17;
        const recoil = entity.recoil ?? 0;
        const sway = Math.round(Math.sin(recoil * 48) * recoil * 13 * (entity.hitDirection ?? 1));
        const x = entity.x + (entity.kind === "pine" ? 0 : sway);
        const blocksPlayer = entity.kind === "pine" && player.y < entity.y &&
          entity.y - player.y < 50 && Math.abs(player.x - x) < 16;
        paint(frame, objects[entity.kind], t, x, entity.y, {
          condition: entity.hp === 1 && entity.kind !== "flowers" ? "chipped" : "fresh", ...entity.visual, ...activity,
          ...styling, seed, bend: sway, facing: entity.facing ?? (entity.kind === "turtle" ? "right" : "down"),
          state: entity.kind === "guardian" && state.attack ? "attack" : entity.moving ? "move" : "idle",
        }, blocksPlayer ? 0.54 : 1);
      }
    }

    if (state.placement) {
      const { x, y, kind, blocked } = state.placement;
      paint(frame, objects[kind], t, x, y,
        { active: false }, blocked.length ? 0.34 : 0.63);
    } else if (state.focus) {
      const { entity, near, width, height } = state.focus;
      paint(frame, brackets, t, entity.x, entity.y, { width, height, state: near ? entity.kind === "guardian" ? "hostile" : "ready" : "distant" });
    }
    for (const effect of state.effects) effect.draw(frame);
    for (const loot of state.loot) {
      if (loot.t < 0) continue;
      paint(frame, lootFlight, loot.t, loot.x, loot.y,
        { item: items[loot.item].icon, toX: player.x - loot.x, toY: player.y - loot.y - 14, drift: loot.drift });
    }
    if (!state.unlocked) {
      const fogPainter = painterFor(frame);
      for (let i = 0; i < 18; i++) {
        const phase = t * (0.16 + i % 4 * 0.018) + i;
        const x = 265 + (i * 29) % 100 + 14 * Math.cos(phase);
        const y = 64 + (i * 37) % 131 + 7 * Math.sin(phase * 2);
        for (let j = -1; j <= 1; j++) {
          fogPainter.disc(x + j * 8, y + j * 2, 6 + i % 4, fog[3], d => 0.29 * (1 - d));
        }
      }
    }
    composite(frame, image.data);
    ctx.putImageData(image, 0, 0);
  }

  function drawTouch(state, progress, mark, tool) {
    const step = Math.round(progress * 32);
    const key = [state, step, mark, tool].join("/");
    if (key === touchKey) return;
    touchKey = key;
    paint(clearFrame(touchFrame), touchAction, 0, 24, 24, { state, progress: step / 32, mark, tool });
    composite(touchFrame, touchImage.data);
    touchCtx.putImageData(touchImage, 0, 0);
  }

  function atPointer(event) {
    const rect = canvas.getBoundingClientRect();
    return [left + (event.clientX - rect.left) * frame.w / rect.width, top + (event.clientY - rect.top) * frame.h / rect.height];
  }

  function inspect(x,y,entries,t) {
    const pixel = createFrame(1,1,Math.floor(x),Math.floor(y));
    const layers = entries.filter(e => e.name).sort((a,b) => Number(Boolean(b.ground))-Number(Boolean(a.ground)) || a.y-b.y);
    for (let i = layers.length-1; i >= 0; i--) {
      const entry = layers[i];
      const { size, origin } = objects[entry.kind].meta;
      const dx=x-entry.x+origin[0], dy=y-entry.y+origin[1];
      if (dx<0 || dy<0 || dx>=size[0] || dy>=size[1]) continue;
      paintSample(pixel,entry,t);
      if ((pixel.color[0] >>> 24) >= 160) return entry;
      clearFrame(pixel);
    }
    return null;
  }

  return { draw, drawTouch, atPointer, inspect };
}
