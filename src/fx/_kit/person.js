// People for the top-down 3/4 view: chibi farmers and villagers about 16 x 28 px, a big head on a small body, in four
// facings (down, up, right, left). Built in a grid from flat shaded parts, lit from the top-left, wrapped in one
// colored outline. Hands are placed where they should be (in px from the feet) and the arms reach for them, so a
// person can hold any tool at any angle. Files starting with _ are helpers, not effects.

import { hex, mix, clamp, lerp } from "../../core/index.js";
import { Grid } from "./creature.js";

const ramp = (list) => list.map((c) => hex(c));

/** Ready-made looks. Every color is a ramp, dark to light. Pass one as `look`, or your own with the same fields. */
export const LOOKS = {
  farmer: {
    skin: ["#8a4e3a", "#d98e64", "#f4bc8c"], hair: ["#3a2014", "#6a3a1e", "#9a5a2c"],
    shirt: ["#6a2a2a", "#b4483a", "#e07050"], pants: ["#1e2c50", "#34508a", "#5478b8"], shoes: ["#2a1a12", "#4a2e1e"],
    hair_: "short", hat: "straw", overalls: true,
  },
  villager: {
    skin: ["#7a4434", "#c8805a", "#eaae80"], hair: ["#4a1e10", "#9a3e1c", "#d86a30"],
    shirt: ["#2a5a4a", "#3e8a6a", "#6ab88a"], pants: ["#3a2a4a", "#5a4470", "#8068a0"], shoes: ["#2a1a12", "#5a3a22"],
    hair_: "long", dress: true,
  },
  elder: {
    skin: ["#7a4a3a", "#c88e70", "#e8b494"], hair: ["#6a6470", "#a8a2ae", "#e0dce4"],
    shirt: ["#4a4a28", "#76763e", "#a4a45c"], pants: ["#3a2c22", "#5c4636", "#86684e"], shoes: ["#1e1612", "#3a2c22"],
    hair_: "bald", beard: true, hat: "cap", hatColor: ["#3a3048", "#5a4c6e", "#7c6e94"],
  },
  kid: {
    skin: ["#8a5038", "#e0966a", "#f8c49a"], hair: ["#1e1418", "#3a2a2e", "#5a4446"],
    shirt: ["#a86a10", "#e8a224", "#ffd25a"], pants: ["#2a4a6a", "#3e6e9a", "#68a0cc"], shoes: ["#3a1a1a", "#7a2a2a"],
    hair_: "short", hat: "cap", hatColor: ["#5a1a1e", "#a42a2e", "#e04a44"], small: true,
  },
};

const G = new Grid(-20, -44, 40, 52);

/**
 * A pose: { walk (0..1 through a two-step cycle, or -1 standing), bob (px the body drops), blink, lean (px the head
 * and chest go forward), hands: [[x, y], [x, y]] (near and far hand; omit for arms hanging or swinging with the
 * walk), behind: (g, flip) => {}  drawn before the body (a tool behind him), front: (g, flip) => {} after it }.
 */
export function drawPerson(p, X, Y, facing, look, pose = {}, fade = 1) {
  const L = resolve(look), g = G.clear(), side = facing === "right" || facing === "left", flip = facing === "left" ? -1 : 1;
  const S = L.small ? 0.82 : 1;
  // heights, feet at y = 0
  const legH = Math.round(5 * S), torH = Math.round(8 * S), headH = L.small ? 10 : 11;
  const walk = pose.walk ?? -1, step = walk < 0 ? -1 : Math.floor(((walk % 1) + 1) % 1 * 4); // 4 frames a cycle: contact, pass, contact, pass
  const bob = (pose.bob ?? 0) + (step === 1 || step === 3 ? -1 : 0);
  const hip = -legH - 1 + bob, chest = hip - torH, neck = chest, lean = (pose.lean ?? 0) * (side ? flip : 0);
  const set = (x, y, c) => g.set(x * flip, y, c); // draw facing right; flipped for left

  // ---- legs: down/up lift one foot on the pass frames; side strides
  const legs = () => {
    const P = L.pants, Sh = L.shoes, w = side ? 2 : 2;
    const pair = side ? [[-1 + (step === 0 ? 2 : step === 2 ? -2 : 0), 0], [-1 + (step === 0 ? -2 : step === 2 ? 2 : 0), 1]] : [[-3, 0], [1, 1]];
    pair.forEach(([lx, k], i) => {
      const lift = !side && ((step === 1 && i === 0) || (step === 3 && i === 1)) ? 1 : 0;
      const dark = side && i === 1;
      for (let y = hip + 1; y <= -2 - lift; y++) for (let x = 0; x < w; x++) set(lx + x, y, dark ? P[0] : x === 0 ? P[2] : P[1]);
      for (let x = 0; x < w + (side ? 1 : 0); x++) set(lx + x, -1 - lift, dark ? Sh[0] : Sh[1]);
    });
  };

  // ---- the torso, with overalls or a dress
  const torso = () => {
    const w = side ? 6 : 8, x0 = side ? -3 + lean : -4, Sh = L.shirt, P = L.pants;
    for (let y = chest; y <= hip; y++)
      for (let x = x0; x < x0 + w; x++) {
        const lit = x < x0 + 2 ? 2 : x >= x0 + w - 2 ? 0 : 1;
        let c = Sh[lit];
        if (y === hip) c = P[Math.max(0, lit - 1)];
        if (L.overalls && (y >= hip - 3 || (facing !== "up" && y >= chest + 2 && x > x0 && x < x0 + w - 1 && !side) || ((x === x0 + 1 || x === x0 + w - 2) && !side))) c = P[lit];
        set(x, y, c);
      }
    if (L.overalls && facing === "down") (set(x0 + 1, chest + 3, L.shoes[1]), set(x0 + w - 2, chest + 3, L.shoes[1]));
    if (L.dress)
      for (let y = hip - 1; y <= hip + 3; y++) {
        const spread = 1 + Math.floor((y - hip + 1) / 2);
        for (let x = x0 - spread; x < x0 + w + spread; x++) set(x, y, x < x0 ? Sh[2] : x >= x0 + w ? Sh[0] : Sh[1]);
      }
  };

  // ---- arms: from the shoulder towards the hand, sleeve then skin, a 2 px fist
  const shoulderN = side ? [0 + lean, chest + 1] : [-5, chest + 1], shoulderF = side ? [0 + lean, chest + 1] : [4, chest + 1];
  const swing = step < 0 ? 0 : step === 0 ? 1 : step === 2 ? -1 : 0;
  const hands = pose.hands ?? (side ? [[lean + 2 * swing, hip - 1], [lean - 2 * swing, hip - 1]] : [[-5, hip - 1 + (swing > 0 ? -1 : 0)], [4, hip - 1 + (swing < 0 ? -1 : 0)]]);
  const arm = (sh, hand, dark) => {
    let [hx, hy] = hand;
    const dx = hx - sh[0], dy = hy - sh[1], len = Math.hypot(dx, dy), max = 8 * S;
    if (len > max) (hx = sh[0] + (dx / len) * max), (hy = sh[1] + (dy / len) * max);
    const n = Math.max(1, Math.ceil(Math.hypot(hx - sh[0], hy - sh[1]) * 2));
    for (let i = 0; i <= n; i++) {
      const u = i / n, x = lerp(sh[0], hx, u), y = lerp(sh[1], hy, u), c = u < 0.55 ? L.shirt[dark ? 0 : 1] : L.skin[dark ? 0 : 1];
      set(x, y, c), set(x + 0.6, y, c);
      if (side && !dark && u > 0.15) set(x - 1, y, L.shirt[0]); // a dark edge behind the near arm, so it reads over the chest
    }
    set(hx, hy, L.skin[dark ? 1 : 2]), set(hx + 1, hy, L.skin[1]), set(hx, hy + 1, L.skin[1]), set(hx + 1, hy + 1, L.skin[0]);
    return [hx, hy];
  };

  // ---- the head: skin, face, hair, hat
  const head = () => {
    const w = 12, x0 = (side ? -5 : -6) + lean, y1 = neck - 1, y0 = y1 - headH + 1, K = L.skin, H = L.hair;
    const inHead = (x, y) => !((x === x0 || x === x0 + w - 1) && (y === y0 || y === y1)) && !(side && x === x0 + w - 1 && y === y0 + 1);
    for (let y = y0; y <= y1; y++) for (let x = x0; x < x0 + w; x++) if (inHead(x, y)) set(x, y, x >= x0 + w - 2 || y === y1 ? K[1] : K[2]);
    const eyeY = y0 + Math.round(headH * 0.6);
    // hair
    const hairAt = (x, y) => {
      const top = y <= y0 + 3, rx = x - x0;
      if (L.hair_ === "bald") return !top && y <= eyeY && (side ? rx <= 3 : rx <= 1 || rx >= w - 2) && y >= y0 + 2;
      if (facing === "up") return y <= y1 - 1 || (L.hair_ === "long" && y <= y1 + 4);
      if (side) return top || rx <= 4 - (y > eyeY ? 1 : 0) || (L.hair_ === "long" && rx <= 5);
      const sides = (rx <= 1 || rx >= w - 2) && y <= eyeY + (L.hair_ === "long" ? 5 : 0);
      const bangs = y === y0 + 4 && rx % 3 !== 1;
      return top || sides || bangs;
    };
    for (let y = y0 - 1; y <= y1 + 5; y++)
      for (let x = x0 - 1; x <= x0 + w; x++) {
        if (!hairAt(x, y)) continue;
        if (y > y1 && L.hair_ !== "long") continue;
        if (y < y0 && (x === x0 - 1 || x === x0 + w)) continue;
        const inside = inHead(x, y) || (L.hair_ === "long" && y > y0 + 2 && (x === x0 - 1 || x === x0 + w));
        if (!inside && !(y === y0 - 1 && x > x0 && x < x0 + w - 1)) continue;
        set(x, y, x <= x0 + 2 && y <= y0 + 2 ? H[2] : x >= x0 + w - 3 ? H[0] : H[1]);
      }
    if (L.hair_ === "long" && facing !== "up") for (let y = y0 + 3; y <= y1 + 4; y++) (set(x0 - 1, y, H[1]), set(x0 + w, y, H[0]));
    // the face
    if (facing !== "up") {
      const eye = (x) => {
        if (!pose.blink) set(x, eyeY - 1, hex("#1e1420"));
        set(x, eyeY, hex("#1e1420"));
      };
      if (side) (eye(x0 + 8), set(x0 + w, eyeY + 1, K[1]), set(x0 + 4, eyeY, K[0]));
      else (eye(x0 + 3), eye(x0 + 8), set(x0 + 2, eyeY + 2, mix(K[2], hex("#ff7070"), 0.4)), set(x0 + 9, eyeY + 2, mix(K[2], hex("#ff7070"), 0.4)));
      if (L.beard) {
        const bx0 = side ? x0 + 5 : x0 + 2, bx1 = side ? x0 + w : x0 + w - 3;
        for (let y = eyeY + 2; y <= y1 + 1; y++) for (let x = bx0; x <= bx1; x++) if (!(y === y1 + 1 && (x === bx0 || x === bx1))) set(x, y, x <= bx0 + 1 ? H[2] : H[1]);
        if (!side) set(x0 + 5, eyeY + 2, K[0]), set(x0 + 6, eyeY + 2, K[0]);
      }
    }
    // hats
    if (L.hat === "straw") {
      const S2 = ramp(["#7a5a1e", "#c89a3a", "#ecc86a", "#fff0a8"]), cx = x0 + w / 2 - 0.5, by = y0 + 2;
      const rx = side ? 8 : 9;
      for (let y = by - 1; y <= by + 1; y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) if (((x - cx) / rx) ** 2 + ((y - by) / 1.6) ** 2 <= 1) set(x, y, y > by ? S2[1] : S2[2]);
      for (let y = by - 4; y <= by - 2; y++) for (let x = Math.floor(cx - 4); x <= Math.ceil(cx + 4); x++) set(x, y, y === by - 2 ? hex("#b4383a") : x < cx - 1 ? S2[3] : S2[2]);
    } else if (L.hat === "cap") {
      const C = ramp(L.hatColor ?? ["#2a2a3a", "#44445a", "#66667e"]);
      for (let y = y0 - 1; y <= y0 + 2; y++) for (let x = x0; x < x0 + w; x++) if (inHead(x, y) || y === y0 - 1 && x > x0 && x < x0 + w - 1) set(x, y, x < x0 + 3 ? C[2] : C[1]);
      if (side) for (let x = x0 + w - 1; x <= x0 + w + 2; x++) set(x, y0 + 3, C[0]);
      else if (facing === "down") for (let x = x0 + 1; x < x0 + w - 1; x++) set(x, y0 + 3, C[0]);
    }
    return { x0, y0, y1, eyeY };
  };

  pose.behind?.(g, flip, { hip, chest });
  if (side) arm(shoulderF, hands[1], true);
  legs();
  if (facing === "up") {
    // seen from behind, the arms are in front of nothing: draw them first, then the back over their roots
    arm(shoulderN, hands[0]), arm(shoulderF, hands[1]);
    torso();
  } else {
    torso();
    if (!side) (arm(shoulderN, hands[0]), arm(shoulderF, hands[1]));
  }
  const hd = head();
  if (side) arm(shoulderN, hands[0]);
  pose.front?.(g, flip, { hip, chest, head: hd });
  g.outline(L.ink);
  g.draw(p, fade, X, Y);
  return { hip, chest };
}

/** A look with its ramps resolved to colors (cached on the look object). */
function resolve(look) {
  const L = typeof look === "string" ? LOOKS[look] : look;
  if (L._r) return L._r;
  const r = { ...L };
  for (const k of ["skin", "hair", "shirt", "pants", "shoes"]) r[k] = ramp(L[k]);
  r.ink = hex(L.ink ?? "#24141c");
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
    const pose = o.anim === "walk" ? { walk: t / 0.8 } : { bob: (t % 1.6) > 0.8 ? 1 : 0, blink: (t > 1.2 && t < 1.3) || (t > 0.35 && t < 0.42 && f === "left") };
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
