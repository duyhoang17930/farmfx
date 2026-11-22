// Bust portraits for dialogue boxes, 48 x 64, from the same looks as the sprites (src/fx/_kit/cast.js). The head is
// big and turned three-quarters to the right: the near ear shows on the left, the face is shifted right. Big tall dark
// eyes with a white shine, an open smile, blush; hair in pointed locks split by dark strand lines and lit top-left;
// round shoulders with the clothes (collar, rolled sleeves, straps, buttons, a pocket). Five shades per material made
// from the look's three-step ramps, inked: a near-black outline, and a dark line wherever one material lies over
// another (hair over the face, an arm over the chest). Local space: (0, 0) is the bottom middle of the frame.
// Files starting with _ are helpers, not effects.

import { hex, mix, rand } from "../../core/index.js";
import { Grid } from "./creature.js";
import { CAST } from "./cast.js";

const INK = hex("#1a1014"), WHITE_ = hex("#fffaf2"), BLUSH = hex("#ff8478"), GOLD = ["#8a5a10", "#e0a830", "#ffe080"].map(hex);
const MOUTH = hex("#5a1c26"), TONGUE = hex("#e8707a");
const G = new Grid(-24, -64, 48, 64);
/** Five shades from a three-step ramp: deep, dark, mid, light, shine. */
const five = (r) => [r[0], mix(r[0], r[1], 0.5), r[1], r[2], mix(r[2], WHITE_, 0.35)];
// materials, in draw order: where a later one touches an earlier one, its edge is inked
const M = { back: 1, neck: 2, chest: 3, arm: 4, scarf: 5, head: 6, hair: 7, beard: 8, hat: 9, flower: 10 };
let TAG = 0;

// the head: a skull and a jaw turned towards the right
const inSkull = (x, y) => (x / 16.5) ** 2 + ((y + 40) / 15.5) ** 2 <= 1;
const inJaw = (x, y) => ((x - 2.5) / 13.5) ** 2 + ((y + 31) / 10) ** 2 <= 1;
const inHead = (x, y) => inSkull(x, y) || inJaw(x, y);
const inEar = (x, y, k = 1) => ((x + 14.5) / 3.2) ** 2 + ((y + 33.5) / 4.5) ** 2 <= k;
const EYE_Y = -33; // the bottom row of the eyes

/**
 * Draw a portrait. look: a CAST name or a look. pose: { blink, talk (0..1 mouth open), expression: "smile" | "happy"
 * (eyes shut in a grin) | "neutral" | "surprised", bob (px the head and chest drop) }.
 */
export function drawPortrait(p, look, pose = {}) {
  const L = resolve(look), g = G.clear(), bob = Math.round(pose.bob ?? 0), expr = pose.expression ?? "smile";
  // every shape is sampled at pixel centers, moved with the breath, and tagged with the current material
  const shade = (x0, y0, x1, y1, fn) => g.shade(x0, y0 + bob, x1, y1 + bob, (x, y, o) => ((o.t = TAG), fn(x + 0.5, y + 0.5 - bob)));
  const set = (x, y, c) => g.set(x, y + bob, c, 1, TAG);
  const K = L.K, H = L.H, st = L.hairStyle;

  // hair that hangs behind the shoulders
  TAG = M.back;
  if (isLong(st)) shade(-21, -48, 21, -2, (x, y) => (Math.abs(x - 0.5) < 18 - Math.max(0, y + 20) * 0.1 + (st === "wavy" ? Math.sin(y * 0.6) * 1.2 : 0) ? lock(H, x, y, 0.3) : 0));
  if (st === "ponytail") shade(11, -50, 23, -18, (x, y) => (((x - 17) / 5.5) ** 2 + ((y + 35) / 15) ** 2 <= 1 ? lock(H, x, y, 0) : 0));
  if (st === "pigtails") for (const cx of [-19, 20]) shade(cx - 6, -42, cx + 6, -14, (x, y) => (((x - cx) / 4.5) ** 2 + ((y + 28) / 12) ** 2 <= 1 ? lock(H, x, y, 0) : 0));

  body(shade, L);

  // the head and the near ear
  TAG = M.head;
  shade(-18, -57, 18, -20, (x, y) => {
    if (!inHead(x, y)) return 0;
    return x > 12 || (x > 8 && y > -29) || y > -24 ? K[2] : x < -7 && y < -36 ? K[4] : K[3];
  });
  shade(-19, -39, -11, -28, (x, y) => (inEar(x, y) ? (inEar(x, y, 0.35) && x > -14.5 ? K[1] : K[2]) : 0));

  face(set, L, pose, expr);
  hair(shade, L);
  beard(shade, L, set);
  if (L.glasses) glasses(set, L);
  hat(shade, set, L);
  if (L.flower && L.hat !== "sunhat") flower(set, L.F, -10, -50);

  castShadow(g, L.K[1]);
  inkLines(g);
  g.outline((x, y, nx, ny) => {
    const inner = g.get(x - Math.sign(nx), y - Math.sign(ny)) || g.get(x - Math.sign(nx), y) || g.get(x, y - Math.sign(ny));
    return inner ? mix(inner, INK, 0.9) : INK;
  });
  g.draw(p);
}

const isLong = (st) => st === "long" || st === "wavy";

/** The fringe and the hat brim shade the skin just under them by a step. */
function castShadow(g, shadowSkin) {
  const { w, h, c, tag } = g;
  for (let i = w * 2; i < w * h; i++) {
    if (tag[i] !== M.head || !c[i]) continue;
    const a = tag[i - w], b = tag[i - w * 2];
    if (a === M.hair || a === M.hat || b === M.hair || b === M.hat) c[i] = mix(c[i], shadowSkin, 0.65);
  }
}

/** Inner line art: a pixel of a later material touching an earlier one (4-neighbour) goes dark, like an inked edge. */
function inkLines(g) {
  const { w, h, c, tag } = g, out = [];
  for (let i = 0; i < w * h; i++) {
    const t = tag[i];
    if (!c[i] || !t || t === M.flower) continue;
    for (const j of [i - 1, i + 1, i - w, i + w]) if (j >= 0 && j < w * h && c[j] && tag[j] && tag[j] < t) { out.push(i); break; }
  }
  for (const i of out) c[i] = mix(c[i], INK, 0.88);
}

/** Hair in pointed locks: a dark strand line every few px, a lit band near the top, darker to the right and below. */
function lock(H, x, y, lean = 0.45) {
  const v = (x + y * lean + 40) / 4.5, s = Math.floor(v), f = v - s;
  if (f < 0.14) return H[1]; // the dark split between locks
  if (y < -49 && y > -55 && x < -1 && x > -13 && f > 0.35 && f < 0.7) return H[4]; // the shine
  // each lock lit along its left edge and deeper on its right; the whole head lighter towards the top left
  const light = 0.55 - (Math.min(y, -30) + 52) / 45 - x / 40 + (f < 0.45 ? 0.25 : f > 0.8 ? -0.2 : 0) + ((s * 7) % 3) * 0.05;
  return light > 0.45 ? H[3] : light > 0.05 ? H[2] : H[1];
}

function face(set, L, pose, expr) {
  const K = L.K, E = L.E, B = L.H, eyeY = EYE_Y;
  const EYES = [[-5, 4], [7, 3]]; // [left x, width]: the near eye wider, the far one squeezed by the turn
  for (const [ex, w] of EYES) for (let k = 0; k < w; k++) set(ex + k, eyeY - 9 - (expr === "surprised" ? 1 : 0) + (k === 0 ? 1 : 0), B[1]);
  for (const [ex, w] of EYES) {
    if (pose.blink || expr === "happy") {
      for (let k = -1; k <= w; k++) set(ex + k, eyeY - 2 + (expr === "happy" ? (k === -1 || k === w ? 1 : 0) : 1), INK);
      continue;
    }
    for (let y = eyeY - 6; y <= eyeY; y++)
      for (let k = 0; k < w; k++) {
        let c = y === eyeY - 6 ? INK : y >= eyeY - 1 ? E[3] : y === eyeY - 2 ? E[2] : y <= eyeY - 4 ? E[0] : E[1];
        if (k === w - 1 && y > eyeY - 6) c = y >= eyeY - 1 ? E[2] : E[0];
        set(ex + k, y, c);
      }
    set(ex - 1, eyeY - 6, INK), set(ex - 1, eyeY - 5, INK), set(ex + w, eyeY - 6, INK); // lashes
    set(ex, eyeY - 5, WHITE_), set(ex + 1, eyeY - 5, WHITE_), set(ex, eyeY - 4, WHITE_), set(ex + 1, eyeY - 4, WHITE_); // the shine
    set(ex + w - 2, eyeY - 1, mix(E[3], WHITE_, 0.6));
  }
  for (const [bx, w] of [[-7, 3], [10, 2]]) for (let k = -w; k <= w; k++) set(bx + k, eyeY + 3, mix(K[3], BLUSH, Math.abs(k) < w ? 0.55 : 0.3));
  set(6, eyeY + 3, K[1]), set(6, eyeY + 2, K[2]); // the nose
  const mx = 5, my = eyeY + 6, talk = pose.talk ?? 0;
  if (expr === "neutral" && talk < 0.3) for (let x = mx - 1; x <= mx + 1; x++) set(x, my, MOUTH);
  else if (expr === "surprised") {
    for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) set(mx + dx, my + dy, MOUTH);
    set(mx, my, TONGUE);
  } else {
    // an open smile: a dark lip curving up at the corners, a pink tongue under it
    const open = talk > 0.3 ? 2 : 1;
    for (let x = mx - 2; x <= mx + 2; x++) set(x, my - (Math.abs(x - mx) === 2 ? 1 : 0), MOUTH);
    for (let r = 1; r <= open; r++) for (let x = mx - 1; x <= mx + 1; x++) set(x, my + r, r === open ? TONGUE : MOUTH);
  }
}

function hair(shade, L) {
  const H = L.H, st = L.hairStyle;
  TAG = M.hair;
  if (st === "bald") {
    shade(-20, -43, -9, -27, (x, y) => (((x + 14) / 5) ** 2 + ((y + 36) / 6.5) ** 2 <= 1 && !inEar(x, y) ? lock(H, x, y) : 0));
    shade(12, -44, 19, -32, (x, y) => (((x - 15.5) / 3) ** 2 + ((y + 38) / 5) ** 2 <= 1 ? lock(H, x, y) : 0));
    shade(-8, -53, -3, -50, (x, y) => (y < -51.5 && x > -7 ? WHITE_ : 0)); // a shine on the crown
    return;
  }
  const big = st === "curly" || st === "messy" ? 1.5 : 0;
  // the hairline: a fringe of pointed locks over the forehead, longer at the sides
  const fringe = (x) => {
    const k = ((x + 30) % 5.5) / 5.5, point = 1 - Math.abs(k - 0.5) * 2;
    return -44 + point * (st === "spiky" ? 3 : 4.5) + Math.max(0, Math.abs(x - 2) - 9) * 1.1;
  };
  shade(-21, -60, 21, -24, (x, y) => {
    const a = Math.atan2(y + 42, x), lump = 1 + (big ? 0.06 : 0.035) * Math.sin(a * 9 + 0.5);
    if ((x / ((18 + big) * lump)) ** 2 + ((y + 42) / ((16 + big) * lump)) ** 2 > 1) return 0;
    const back = x < -10 && y < -29 && !(inEar(x, y, 1.3) && x > -17); // round the back of the head, leaving the ear
    const temple = x > 12 && y < -32;
    return y < fringe(x) || back || temple ? lock(H, x, y) : 0;
  });
  const tri = (a, b, c) => {
    const [x0, x1] = [Math.min(a[0], b[0], c[0]), Math.max(a[0], b[0], c[0])], [y0, y1] = [Math.min(a[1], b[1], c[1]), Math.max(a[1], b[1], c[1])];
    const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
    shade(Math.floor(x0), Math.floor(y0), Math.ceil(x1), Math.ceil(y1), (x, y) => {
      const P = [x, y], d1 = s(P, a, b), d2 = s(P, b, c), d3 = s(P, c, a);
      return (d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0) ? 0 : lock(H, x, y);
    });
  };
  if (st === "messy") for (const [x, y, dx, dy] of [[-16, -48, -5, -1], [-9, -57, -2, -5], [2, -59, 3, -4], [13, -53, 5, -2], [-19, -38, -4, 2], [18, -42, 4, 1]]) tri([x - 3, y + 3], [x + 3, y + 3], [x + dx, y + dy]);
  if (st === "spiky") for (const [x, h] of [[-13, 7], [-6, 10], [1, 11], [8, 10], [14, 7]]) tri([x - 4, -54 + Math.abs(x) * 0.3], [x + 4, -54 + Math.abs(x) * 0.3], [x + 2, -54 - h + Math.abs(x) * 0.35]);
  if (st === "curly") for (const [x, y] of [[-16, -49], [-11, -56], [-4, -59], [4, -59], [11, -56], [17, -49], [-20, -40], [20, -40]]) shade(x - 4, y - 4, x + 4, y + 4, (X, Y) => (((X - x) / 4.2) ** 2 + ((Y - y) / 3.8) ** 2 <= 1 ? (X - x + Y - y < -2 ? H[4] : Y > y + 1.5 ? H[1] : H[3]) : 0));
  if (st === "bun") shade(-8, -66, 8, -55, (x, y) => ((x / 7.5) ** 2 + ((y + 60.5) / 5.5) ** 2 <= 1 ? (y > -57 ? H[1] : x < -2 && y < -62 ? H[4] : H[3]) : 0));
  if (isLong(st))
    // locks falling in front of the shoulders, either side of the face
    for (const [x0, x1] of [[-19, -11], [13, 20]]) shade(x0, -42, x1, -10, (x, y) => (Math.abs(x - (x0 + x1) / 2) < (x1 - x0) / 2 - Math.max(0, y + 20) * 0.2 ? lock(H, x, y, 0.15) : 0));
  if (st === "braid") {
    for (let i = 0; i < 7; i++) {
      const cx = -14 + i * 0.6, cy = -28 + i * 3.4;
      shade(cx - 3, cy - 2, cx + 3, cy + 2, (x, y) => (((x - cx) / 3) ** 2 + ((y - cy) / 2.2) ** 2 <= 1 ? (y < cy - 0.5 ? H[3] : y > cy + 0.8 ? H[1] : H[2]) : 0));
    }
    const tie = L.HCraw ?? [0, hex("#d84a4a"), hex("#ff7a6a")];
    shade(-11, -4, -8, -3, () => tie[1]);
  }
}

/** Chest, arms and clothes: round shoulders, a shirt with a collar and rolled sleeves, and whatever's over it. */
function body(shade0, L) {
  // the chest sits right under the chin: shapes below are drawn 4 px higher than written
  const shade = (x0, y0, x1, y1, fn) => shade0(x0, y0 - 4, x1, y1, (x, y) => fn(x, y + 4));
  const T = L.T, T2 = L.T2, K = L.K, wear = L.wear;
  const skinArms = ["tank", "overalls", "apron", "dress", "tee", "vest"].includes(wear);
  TAG = M.neck;
  shade0(-3, -24, 7, -17, (x, y) => (y < -21 || x > 4 ? K[1] : K[2]));
  shade(-19, -17, 22, -1, (x, y) => {
    const ax = x - 1.5, shoulder = -15 + (Math.abs(ax) / 17) ** 2 * 6 + Math.max(0, Math.abs(ax) - 15) * 2;
    if (y < shoulder || Math.abs(ax) > 18.5) return 0;
    const arm = Math.abs(ax) > 12.5, lit = x < -10 ? 3 : x > 12 ? 1 : 2;
    TAG = arm ? M.arm : M.chest;
    if (arm) {
      // a sleeve rolled once, then skin; or long sleeves all the way
      const sleeveEnd = wear === "tank" ? -30 : skinArms ? -8 : 99, S = wear === "jacket" ? T2 : T;
      if (y >= sleeveEnd) return K[lit];
      return y >= sleeveEnd - 1 && wear !== "tank" ? S[Math.min(4, lit + 1)] : S[Math.abs(ax) > 16.5 ? lit - 1 : lit];
    }
    let c = T[lit];
    const cx = Math.abs(ax - 0.5);
    if (y < -11 && cx < 6 && cx > 2.5 - (y + 15) * 0.3 && wear !== "tank" && wear !== "robe") c = T[4]; // the collar
    if (y < -11 && cx <= 2.5 - (y + 15) * 0.3 && wear !== "robe") c = K[1];
    const aa = Math.abs(ax);
    switch (wear) {
      case "overalls": {
        const bib = aa < 7.5 && y >= -9, strap = Math.abs(aa - (5.5 + (y + 15) * 0.3)) < 1.6 && y < -9;
        if (bib || strap) c = T2[lit];
        if (bib && y >= -6 && y <= -2 && ax > -3 && ax < 4) c = y === -5.5 || Math.abs(ax + 2.5) < 0.6 || Math.abs(ax - 3.5) < 0.6 ? T2[1] : T2[2]; // the pocket
        if (Math.abs(aa - 6) < 1.2 && y < -7 && y > -10) c = GOLD[y < -8.5 ? 2 : 1]; // buttons
        if (y >= -7 && Math.abs(aa - 7.5) < 0.6) c = T2[1]; // stitching down the bib
        break;
      }
      case "vest": case "jacket":
        if (aa > 3 + (y + 15) * 0.15) c = T2[lit];
        if (Math.abs(aa - 3.5 - (y + 15) * 0.15) < 1) c = T2[4];
        break;
      case "apron":
        if (aa < 8 && y >= -9) c = T2[y < -8 ? 4 : lit];
        if (Math.abs(aa - 6) < 1 && y < -9) c = T2[3];
        break;
      case "tank":
        if (!(Math.abs(aa - 6) < 1.8) && y < -9) c = K[lit];
        break;
      case "robe":
        if (Math.abs(aa - 2 - (y + 15) * 0.2) < 1.2) c = T2[3];
        break;
      case "dress":
        if (y > -6 && y < -4) c = T[1];
        break;
    }
    return c;
  });
  if (L.scarf) {
    const S = L.S;
    TAG = M.scarf;
    shade(-10, -19, 13, -11, (x, y) => (Math.abs(x - 2) < 11 - Math.max(0, y + 14) * 1.5 ? (x < -3 ? S[3] : x > 8 ? S[1] : S[2]) : 0));
    shade(6, -12, 12, -2, (x) => (x < 9 ? S[2] : S[1]));
  }
}

function beard(shade, L, set0) {
  if (!L.beard) return;
  TAG = M.beard;
  const B = L.BC, my = EYE_Y + 6;
  if (L.beard === "full") {
    // a fluffy beard: round clumps along the jaw and down the chin, each lit top-left, lower ones over upper ones
    const clumps = [];
    for (let row = 0; row < 5; row++)
      for (let k = -3; k <= 3; k++) {
        const cx = 3 + k * 3.6 + (row & 1) * 1.8, cy = -31 + row * 3.4;
        const inB = ((cx - 3) / 13.5) ** 2 + ((cy + 25) / 10.5) ** 2 <= 1 && cy > -33 + Math.max(0, 5 - Math.abs(cx - 3)) * 0.9;
        if (inB && !(cx > 1 && cx < 9 && cy > my - 3 && cy < my + 2)) clumps.push([cx, cy]);
      }
    for (const [cx, cy] of clumps)
      shade(cx - 3, cy - 3, cx + 3, cy + 3, (x, y) => {
        const d = ((x - cx) / 2.9) ** 2 + ((y - cy) / 2.6) ** 2;
        if (d > 1 || (x > 2 && x < 8 && y >= my - 1 && y <= my + 1)) return 0;
        const v = -((x - cx) * 0.6 + (y - cy) * 0.8) / 2.6;
        return v > 0.45 ? B[4] : v > -0.1 ? B[3] : v > -0.6 ? B[2] : B[1];
      });
    for (let x = 0; x <= 9; x++) set0(x, my - 2, B[3]); // the mustache over the smile
  }
  else if (L.beard === "mustache") shade(1, my - 3, 10, my - 1, (x, y) => (Math.abs(x - 5) < 4 - (y - my + 3) ? B[2] : 0));
  else shade(-8, -32, 16, -20, (x, y) => (inHead(x, y) && (Math.floor(x) + Math.floor(y)) % 2 === 0 && !(x > 2 && x < 8 && y > my - 2 && y < my + 2) ? mix(L.K[2], B[1], 0.5) : 0));
}

function glasses(set, L) {
  const R = L.glassesColor ?? hex("#3a2228"), eyeY = EYE_Y;
  for (const [cx, rx] of [[-3, 4.4], [8.5, 3.2]]) {
    for (let a = 0; a < 44; a++) {
      const t = (a / 44) * Math.PI * 2;
      set(Math.round(cx + Math.cos(t) * rx - 0.5), Math.round(eyeY - 3 + Math.sin(t) * 3.9), R);
    }
    set(Math.round(cx + rx * 0.4), eyeY - 6, WHITE_);
  }
  for (let x = 2; x <= 4; x++) set(x, eyeY - 4, R);
  for (let x = -13; x <= -8; x++) set(x, eyeY - 4, R); // the arm back to the ear
}

function flower(set, F, x, y) {
  TAG = M.flower;
  for (const [dx, dy] of [[0, -2], [-2, 0], [2, 0], [0, 2], [-1, -2], [1, -2], [-2, -1], [2, -1], [-2, 1], [2, 1], [-1, 2], [1, 2]]) set(x + dx, y + dy, F[1]);
  for (const [dx, dy] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) set(x + dx, y + dy, F[2]);
  set(x, y, GOLD[1]), set(x + 1, y + 1, GOLD[0]);
}

function hat(shade, set, L) {
  const kind = L.hat;
  if (!kind) return;
  TAG = M.hat;
  const C = L.HC, band = L.BAND, tex = (x, y) => rand(Math.floor(x), Math.floor(y), 77) > 0.8;
  if (kind === "straw" || kind === "sunhat" || kind === "cowboy") {
    // a crown on top, a wide brim tipped towards us and curving down at the sides, darker underneath, straw texture
    const rx = kind === "sunhat" ? 25 : 23;
    shade(-16, -66, 12, -47, (x, y) => {
      if (((x + 2) / 12.5) ** 2 + ((y + 54) / 10) ** 2 > 1 || y > -47 || (kind === "cowboy" && Math.abs(x) < 2 && y < -61)) return 0;
      if (y >= -50) return y >= -49 ? band[1] : band[3];
      // round: lit where the dome faces up and left, deeper round the right
      const nx = (x + 2) / 12.5, ny = (y + 54) / 10, v = -(nx * 0.6 + ny * 0.8);
      const r = rand(Math.floor(x), Math.floor(y), 77);
      if (r > 0.84) return v > 0.3 ? C[2] : C[1]; // dark straw
      if (r < 0.06) return C[4]; // a bright strand
      return v > 0.55 ? C[4] : v > 0.15 ? C[3] : v > -0.35 ? C[2] : C[1];
    });
    shade(-rx - 1, -56, rx + 1, -38, (x, y) => {
      const u = x / rx, cy = -47 - u * 3 + (kind === "cowboy" ? -(u ** 4) * 5 : u * u * 2.5);
      const d = u * u + ((y - cy) / 5.5) ** 2;
      if (d > 1) return 0;
      const under = y > cy + 1.5, rim = d > 0.8, r = rand(Math.floor(x), Math.floor(y), 78);
      // the top of the brim lit towards the left and the far edge, the underside in shade, a lit rim at the front
      const top = u < -0.3 || y < cy - 3 ? C[4] : u > 0.55 ? C[2] : C[3];
      const c = under ? (rim ? C[2] : C[1]) : rim && y > cy ? C[3] : top;
      return !rim && r > 0.84 ? (under ? C[0] : C[2]) : !under && r < 0.05 ? C[4] : c;
    });
    if (kind === "sunhat") flower(set, L.F ?? ["#7a3a10", "#ffc820", "#fff0a0"].map(hex), -13, -52);
  } else if (kind === "cap" || kind === "flatcap" || kind === "beanie" || kind === "bandana") {
    const low = kind === "beanie" ? -42 : -45;
    shade(-20, -62, 20, low, (x, y) => {
      if ((x / 18.5) ** 2 + ((y + 44) / 16.5) ** 2 > 1) return 0;
      const v = -((x / 18.5) * 0.6 + ((y + 50) / 10) * 0.8);
      if (Math.floor(x + 30) % 7 === 0 && kind !== "bandana" && v < 0.6) return C[2]; // seams between the panels
      return v > 0.6 ? C[4] : v > 0.1 ? C[3] : v > -0.4 ? C[2] : C[1];
    });
    if (kind === "cap") shade(-6, low, 24, low + 3, (x, y) => (x - 24 < -(y - low) * 4 && x > -6 + (y - low) * 2 ? (y < low + 1 ? C[2] : C[1]) : 0));
    if (kind === "flatcap") shade(-20, low - 1, 23, low + 2, (x, y) => (y >= low + 1 ? C[1] : C[2]));
    if (kind === "beanie") {
      shade(-20, low - 4, 20, low, (x, y) => ((x / 19) ** 2 + ((y + 44) / 16.5) ** 2 <= 1.12 ? (Math.floor(x) & 1 ? C[2] : C[3]) : 0));
      shade(-4, -66, 4, -59, (x, y) => ((x / 4) ** 2 + ((y + 62.5) / 3.5) ** 2 <= 1 ? WHITE_ : 0));
    }
    if (kind === "bandana") {
      for (const [x, y] of [[-11, -55], [-3, -58], [5, -56], [12, -51], [-15, -48], [0, -50], [9, -47]]) (set(x, y, WHITE_), set(x + 1, y, mix(WHITE_, C[3], 0.3)));
      shade(-25, -53, -15, -37, (x, y) => {
        const a = y < -45 && x < -16 && Math.abs(y + 49) < (x + 26) * 0.5, b = y >= -45 && x < -16 && x > -23 + (y + 45) * 0.3 && x < -17 - (y + 45) * 0.0;
        return a ? C[3] : b ? C[2] : 0;
      });
    }
  } else if (kind === "witch") {
    shade(-13, -66, 24, -48, (x, y) => {
      const u = (y + 66) / 18, cx = 11 * (1 - u) ** 2, r = 1 + u * 12;
      return Math.abs(x - cx) < r ? (y > -52 && y < -49 ? GOLD[1] : x < cx - r * 0.3 ? C[3] : x > cx + r * 0.4 ? C[1] : C[2]) : 0;
    });
    shade(-25, -52, 25, -42, (x, y) => ((x / 25) ** 2 + ((y + 47) / 4) ** 2 <= 1 ? (y > -47 ? C[1] : C[2]) : 0));
  } else if (kind === "chef") {
    for (const [x, y, r] of [[-10, -58, 7.5], [1, -61, 8.5], [11, -57, 7], [-4, -53, 7.5], [7, -53, 7.5]]) shade(x - r, y - r, x + r, y + r, (X, Y) => (((X - x) / r) ** 2 + ((Y - y) / (r * 0.85)) ** 2 <= 1 ? (X - x + Y - y > 3 ? hex("#d4d0dc") : WHITE_) : 0));
    shade(-15, -51, 16, -46, (x, y) => (y >= -47 ? hex("#c8c4d0") : hex("#eeeaf2")));
  } else if (kind === "bow") {
    const tri = (pts, c) => {
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      shade(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), (x, y) => {
        const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
        const P = [x, y], d1 = s(P, pts[0], pts[1]), d2 = s(P, pts[1], pts[2]), d3 = s(P, pts[2], pts[0]);
        return (d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0) ? 0 : c(x, y);
      });
    };
    tri([[-7, -55], [-17, -62], [-17, -49]], (x, y) => (y < -56 ? C[3] : C[2]));
    tri([[-7, -55], [3, -62], [3, -49]], (x, y) => (y < -56 ? C[2] : C[1]));
    shade(-9, -57, -5, -53, () => C[1]);
  } else if (kind === "headband") {
    shade(-19, -48, 19, -45, (x, y) => ((x / 18.5) ** 2 + ((y + 42) / 16.5) ** 2 <= 1 ? (y < -47 ? C[3] : C[2]) : 0));
  } else if (kind === "goggles") {
    shade(-19, -52, 19, -50, (x, y) => ((x / 18.5) ** 2 + ((y + 42) / 16.5) ** 2 <= 1 ? C[1] : 0));
    for (const [gx, r] of [[-4, 5.5], [9, 4.5]]) shade(gx - r - 1, -58, gx + r + 1, -44, (x, y) => {
      const d = ((x - gx) / (r + 0.5)) ** 2 + ((y + 51) / (r - 0.5)) ** 2;
      return d <= 1 ? (d > 0.6 ? C[2] : x - gx + y + 51 < -1 ? hex("#e8fcff") : hex("#58b0dc")) : 0;
    });
  }
}

const RAMPS = { skin: "K", hair: "H", top: "T", top2: "T2", hatColor: "HC", bandColor: "BAND", scarf: "S", beardColor: "BC", eyes: "E" };
function resolve(look) {
  const L = typeof look === "string" ? CAST[look] : look;
  if (L._p) return L._p;
  const r = { ...L };
  for (const [k, n] of Object.entries(RAMPS)) if (L[k]) r[n] = five(L[k].map((c) => (typeof c === "number" ? c : hex(c))));
  r.T2 = r.T2 ?? r.T;
  r.BC = r.BC ?? r.H;
  r.HC = r.HC ?? five([INK, INK, INK]);
  r.HCraw = L.hatColor ? L.hatColor.map(hex) : null;
  r.BAND = r.BAND ?? r.HC;
  r.E = r.E ?? five(["#0e0606", "#2a1610", "#5e3a24"].map(hex));
  r.F = L.flower ? L.flower.map(hex) : null;
  r.glassesColor = L.glassesColor ? hex(L.glassesColor) : null;
  L._p = r;
  return r;
}
