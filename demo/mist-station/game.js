import { createFx } from "../../src/core/index.js";
import * as lootFlight from "../../src/fx/fx/loot-flight.js";
import * as telegraph from "../../src/fx/combat/ground-telegraph.js";
import * as impact from "../../src/fx/fx/resource-hit.js";
import * as breakRock from "../../src/fx/fx/ore-break.js";
import * as fallTree from "../../src/fx/fx/tree-fall-dust.js";
import * as spawns from "../../src/fx/fx/resource-respawn.js";
import * as buildFx from "../../src/fx/fx/build-placement.js";
import * as craftFx from "../../src/fx/fx/crafting-complete.js";
import * as landFx from "../../src/fx/exploration/island-unlock-reveal.js";
import * as restoreFx from "../../src/fx/fx/power-pulse.js";
import * as swordFx from "../../src/fx/combat/sword-slash.js";
import * as hitFx from "../../src/fx/combat/enemy-hit.js";
import { blueprints, clips, items, recipes } from "./art.js";
import { BRIDGE, cellX, cellY, findRoute, LAND_PRICE, land, NODE_POSITIONS, START, tileX, tileY, within } from "./islands.js";
import { createScene } from "./scene.js";
import { createInterface } from "./interface.js";

const SAVE = "farmfx-mist-station-v1";
const REACH = 25, BUILD_REACH = 60, HOLD = 0.31;
const rules = {
  pine: { name: "Thông gió", action: "Chặt", mark: "A", hp: 2, item: "wood", count: 2, clip: "axe", bounds: [27, 36] },
  stone: { name: "Đá bờ biển", action: "Đập", mark: "P", hp: 2, item: "stone", count: 2, clip: "pick", bounds: [22, 15] },
  ore: { name: "Mạch sắt", action: "Đào", mark: "P", hp: 2, item: "ore", count: 2, clip: "pick", bounds: [24, 19] },
  workbench: { name: "Bàn chế tạo", action: "Chế tạo", mark: "+", bounds: [32, 23] },
  forge: { name: "Lò luyện", action: "Luyện", mark: "+", bounds: [31, 31] },
  dock: { name: "Bến trao đổi", action: "Trao đổi", mark: "+", bounds: [43, 21] },
  beacon: { name: "Trạm thời tiết", action: "Khôi phục", mark: "*", bounds: [35, 44] },
  guardian: { name: "Hộ vệ tinh thể", action: "Đánh", mark: "X", bounds: [25, 30] },
};

function readSave() {
  try { return JSON.parse(localStorage.getItem(SAVE)) ?? {}; }
  catch { return {}; }
}
const saved = readSave();

function at(kind, col, row, id = kind + "-" + col + "-" + row) {
  const width = blueprints[kind]?.width ?? 1;
  const height = blueprints[kind]?.height ?? 1;
  return { id, kind, col, row, x: tileX(col) + (width - 1) * 8,
    y: tileY(row + height - 1), island: land(col, row), width, height };
}

const player = { kind: "player", x: tileX(START[0]), y: tileY(START[1]),
  health: 4, facing: "down", moving: false, invulnerable: 0, action: null };
const guardian = { ...at("guardian", 18, 8), hp: saved.guardianDefeated ? 0 : 4, cooldown: 0.8, facing: "left" };
const state = {
  player, guardian, fixtures: [at("dock", 12, 8), at("beacon", 20, 6)],
  structures: [at("workbench", 5, 6), ...(saved.structures ?? []).map(e => at(e.kind, e.col, e.row))],
  nodes: NODE_POSITIONS.map(([kind, x, y]) => ({ ...at(kind, x, y), hp: rules[kind]?.hp ?? 1, flash: 0 })),
  inventory: { wood: 1, stone: 0, ore: 0, ingot: 0, coin: 0, pearl: 0, core: 0, ...saved.inventory },
  unlocked: !!saved.unlocked, restored: !!saved.restored, jobs: saved.jobs ?? [],
  effects: [], loot: [], attack: null, focus: null, placement: null,
};

function save() {
  const inventory = { ...state.inventory };
  for (const loot of state.loot) inventory[loot.item] += loot.count;
  try {
    localStorage.setItem(SAVE, JSON.stringify({
      inventory, structures: state.structures.slice(1).map(({ kind, col, row }) => ({ kind, col, row })),
      unlocked: state.unlocked, restored: state.restored, guardianDefeated: guardian.hp === 0, jobs: state.jobs,
    }));
  } catch { /* Storage can be disabled on the device. */ }
}

function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function onSquare(e, x, y) {
  return x >= e.col && x < e.col + e.width && y >= e.row && y < e.row + e.height;
}
function occupied(x, y, countBridge = false) {
  return state.structures.some(e => (countBridge || e.kind !== "bridge") && onSquare(e, x, y)) ||
    state.nodes.some(e => e.hp > 0 && e.kind !== "flowers" && onSquare(e, x, y)) ||
    state.fixtures.some(e => onSquare(e, x, y));
}
for (const node of state.nodes) {
  if (state.structures.some(s => onSquare(s, node.col, node.row))) node.hp = 0;
}
function passable(x, y) {
  const island = land(x, y);
  const hasBridge = state.structures.some(e => e.kind === "bridge" && onSquare(e, x, y));
  return within(x, y) && (hasBridge || island === 1 || (island === 2 && state.unlocked)) &&
    (!occupied(x, y) || state.fixtures.some(e => e.kind === "dock" && onSquare(e, x, y)));
}

const canvas = document.querySelector("#world");
const scene = createScene(canvas, document.querySelector("#action-icon"));
const keys = new Set();
let route = [], pin = null, goalTarget = null, selection = null, cursor = null, dashVector = [0, 0];
let touchVector = [0, 0], held = null, audioEnabled = false, audioContext;
const audioFiles = {
  chop: "exploration/chop.wav", mine: "exploration/mine.wav", pickup: "exploration/pickup.wav",
  craft: "exploration/craft-complete.wav", unlock: "exploration/land-unlock.wav",
  build: "gameplay/building-placement.wav", hit: "combat/sword-hit.wav", hurt: "combat/player-hurt.wav",
};
const audioBuffers = new Map();

function sound(id) {
  if (!audioEnabled || !audioContext) return;
  if (!audioBuffers.has(id)) {
    audioBuffers.set(id, fetch("../../audio/" + audioFiles[id]).then(response => response.arrayBuffer())
      .then(buffer => audioContext.decodeAudioData(buffer)).catch(() => null));
  }
  audioBuffers.get(id).then(buffer => {
    if (!audioEnabled || !buffer) return;
    const source = audioContext.createBufferSource();
    const volume = audioContext.createGain();
    source.buffer = buffer;
    volume.gain.value = id === "pickup" ? 0.22 : 0.34;
    source.connect(volume).connect(audioContext.destination);
    source.start();
  });
}

const afford = cost => Object.entries(cost).every(([item, count]) => state.inventory[item] >= count);
function pay(cost) {
  for (const [item, count] of Object.entries(cost)) state.inventory[item] -= count;
}
function effect(module, x, y, options = {}) {
  state.effects.push(createFx(module, { x, y, ...options }));
}
function launch(item, count, x, y) {
  for (let i = 0; i < count; i++) state.loot.push({ item, count: 1, x, y, t: -i * 0.075, drift: (i % 2 ? 1 : -1) * (5 + i * 2) });
}

const ui = createInterface(state, {
  afford, recipes, blueprints,
  plan(kind) {
    selection = selection === kind ? null : kind;
    cursor = null;
    pin = goalTarget = null;
    route = [];
    if (selection) ui.toast("Chạm vào ô trên bản đồ để chọn vị trí.");
    refreshFocus();
  },
  craft(id, station) {
    const recipe = recipes[id];
    if (!recipe || !station || station.kind !== recipe.station || distance(player, station) > REACH) return;
    if (!afford(recipe.cost)) return ui.toast("Thiếu nguyên liệu.");
    if (state.jobs.some(job => job.station === station.id)) return ui.toast("Máy đang hoạt động.");
    pay(recipe.cost);
    state.jobs.push({ id, station: station.id, end: Date.now() + recipe.time });
    save();
  },
  trade() {
    if (distance(player, state.fixtures[0]) > REACH || !afford({ ingot: 1 })) return;
    pay({ ingot: 1 });
    launch("coin", 3, state.fixtures[0].x, state.fixtures[0].y);
    sound("craft");
    save();
  },
  unlock() {
    const dock = state.fixtures[0];
    if (state.unlocked || distance(player, dock) > REACH || !afford({ coin: LAND_PRICE })) return;
    pay({ coin: LAND_PRICE });
    state.unlocked = true;
    effect(landFx, tileX(18), tileY(8));
    sound("unlock");
    ui.toast("Đã mở quyền cập bờ Bãi Tím.");
    save();
  },
  sound() {
    try {
      audioContext ??= new AudioContext();
      audioEnabled = !audioEnabled;
      if (audioEnabled) audioContext.resume().catch(() => {});
    } catch { audioEnabled = false; }
    return audioEnabled;
  },
  closeBuild() { selection = cursor = null; refreshFocus(); },
  dash: startDash,
});

function targets() {
  return [...state.nodes.filter(n => n.hp && rules[n.kind]), ...state.structures.filter(s => rules[s.kind]),
    ...state.fixtures, ...(guardian.hp && state.unlocked ? [guardian] : [])].filter(e => e.island !== 2 || state.unlocked);
}
function nearest() {
  return targets().filter(e => distance(player, e) <= 34)
    .sort((a, b) => (distance(player, a) - (a === guardian ? 7 : 0)) - (distance(player, b) - (b === guardian ? 7 : 0)))[0];
}
function face(dx, dy) {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}
const vectors = { left: [-1,0], right: [1,0], up: [0,-1], down: [0,1] };
function frontCell() {
  const [dx, dy] = vectors[player.facing];
  return [cellX(player.x) + dx, cellY(player.y) + dy];
}

function evaluatePlacement(kind, col, row) {
  const entry = at(kind, col, row);
  const blocked = [];
  for (let i = 0; i < entry.width * entry.height; i++) {
    const x = col + i % entry.width, y = row + Math.floor(i / entry.width);
    const terrain = kind === "bridge" ? BRIDGE.some(([bx, by]) => x === bx && y === by)
      : land(x, y) === 1 || land(x, y) === 2 && state.unlocked;
    const feet = cellX(player.x) === x && cellY(player.y) === y;
    const guard = guardian.hp > 0 && state.unlocked && cellX(guardian.x) === x && cellY(guardian.y) === y;
    if (!terrain || occupied(x, y, true) || feet || guard) blocked.push(i);
  }
  const affordable = afford(blueprints[kind].cost);
  const near = distance(player, entry) <= BUILD_REACH;
  return { ...entry, blocked, affordable, near };
}

function refreshFocus() {
  if (pin?.hp === 0) pin = null;
  if (selection) {
    const [x, y] = cursor ?? frontCell();
    state.placement = within(x, y) ? evaluatePlacement(selection, x, y) : null;
    state.focus = null;
  } else {
    state.placement = null;
    const entity = pin ?? nearest();
    if (entity) {
      const [width, height] = rules[entity.kind].bounds;
      state.focus = { entity, width, height, near: distance(player, entity) <= REACH };
    } else state.focus = null;
  }
}

function startClip(clip, contact) {
  player.action = { clip, t: 0, called: false, contact };
}
function place() {
  const tile = state.placement;
  if (!tile) return;
  if (tile.blocked.length) return ui.toast("Ô bị chặn hoặc nền không phù hợp.");
  if (!tile.near) return ui.toast("Tiến lại gần vị trí xây.");
  if (!tile.affordable) return ui.toast("Thiếu nguyên liệu xây.");
  pay(blueprints[tile.kind].cost);
  state.structures.push(at(tile.kind, tile.col, tile.row));
  startClip("building");
  effect(buildFx, tile.x, tile.y);
  sound("build");
  ui.toast("Đã đặt " + blueprints[tile.kind].name.toLowerCase() + ".");
  if (tile.kind !== "bridge" || BRIDGE.every(([x, y]) => state.structures.some(e => e.kind === "bridge" && onSquare(e, x, y)))) {
    selection = cursor = null;
  }
  save();
}

function strike(target) {
  if (!target.hp || distance(player, target) > REACH + 5) return;
  if (target === guardian) {
    target.hp--;
    effect(hitFx, target.x, target.y);
    sound("hit");
    if (target.hp === 0) {
      state.attack = null;
      launch("pearl", 1, target.x, target.y);
      save();
    }
    return;
  }
  const rule = rules[target.kind];
  target.hp--;
  target.flash = 0.19;
  sound(target.kind === "pine" ? "chop" : "mine");
  effect(target.hp ? impact : target.kind === "pine" ? fallTree : breakRock, target.x, target.y);
  if (target.hp === 0) {
    target.respawn = 28;
    launch(rule.item, rule.count, target.x, target.y);
    save();
  }
}

function interact() {
  if (player.action) return;
  refreshFocus();
  if (selection) return place();
  if (!state.focus?.near) {
    if (state.focus) goTo(state.focus.entity);
    else ui.toast("Tiến lại gần cây, quặng hoặc một trạm.");
    return;
  }
  const target = state.focus.entity;
  player.facing = face(target.x - player.x, target.y - player.y);
  if (target.kind === "forge" || target.kind === "workbench" || target.kind === "dock") {
    ui.open(target.kind, target);
  } else if (target.kind === "beacon") {
    if (state.restored) return ui.toast("Trạm đang truyền tín hiệu.");
    if (!afford({ core: 1 })) return ui.toast("Cần một lõi phong vũ.");
    pay({ core: 1 });
    state.restored = true;
    startClip("building");
    effect(restoreFx, target.x, target.y - 23);
    sound("unlock");
    ui.toast("Trạm Sương đã hoạt động!");
    save();
  } else {
    const clip = target === guardian ? "sword" : rules[target.kind].clip;
    startClip(clip, () => {
      if (clip === "sword") effect(swordFx, target.x, target.y, { flip: player.facing === "left" });
      strike(target);
    });
  }
}

function goTo(entity) {
  pin = entity;
  if (distance(player, entity) <= REACH) {
    route = [];
    goalTarget = null;
    interact();
    return;
  }
  goalTarget = entity;
  route = findRoute(cellX(player.x), cellY(player.y), cellX(entity.x), cellY(entity.y), passable, 1);
  if (!route.length) { goalTarget = null; ui.toast("Chưa có đường tới mục tiêu."); }
}

function pointerTarget(x, y) {
  const score = e => Math.abs(x - e.x) + Math.abs(y - (e.y - rules[e.kind].bounds[1] / 3)) * 0.35;
  return targets().filter(e => {
    const [w, h] = rules[e.kind].bounds;
    return Math.abs(x - e.x) < w / 2 + 4 && y <= e.y + 6 && y >= e.y - h;
  }).sort((a, b) => score(a) - score(b) || b.y - a.y)[0];
}

function startDash() {
  if (player.action) return;
  route = [];
  pin = goalTarget = null;
  dashVector = vectors[player.facing];
  player.invulnerable = Math.max(player.invulnerable, 0.31);
  startClip("dash");
}

function movement() {
  const x = Number(keys.has("KeyD") || keys.has("ArrowRight")) - Number(keys.has("KeyA") || keys.has("ArrowLeft"));
  const y = Number(keys.has("KeyS") || keys.has("ArrowDown")) - Number(keys.has("KeyW") || keys.has("ArrowUp"));
  return x || y ? [x, y] : touchVector;
}
function move(dt) {
  let [dx, dy] = movement();
  let magnitude = Math.hypot(dx, dy), speed = 59;
  if (magnitude > 0.1) {
    route = [];
    goalTarget = pin = null;
  } else if (route.length) {
    const [x, y] = route[0];
    dx = x - player.x; dy = y - player.y; magnitude = Math.hypot(dx, dy);
    if (magnitude < 1.05) { route.shift(); return; }
    speed = Math.min(speed, magnitude / dt);
  } else if (goalTarget) {
    const target = goalTarget;
    goalTarget = null;
    if (target === guardian && target.hp && distance(player, target) > REACH) goTo(target);
    else if (distance(player, target) <= REACH) interact();
    return;
  }
  if (player.action?.clip === "dash") {
    [dx, dy] = dashVector;
    magnitude = 1;
    speed = player.action.t < 0.27 ? 132 : 0;
  } else if (player.action) { player.moving = false; return; }
  else if (magnitude > 0.1) player.facing = face(dx, dy);
  player.moving = magnitude > 0.1 && speed > 0;
  if (!player.moving) return;
  const bound = route.length ? 1 : Math.min(1, magnitude);
  const stepX = dx / magnitude * dt * speed * bound, stepY = dy / magnitude * dt * speed * bound;
  const nx = player.x + stepX, ny = player.y + stepY;
  if (passable(cellX(nx + Math.sign(stepX) * 2), cellY(player.y))) player.x = nx;
  if (passable(cellX(player.x), cellY(ny + Math.sign(stepY) * 2))) player.y = ny;
}

function insideArea(x, y, polygon) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [a, b] = polygon[i], [c, d] = polygon[j];
    if ((b > y) !== (d > y) && x < (c - a) * (y - b) / (d - b) + a) hit = !hit;
  }
  return hit;
}

let pattern = 0;
function moveGuardian(dt) {
  if (!state.unlocked || !guardian.hp) return;
  if (state.attack) {
    const a = state.attack;
    a.t += dt;
    if (!a.resolved && a.t >= telegraph.meta.events.damage) {
      a.resolved = true;
      if (!player.invulnerable && insideArea(player.x - a.x, player.y - a.y, telegraph.telegraphArea(a))) {
        player.health--;
        player.invulnerable = 1.05;
        player.moving = false;
        route = [];
        goalTarget = null;
        sound("hurt");
        startClip("hurt");
        if (player.health === 0) {
          player.health = 4;
          player.x = tileX(START[0]); player.y = tileY(START[1]);
          pin = selection = cursor = null;
          ui.open("guide");
          ui.toast("Bạn đã quay lại Vịnh Rêu.");
        }
      }
    }
    if (a.t >= telegraph.meta.duration) {
      state.attack = null;
      guardian.cooldown = 1.12;
    }
    return;
  }
  const d = distance(player, guardian);
  guardian.moving = false;
  if (land(cellX(player.x), cellY(player.y)) !== 2 || d > 83) return;
  const dx = player.x - guardian.x, dy = player.y - guardian.y;
  guardian.facing = face(dx, dy);
  guardian.cooldown -= dt;
  if (d <= 24 && guardian.cooldown <= 0) {
    state.attack = { x: guardian.x, y: guardian.y, t: 0, radius: 38,
      shape: ["circle", "cone", "line"][pattern++ % 3], heading: Math.atan2(dy / 0.55, dx) };
  } else if (d > 16) {
    const x = guardian.x + dx / d * dt * 23, y = guardian.y + dy / d * dt * 23;
    if (land(cellX(x), cellY(y)) === 2 && !occupied(cellX(x), cellY(y))) {
      guardian.x = x; guardian.y = y; guardian.moving = true;
    }
  }
}

function update(dt) {
  player.invulnerable = Math.max(0, player.invulnerable - dt);
  const action = player.action;
  if (action) {
    const meta = clips[action.clip].meta;
    action.t += dt;
    if (!action.called && action.contact && action.t >= (meta.events?.contact ?? 0)) {
      action.called = true;
      action.contact();
    }
    if (action.t >= meta.duration) player.action = null;
  }
  move(dt);
  moveGuardian(dt);
  for (const n of state.nodes) {
    n.flash = Math.max(0, n.flash - dt);
    if (n.hp !== 0 || n.respawn === undefined) continue;
    n.respawn -= dt;
    if (n.respawn > 0 || occupied(n.col, n.row, true) || distance(n, player) < 16) continue;
    n.hp = rules[n.kind].hp;
    effect(spawns, n.x, n.y);
  }
  state.effects = state.effects.filter(fx => { fx.update(dt); return !fx.done(); });
  let pickedUp = false;
  state.loot = state.loot.filter(loot => {
    loot.t += dt;
    if (loot.t < lootFlight.meta.duration) return true;
    state.inventory[loot.item] += loot.count;
    pickedUp = true;
    return false;
  });
  if (pickedUp) { sound("pickup"); save(); }
  state.jobs = state.jobs.filter(job => {
    if (job.end > Date.now()) return true;
    const source = state.structures.find(s => s.id === job.station) ?? player;
    launch(recipes[job.id].output, 1, source.x, source.y);
    effect(craftFx, source.x, source.y);
    sound("craft");
    pickedUp = true;
    return false;
  });
  if (pickedUp) save();
  refreshFocus();
  if (held) {
    held.t += dt;
    if (held.t >= HOLD && !held.fired) { held.fired = true; interact(); }
    if (held.fired && state.focus?.near && !player.action && state.focus.entity === held.target && rules[held.target?.kind]?.hp) interact();
  }
}

canvas.addEventListener("pointerdown", event => {
  if (event.button !== 0) return;
  const [x, y] = scene.atPointer(event);
  if (selection) { cursor = [cellX(x), cellY(y)]; refreshFocus(); return; }
  const target = pointerTarget(x, y);
  if (target) goTo(target);
  else {
    goalTarget = pin = null;
    route = findRoute(cellX(player.x), cellY(player.y), cellX(x), cellY(y), passable, 0);
  }
});

const stick = document.querySelector("#stick");
const knob = document.querySelector("#knob");
let stickId = null;
function setStick(event) {
  const box = stick.getBoundingClientRect();
  const x = event.clientX - box.left - box.width / 2, y = event.clientY - box.top - box.height / 2;
  const radius = Math.max(26, Math.hypot(x, y));
  touchVector = [x / radius, y / radius];
  knob.style.transform = `translate(${touchVector[0] * 24}px, ${touchVector[1] * 24}px)`;
}
stick.addEventListener("pointerdown", event => {
  if (stickId !== null) return;
  stickId = event.pointerId;
  stick.setPointerCapture(event.pointerId);
  setStick(event);
});
stick.addEventListener("pointermove", event => { if (event.pointerId === stickId) setStick(event); });
function releaseStick() { stickId = null; touchVector = [0,0]; knob.style.transform = ""; }
for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) stick.addEventListener(name, event => {
  if (event.pointerId === stickId) releaseStick();
});

const actionButton = document.querySelector("#interact");
actionButton.addEventListener("pointerdown", event => {
  if (event.button !== 0 || held) return;
  actionButton.setPointerCapture(event.pointerId);
  held = { id: event.pointerId, t: 0, fired: false, target: state.focus?.entity };
});
actionButton.addEventListener("pointerup", event => {
  if (held?.id !== event.pointerId) return;
  if (!held.fired) interact();
  held = null;
});
for (const name of ["pointercancel", "lostpointercapture"]) actionButton.addEventListener(name, () => { held = null; });
actionButton.addEventListener("click", event => { if (event.detail === 0) interact(); });
window.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const code = event.code;
  if (["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(code)) {
    event.preventDefault();
    keys.add(code);
  }
  if (event.repeat) return;
  if (code === "KeyE") interact();
  if (code === "Space" && event.target?.tagName !== "BUTTON") { event.preventDefault(); startDash(); }
  if (code === "Escape") ui.open("guide");
});
window.addEventListener("keyup", event => keys.delete(event.code));
window.addEventListener("blur", () => { keys.clear(); held = null; releaseStick(); });

let last = performance.now(), lastDraw = -Infinity, t = 0;
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  t += dt;
  if (dt > 0) update(dt);
  if (now - lastDraw >= 1000 / 31) {
    lastDraw = now;
    const focus = state.focus;
    const targetRule = focus ? rules[focus.entity.kind] : null;
    const place = state.placement;
    const blocked = place ? place.blocked.length || !place.affordable || !place.near : !focus?.near;
    const label = selection ? "Đặt" : targetRule?.action ?? "Tương tác";
    const targetName = selection ? blueprints[selection].name : targetRule?.name;
    ui.render({ zone: land(cellX(player.x), cellY(player.y)), selection, label, targetName, blocked });
    scene.drawTouch(blocked ? "locked" : held ? "pressed" : "ready", held ? Math.min(1, held.t / HOLD) : 0,
      selection ? "+" : targetRule?.mark ?? "·");
    scene.draw(state, t);
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
