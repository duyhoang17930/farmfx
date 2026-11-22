// Chibi bust portraits for dialogue boxes, 40 x 40, from the same looks as the sprites (src/fx/_kit/cast.js), put
// together from hand-drawn pixel parts (src/fx/_kit/portrait-parts.js): a big head turned three-quarters, tall shining
// eyes, blush, an open smile; the hair, hat, beard, glasses and scarf the sprite has; the shoulders in the right
// clothes. Each part is colored from the look; where one material lies over another its edge is inked, the fringe
// shades the forehead, and one near-black outline wraps it all. Local space: (0, 0) is the bottom middle of the frame.
// Files starting with _ are helpers, not effects.

import { hex, mix } from "../../core/index.js";
import { Grid } from "./creature.js";
import { CAST } from "./cast.js";
import * as PP from "./portrait-parts.js";

const INK = hex("#1a1014"), WHITE_ = hex("#fffaf2"), BLUSH = hex("#ff8478"), GOLD = hex("#ffd25a");
const G = new Grid(-20, -48, 40, 48);
// materials, in draw order: where a later one touches an earlier one, its edge is inked
const M = { back: 1, body: 3, over: 4, scarf: 5, head: 6, hair: 7, beard: 8, hat: 9, free: 10 };

/**
 * Draw a portrait. look: a CAST name or a look. pose: { blink, talk (0..1 mouth open), expression: "smile" | "happy"
 * (eyes shut in a grin) | "neutral" | "surprised", bob (px the head drops) }.
 */
export function drawPortrait(p, look, pose = {}) {
  const L = resolve(look), g = G.clear(), bob = Math.round(pose.bob ?? 0), expr = pose.expression ?? "smile";
  const stamp = (part, tag, dy = 0, map = null) => {
    if (!part) return;
    part.rows.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        let ch = row[c];
        if (ch === "." || ch === " ") continue;
        if (map) ch = map(ch, r, c);
        const col = L.color[ch];
        if (col) g.set(part.x + c, part.y + r + dy, col, 1, tag);
      }
    });
  };
  const head = (part, tag) => stamp(part, tag, bob);
  const hair = PP.HAIR[L.hairStyle] ?? PP.HAIR.short;

  head(hair.back, M.back);
  // the shoulders, recolored for the clothes
  stamp(PP.BODY, M.body, 0, clothes(L));
  if (L.wear === "overalls") stamp(PP.OVERALLS, M.over);
  if (L.wear === "apron") stamp(PP.APRON, M.over);
  if (L.scarf) stamp(PP.SCARF, M.scarf);
  // the face
  head(PP.FACE, M.head);
  head(PP.BROWS, M.head);
  head(pose.blink || expr === "happy" ? (expr === "happy" ? PP.EYES.happy : PP.EYES.blink) : PP.EYES.open, M.head);
  head(PP.BLUSH, M.head);
  head((pose.talk ?? 0) > 0.3 ? PP.MOUTH.talk : PP.MOUTH[expr] ?? PP.MOUTH.smile, M.head);
  // hair over it, the ear in front of the side locks
  head(hair.cap, M.hair);
  head(hair.over, M.hair);
  head(PP.EAR, M.head);
  if (hair.shine) head(hair.shine, M.free);
  head(hair.front, M.hair);
  if (L.beard === "full" || L.beard === "mustache") head(PP.BEARD[L.beard], M.beard);
  else if (L.beard)
    for (let y = -13; y <= -9; y++)
      for (let x = -8; x <= 8; x++)
        if ((x + y) % 2 === 0 && g.tag[g.idx(x, y + bob)] === M.head && !(y >= -11 && Math.abs(x) <= 2)) g.set(x, y + bob, mix(L.color.y, L.color[1], 0.45), 1, M.head);
  if (L.glasses) (head(PP.GLASSES, M.free), head(PP.GLASSES_ARM, M.free));
  if (L.hat) head(PP.HAT[L.hat], M.hat);
  if (L.hat === "sunhat") head(PP.SUNFLOWER, M.free);
  else if (L.flower) head(PP.FLOWER, M.free);

  shadeUnder(g, L.color.y);
  inkLines(g);
  g.outline((x, y, nx, ny) => {
    const inner = g.get(x - Math.sign(nx), y - Math.sign(ny)) || g.get(x - Math.sign(nx), y) || g.get(x, y - Math.sign(ny));
    return inner ? mix(inner, INK, 0.9) : INK;
  });
  g.draw(p);
}

/** How the shirt base becomes this look's clothes: arms bare or sleeved, a vest's or jacket's panels, a tank's skin. */
function clothes(L) {
  const wear = L.wear, toSkin = { a: "x", b: "y", c: "z" }, toTop2 = { a: "u", b: "v", c: "w" };
  const bareArms = ["tee", "overalls", "apron", "dress", "vest", "tank"].includes(wear);
  return (ch, r, c) => {
    const arm = PP.ARM_COLS(c), chest = !arm;
    if (!(ch in toSkin)) return ch;
    if (wear === "tank" && (arm || r < 2 || c < 9 || c > 22) && !((c === 10 || c === 21) && r < 2)) return toSkin[ch];
    if (arm && bareArms && r >= 5) return toSkin[ch];
    if (wear === "jacket" && (arm || c <= 12 || c >= 19)) return toTop2[ch];
    if (wear === "vest" && chest && (c <= 12 || c >= 19)) return toTop2[ch];
    if (wear === "robe" && c >= 14 && c <= 17 && chest) return "w";
    if (wear === "dress" && r < 2 && c >= 11 && c <= 20) return toSkin[ch];
    return ch;
  };
}

/** The fringe and the hat brim shade the skin just under them by a step. */
function shadeUnder(g, shadowSkin) {
  const { w, h, c, tag } = g;
  for (let i = w; i < w * h; i++) if (tag[i] === M.head && c[i] && (tag[i - w] === M.hair || tag[i - w] === M.hat)) c[i] = mix(c[i], shadowSkin, 0.7);
}

/** Inner line art: a pixel of a later material touching an earlier one (4-neighbour) goes dark, like an inked edge. */
function inkLines(g) {
  const { w, h, c, tag } = g, out = [];
  for (let i = 0; i < w * h; i++) {
    const t = tag[i];
    if (!c[i] || !t || t >= M.free) continue;
    for (const j of [i - 1, i + 1, i - w, i + w]) if (j >= 0 && j < w * h && c[j] && tag[j] && tag[j] < t) { out.push(i); break; }
  }
  for (const i of out) c[i] = mix(c[i], INK, 0.8);
}

const RAMPS = ["skin", "hair", "top", "top2", "hatColor", "bandColor", "scarf", "beardColor", "flower", "eyes"];
function resolve(look) {
  const L = typeof look === "string" ? CAST[look] : look;
  if (L._q) return L._q;
  const r = { ...L };
  for (const k of RAMPS) if (L[k]) r[k] = L[k].map((c) => (typeof c === "number" ? c : hex(c)));
  const K = r.skin, H = r.hair, T = r.top, T2 = r.top2 ?? r.top;
  const C = r.hatColor ?? (L.hat === "chef" ? ["#a8a4b4", "#e4e0ea", "#ffffff"].map(hex) : [INK, INK, INK]);
  const B = r.beardColor ?? H, SC = r.scarf ?? T, F = r.flower ?? [GOLD, WHITE_, GOLD];
  const E = r.eyes ?? ["#1a0e0a", "#4a2a1a", "#8a5a34"].map(hex);
  r.color = {
    o: INK, x: K[0], y: K[1], z: K[2],
    1: H[0], 2: H[1], 3: H[2], 4: mix(H[2], WHITE_, 0.4),
    E: mix(E[0], INK, 0.3), e: E[1], l: mix(E[2], WHITE_, 0.15), W: WHITE_, R: mix(K[2], BLUSH, 0.55), M: hex("#5a1c26"), T: hex("#e8707a"),
    a: T[0], b: T[1], c: T[2], u: T2[0], v: T2[1], w: T2[2],
    5: C[0], 6: mix(C[0], C[1], 0.5), 7: C[1], 8: C[2], 9: mix(C[2], WHITE_, 0.35), n: (r.bandColor ?? C)[1],
    G: GOLD, "+": WHITE_, "*": hex("#5ab4e0"), g: L.glassesColor ? hex(L.glassesColor) : hex("#3a2228"),
    A: B[0], C: B[1], H: B[2], i: SC[0], j: SC[1], k: SC[2], F: F[1], f: F[0],
  };
  L._q = r;
  return r;
}
