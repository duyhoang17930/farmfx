import { clearFrame, composite, createFrame, painterFor, ramp, rand } from "../../src/core/index.js";
import { WINDKEEPER } from "../../src/fx/_kit/island-explorer.js";
import * as shore from "../../src/fx/exploration/island-shore.js";
import * as brackets from "../../src/fx/exploration/target-brackets.js";
import * as footprint from "../../src/fx/fx/build-footprint.js";
import * as telegraph from "../../src/fx/combat/ground-telegraph.js";
import * as touchAction from "../../src/fx/ui/components/touch-action.js";
import * as lootFlight from "../../src/fx/fx/loot-flight.js";
import { blueprints, clips, items, objects } from "./art.js";
import { BRIDGE, coast, HEIGHT, land, tileX, tileY, TILE, WIDTH } from "./islands.js";

const water = ramp(["#3d8296", "#509bad", "#64adba", "#8bc4c4", "#c7e9d9"]);
const cove = ["#528258", "#76a366", "#8eb56d", "#9fc377", "#d1db8a"];
const bank = ["#6b6a83", "#8d88a2", "#a198b0", "#ada8bf", "#d6c8cf"];
const beaches = [
  ["#7e7861", "#ab9267", "#c5a778", "#e5c993"],
  ["#706582", "#9786a2", "#b8a0b4", "#d1b6c3"],
];
const fog = ramp(["#697797", "#8499ac", "#adc1ca", "#d4d9dc", "#f1e6e6"]);
const groundDetails = [ramp(["#adc981", "#e1d89a"]), ramp(["#b7acc4", "#d8c7d1"])];
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
    color[i] = water[depth < 5 && (x + y * 2) % 19 < 12 ? 4 : depth < 16 ? 3 : depth < 27 ? 2 : 1];
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

  function renderGround(unlocked) {
    renderedUnlocked = unlocked;
    clearFrame(ground);
    for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
      const island = land(x, y);
      if (!island) continue;
      paint(ground, shore, 0, tileX(x), tileY(y), {
        ...coast(x, y), tileX: x, tileY: y,
        palette: island === 1 ? cove : bank, bank: beaches[island - 1], meadow: true,
      });
      if (island === 1 || unlocked) {
        const detail = painterFor(ground);
        const seed = rand(x, y, 74);
        const wx = x * TILE + 5 + Math.floor(seed * 6), wy = y * TILE + 8;
        if (seed < 0.2) {
          const color = groundDetails[island - 1];
          detail.px(wx, wy, color[1]);
          detail.line(wx + 2, wy + 2, wx + 3, wy + 2, color[0]);
        }
      }
    }
    paintSea(ground);
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    const scale = Math.max(1.48, box.height / H, box.width / W);
    const w = Math.min(W, Math.max(1, Math.round(box.width / scale)));
    const h = Math.min(H, Math.max(1, Math.round(box.height / scale)));
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
    for (let i = 0; i < 175; i++) {
      const wx = (i * 83 + Math.floor(t * (2 + i % 3))) % W;
      const wy = (i * 59) % H;
      if (!land(Math.floor(wx / TILE), Math.floor(wy / TILE))) {
        p.line(wx, wy, wx + 2 + i % 5, wy, water[i % 8 === 0 ? 4 : 3], 0.66);
      }
    }

    for (const entry of state.structures.filter(s => s.kind === "bridge")) {
      paint(frame, objects.bridge, t, entry.x, entry.y, { edges: "EW", facing: "east" });
    }
    if (state.attack) paint(frame, telegraph, state.attack.t, state.attack.x, state.attack.y, state.attack);

    for (const node of state.nodes) {
      if (node.kind !== "pine" || node.hp || !node.respawn || (node.island === 2 && !state.unlocked)) continue;
      if (state.structures.some(entry => node.col >= entry.col && node.col < entry.col + entry.width && node.row === entry.row)) continue;
      paint(frame, objects.pine, t, node.x, node.y, { stump: true });
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

    const drawables = [...state.nodes, ...state.structures, ...state.fixtures]
      .filter(e => e.hp !== 0 && e.kind !== "bridge" && (state.unlocked || e.island !== 2));
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
          { facing: player.facing, palette: WINDKEEPER, outfit: "windkeeper" }, blink ? 0.49 : 1);
      } else {
        const activity = entity.kind === "beacon" ? { active: state.restored }
          : entity.kind === "forge" ? { active: state.jobs.some(job => job.station === entity.id) } : {};
        const seed = entity.col * 3 + entity.row * 17;
        const recoil = entity.recoil ?? 0;
        const sway = Math.round(Math.sin(recoil * 48) * recoil * 13 * (entity.hitDirection ?? 1));
        const x = entity.x + (entity.kind === "pine" ? 0 : sway);
        const blocksPlayer = entity.kind === "pine" && player.y < entity.y &&
          entity.y - player.y < 40 && Math.abs(player.x - x) < 15;
        paint(frame, objects[entity.kind], t, x, entity.y, {
          ...activity, seed, bend: sway, facing: entity.facing ?? "down",
          state: entity.kind === "guardian" && state.attack ? "attack" : entity.moving ? "move" : "idle",
        }, blocksPlayer ? 0.54 : 1);
      }
    }

    if (state.placement) {
      const { x, y, kind, blocked } = state.placement;
      paint(frame, objects[kind], t, x, y,
        { active: false, ...(kind === "bridge" ? { edges: "EW", facing: "east" } : {}) }, blocked.length ? 0.34 : 0.63);
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
  return { draw, drawTouch, atPointer };
}
