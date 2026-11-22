// People for the top-down 3/4 view: chibi villagers 1.5 tiles tall (about 16 x 24 px), a big round head on a small
// body, in four facings (down, up, right, left). They're put together from hand-drawn pixel parts (src/fx/_kit/parts.js:
// the face, hair styles, hats, clothes, legs, beards, glasses, scarves), each colored from the person's look and
// stacked back to front, then wrapped in one dark outline. Only the arms are drawn in code, so hands can go anywhere
// and hold a tool at any angle. src/fx/_kit/cast.js has the ready-made cast. Files starting with _ are helpers.

import { hex, mix, lerp } from "../../core/index.js";
import { Grid } from "./creature.js";
import { CAST } from "./cast.js";
import { FACE, EYE_ROWS, HAIR, HAT, GLASSES, BEARD, TORSO, SKIRT, LEGS, SCARF, FLOWER } from "./parts.js";

export const LOOKS = CAST;
const INK = hex("#1a1014"), EYE = hex("#1e1420"), BLUSH = hex("#ff8a80"), MOUTH = hex("#b04a4a"), WHITE_ = hex("#fff8ee");
const GOLD = hex("#ffd25a"), LENS = hex("#5ab4e0"), FRAME = hex("#4a3038");
const G = new Grid(-24, -48, 48, 56);

/**
 * Draw a person with their feet at (X, Y). facing: "down" | "up" | "right" | "left". look: a CAST name or a look object.
 * pose: { walk (cycle position, two steps per 1; -1 or absent to stand), bob (px the body drops), blink, lean (px the
 * head and chest go forward, sideways only), hands: [[x, y], [x, y]] near and far hand (omit to let them hang or
 * swing), behind: (g, flip) => {} drawn into the grid before the body, front: (g, flip) => {} after it }.
 */
export function drawPerson(p, X, Y, facing, look, pose = {}, fade = 1) {
  const L = resolve(look), g = G.clear();
  const f = facing === "down" ? "d" : facing === "up" ? "u" : "s", side = f === "s", flip = facing === "left" ? -1 : 1;
  const walk = pose.walk ?? -1, step = walk < 0 ? -1 : Math.floor(((((walk % 1) + 1) % 1) * 4)); // contact, pass, contact, pass
  const bob = Math.round(pose.bob ?? 0) + (step === 1 || step === 3 ? -1 : 0);
  const lean = side ? Math.round(pose.lean ?? 0) : 0;
  const set = (x, y, c) => g.set(x * flip, y, c);

  // stamp a part, its characters colored from the look; dx, dy move it; map may swap characters
  const stamp = (part, dx = 0, dy = 0, map = null) => {
    if (!part) return;
    part.rows.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        let ch = row[c];
        if (ch === ".") continue;
        if (map) ch = map(ch, r, c);
        const col = L.color[ch];
        if (col) set(part.x + c + dx, part.y + r + dy, col);
      }
    });
  };
  const up = (part, map) => stamp(part, lean, bob, map); // everything above the legs rides the bob

  const hair = HAIR[L.hairStyle] ?? HAIR.short, hat = L.hat && HAT[L.hat];
  const wear = TORSO[L.wear] ? L.wear : "tee";
  const hs = hands(pose, side, step, lean, bob), shN = side ? [-1 + lean, -8 + bob] : [-6, -8 + bob], shF = side ? shN : [5, -8 + bob];
  pose.behind?.(g, flip);

  // back to front: hair hanging behind, far arm, legs, torso, skirt, arms, head, hair, beard, glasses, hat, extras
  if (hair.back?.[f]) up(hair.back[f]);
  if (side) arm(set, L, shF, hs[1], true);
  const legs = LEGS[f][step === 1 ? "a" : step === 3 ? "b" : "stand"];
  stamp(legs, 0, 0, wear === "robe" || wear === "dress" ? (ch, r) => (r < 2 ? "." : ch) : null);
  if (f === "u") (arm(set, L, shN, hs[0]), arm(set, L, shF, hs[1]));
  up(TORSO[wear][f]);
  const skirt = SKIRT[wear] ?? (wear === "apron" && L.skirt ? SKIRT.apron : null);
  if (skirt) stamp(skirt[f], lean, Math.max(0, bob));
  if (f === "d") (arm(set, L, shN, hs[0]), arm(set, L, shF, hs[1]));
  if (L.scarf) up(SCARF[f]);
  // the head: blinking closes the eyes into a lash line
  up(FACE[f], pose.blink ? (ch, r) => (r === EYE_ROWS[0] || r === EYE_ROWS[1] ? ("oWE".includes(ch) ? "z" : ch) : r === EYE_ROWS[2] && ch === "E" ? "o" : ch) : null);
  up(hair.base[f]);
  if (hair.over?.[f]) up(hair.over[f]);
  if (hair.front?.[f]) up(hair.front[f]);
  if (hair.shine && f !== "u") (set(-3 + lean, -20 + bob, mix(L.color.z, WHITE_, 0.6)), set(-2 + lean, -20 + bob, mix(L.color.z, WHITE_, 0.3)));
  if (L.beard && f !== "u") {
    if (BEARD[L.beard]) up(BEARD[L.beard][side ? "s" : "d"]);
    else stubble(set, L, f, lean, bob);
  }
  if (L.glasses && f !== "u") up(GLASSES[side ? "s" : "d"]);
  if (hat) up(hat[f]);
  if (L.flower && f !== "u") up(L.hat === "sunhat" ? FLOWER.sunhat[side ? "s" : "d"] : FLOWER[side ? "s" : "d"]);
  if (side) arm(set, L, shN, hs[0]);
  pose.front?.(g, flip);

  // one dark outline, picking up a little of the color it wraps
  g.outline((x, y, nx, ny) => {
    const inner = g.get(x - Math.sign(nx), y - Math.sign(ny)) || g.get(x - Math.sign(nx), y) || g.get(x, y - Math.sign(ny));
    return inner ? mix(inner, INK, 0.88) : INK;
  });
  g.draw(p, fade, X, Y);
}

/** Where the hands go: as posed, or hanging at the sides, swinging with the walk. */
function hands(pose, side, step, lean, bob) {
  if (pose.hands) return pose.hands;
  const swing = step < 0 ? 0 : step === 0 ? 1 : step === 2 ? -1 : 0;
  return side
    ? [[-1 + lean + 2 * swing, -5 + bob], [-1 + lean - 2 * swing, -5 + bob]]
    : [[-7, -5 + bob + (swing > 0 ? -1 : 0)], [6, -5 + bob + (swing < 0 ? -1 : 0)]];
}

/** An arm from the shoulder towards the hand, 2 px wide: a sleeve, then skin (or sleeves all the way), a fist. */
function arm(set, L, sh, hand, dark = false) {
  let [hx, hy] = hand;
  const dx = hx - sh[0], dy = hy - sh[1], len = Math.hypot(dx, dy), max = 6;
  if (len > max) (hx = sh[0] + (dx / len) * max), (hy = sh[1] + (dy / len) * max);
  const long = ["jacket", "robe", "sweater"].includes(L.wear), S = L.wear === "jacket" ? L.top2 : L.top, K = L.skin;
  const n = Math.max(1, Math.ceil(Math.hypot(hx - sh[0], hy - sh[1]) * 2)), out = sh[0] < 0 ? -1 : 1;
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = lerp(sh[0], hx, u), y = lerp(sh[1], hy, u);
    const R = long || u < (L.wear === "tank" ? 0 : 0.35) ? S : K;
    set(x, y, R[dark ? 0 : 1]);
    set(x - out, y, R[dark ? 0 : out < 0 ? 2 : 1]);
  }
  set(hx, hy + 1, K[dark ? 0 : 2]), set(hx - out, hy + 1, K[dark ? 0 : 1]);
}

function stubble(set, L, f, lean, bob) {
  const xs = f === "s" ? [0, 6] : [-5, 4];
  for (let y = -11; y <= -9; y++) for (let x = xs[0]; x <= xs[1]; x++) if ((x + y) % 2 === 0 && !(y === -10 && (f === "s" ? x === 4 : x === -1 || x === 0))) set(x + lean, y + bob, mix(L.skin[1], L.hair[0], 0.5));
}

const RAMPS = ["skin", "hair", "top", "top2", "pants", "shoes", "hatColor", "bandColor", "scarf", "beardColor", "flower", "eyes"];

/** A look with its ramps resolved to colors, and the character -> color table for the parts (cached on the look). */
function resolve(look) {
  const L = typeof look === "string" ? LOOKS[look] : look;
  if (!L) throw new Error(`no look ${look}`);
  if (L._r) return L._r;
  const r = { ...L };
  for (const k of RAMPS) if (L[k]) r[k] = L[k].map((c) => (typeof c === "number" ? c : hex(c)));
  r.top2 = r.top2 ?? r.top;
  const K = r.skin, H = r.hair, T = r.top, T2 = r.top2, P = r.pants, S = r.shoes;
  const C = r.hatColor ?? (L.hat === "chef" ? ["#a8a4b4", "#e4e0ea", "#ffffff"].map(hex) : [INK, INK, INK]);
  const B = r.beardColor ?? H, SC = r.scarf ?? T, F = r.flower ?? [GOLD, WHITE_, GOLD];
  r.color = {
    o: INK, x: K[0], y: K[1], z: K[2],
    1: H[0], 2: H[1], 3: H[2], 4: mix(H[2], WHITE_, 0.4),
    E: r.eyes ? r.eyes[0] : EYE, W: WHITE_, R: mix(K[2], BLUSH, 0.55), M: MOUTH,
    a: T[0], b: T[1], c: T[2], u: T2[0], v: T2[1], w: T2[2],
    p: P[0], q: P[1], r: P[2], s: S[0], t: S[1],
    5: C[0], 6: mix(C[0], C[1], 0.5), 7: C[1], 8: C[2], 9: mix(C[2], WHITE_, 0.35), n: (r.bandColor ?? C)[1],
    G: GOLD, "+": WHITE_, "*": LENS, g: L.glassesColor ? hex(L.glassesColor) : FRAME,
    A: B[0], C: B[1], H: B[2], i: SC[0], j: SC[1], k: SC[2], F: F[1], f: F[0],
  };
  L._r = r;
  return r;
}

/** The four facings, in the order a preview shows them. */
export const FACINGS = ["down", "left", "right", "up"];

/**
 * The shared loop behind the character assets: stand (breathing, blinking) or walk on the spot, in one facing or in
 * all four side by side (facing "all": down, left, right, up, 24 px apart). Loops over 1.6 s: two walk cycles.
 */
export function showcase(p, t, o, look, shadow) {
  const list = o.facing === "all" ? FACINGS : [o.facing], gap = 24;
  list.forEach((f, i) => {
    const x = list.length > 1 ? Math.round((i - (list.length - 1) / 2) * gap) : 0;
    const pose = o.anim === "walk" ? { walk: t / 0.8 } : { bob: (t + 0.3) % 1.6 > 0.8 ? 1 : 0, blink: (t > 1.2 && t < 1.3) || (t > 0.35 && t < 0.42 && f === "left") };
    shadow?.(p, x, 0, 6, 2);
    drawPerson(p, x, 0, f, look, pose);
  });
}

/**
 * Keyframed poses for chores: keys [[t, { name: [x, y] | number, ... }, ease?], ...], sampled on 12 fps steps the way
 * a hand-animated sprite holds its frames. Between keys every number (and every [x, y]) moves with the next key's
 * ease: "snap" jumps on the key, "out" arrives fast and settles, default eases in and out.
 */
export function keyed(keys, t, fps = 12) {
  const q = Math.floor(t * fps + 1e-6) / fps;
  if (q <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [t0, a] = keys[i - 1], [t1, b, kind] = keys[i];
    if (q > t1) continue;
    let u = (q - t0) / (t1 - t0 || 1);
    u = kind === "snap" ? (u >= 1 ? 1 : 0) : kind === "out" ? 1 - (1 - u) ** 3 : u * u * (3 - 2 * u);
    const out = {};
    for (const k in b) {
      const A = a[k] ?? b[k], B = b[k];
      out[k] = Array.isArray(B) ? [lerp(A[0], B[0], u), lerp(A[1], B[1], u)] : typeof B === "number" ? lerp(A, B, u) : u < 0.5 ? A : B;
    }
    return out;
  }
  return keys[keys.length - 1][1];
}

/** Where a chore's figures stand: one at the origin, or the four facings in a row `gap` px apart (facing "all"). */
export const spots = (facing, gap) => {
  const list = facing === "all" ? FACINGS : [facing];
  return list.map((f, i) => ({ f, x: list.length > 1 ? Math.round((i - (list.length - 1) / 2) * gap) : 0 }));
};
