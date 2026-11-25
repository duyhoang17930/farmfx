import { clearFrame, composite, createFrame, painterFor, ramp } from "../../src/core/index.js";
import * as shore from "../../src/fx/exploration/island-shore.js";
import * as brackets from "../../src/fx/exploration/target-brackets.js";
import * as footprint from "../../src/fx/fx/build-footprint.js";
import * as telegraph from "../../src/fx/combat/ground-telegraph.js";
import * as touchAction from "../../src/fx/ui/components/touch-action.js";
import * as lootFlight from "../../src/fx/fx/loot-flight.js";
import { blueprints, clips, items, objects } from "./art.js";
import { BRIDGE, coast, HEIGHT, land, tileX, tileY, TILE, WIDTH } from "./islands.js";

const water = ramp(["#203941", "#26454d", "#315a60", "#4b7775", "#7ba397"]);
const cove = ["#324e3f", "#45604b", "#577450", "#77945a", "#a7ac69"];
const bank = ["#383d55", "#494d64", "#595a73", "#777d92", "#a5a5ab"];
const fog = ramp(["#514e67", "#62637c", "#8f8ba2", "#b2a5b4", "#d6bdc3"]);
const outfit = ["#172e38", "#254553", "#306e76", "#75b2a8", "#d5e6bf"];
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
    const p = painterFor(ground);
    p.rect(0, 0, W, H, water[1]);
    for (let i = 0; i < 680; i++) {
      const x = (i * 127 + Math.floor(i / 8) * 3) % W;
      const y = (i * 71 + Math.floor(i / 11)) % H;
      p.line(x, y, x + 1 + i % 6, y, water[i % 7 ? 0 : 2], 0.58);
    }
    for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
      const island = land(x, y);
      if (!island) continue;
      paint(ground, shore, 0, tileX(x), tileY(y), {
        ...coast(x, y), tileX: x, tileY: y,
        palette: island === 1 ? cove : bank,
        ...(island === 2 ? { bank: ["#39334c", "#57506d", "#756983", "#92849b"] } : {}),
      });
      if (island === 2 && !unlocked) {
        const overlay = painterFor(ground);
        overlay.rect(x * TILE + 2, y * TILE + 2, 12, 12, fog[1], 0.42);
      }
    }
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
    for (let i = 0; i < 220; i++) {
      const wx = (i * 83 + Math.floor(t * (2 + i % 3))) % W;
      const wy = (i * 59) % H;
      if (!land(Math.floor(wx / TILE), Math.floor(wy / TILE))) {
        p.line(wx, wy, wx + 2 + i % 5, wy, water[2 + (i % 11 === 0 ? 1 : 0)], 0.66);
      }
    }

    for (const entry of state.structures.filter(s => s.kind === "bridge")) {
      paint(frame, objects.bridge, t, entry.x, entry.y, { edges: "EW", facing: "east" });
    }
    if (state.attack) paint(frame, telegraph, state.attack.t, state.attack.x, state.attack.y, state.attack);

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
        paint(frame, clip, player.action?.t ?? t, player.x, player.y, { facing: player.facing, palette: outfit }, blink ? 0.49 : 1);
      } else {
        const activity = entity.kind === "beacon" ? { active: state.restored }
          : entity.kind === "forge" ? { active: state.jobs.some(job => job.station === entity.id) } : {};
        const seed = entity.col * 3 + entity.row * 17;
        const sway = entity.flash > 0 ? Math.round(Math.sin(entity.flash * 61) * entity.flash * 10) : 0;
        const x = entity.x + sway;
        paint(frame, objects[entity.kind], t, x, entity.y, { ...activity, seed, facing: entity.facing ?? "down",
          state: entity.kind === "guardian" && state.attack ? "attack" : entity.moving ? "move" : "idle" });
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
      for (let i = 0; i < 14; i++) {
        const phase = t * (0.2 + i % 4 * 0.026) + i;
        const x = 263 + i * 8 + 13 * Math.cos(phase);
        const y = 64 + (i * 37) % 131 + 7 * Math.sin(phase * 2);
        fogPainter.disc(x, y, 8 + i % 6, fog[3], 0.14);
      }
    }
    composite(frame, image.data);
    ctx.putImageData(image, 0, 0);
  }

  function drawTouch(state, progress, mark) {
    const step = Math.round(progress * 32);
    const key = [state, step, mark].join("/");
    if (key === touchKey) return;
    touchKey = key;
    paint(clearFrame(touchFrame), touchAction, 0, 24, 24, { state, progress: step / 32, mark });
    composite(touchFrame, touchImage.data);
    touchCtx.putImageData(touchImage, 0, 0);
  }

  function atPointer(event) {
    const rect = canvas.getBoundingClientRect();
    return [left + (event.clientX - rect.left) * frame.w / rect.width, top + (event.clientY - rect.top) * frame.h / rect.height];
  }
  return { draw, drawTouch, atPointer };
}
