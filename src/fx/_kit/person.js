// People for the top-down 3/4 view: chibi villagers about 16 x 24 px, a big round head on a small body, in four
// facings (down, up, right, left). Built in a grid from flat shaded parts, lit from the top-left, wrapped in one dark,
// slightly colored outline. A look says what someone is made of (skin, hair style, top, hat, glasses, beard, scarf...);
// src/fx/_kit/cast.js has the ready-made cast. Hands are placed where they should be (px from the feet) and the arms
// reach for them, so anyone can hold a tool at any angle. Files starting with _ are helpers, not effects.

import { hex, mix, lerp } from "../../core/index.js";
import { Grid } from "./creature.js";
import { CAST } from "./cast.js";

export const LOOKS = CAST;
const INK = hex("#1c1218"), EYE = hex("#1e1420"), BLUSH = hex("#ff8a80"), MOUTH = hex("#b04a4a"), GOLD = hex("#ffd25a"), WHITE_ = hex("#fff8ee");
const G = new Grid(-24, -48, 48, 56);

/**
 * Draw a person with their feet at (X, Y). facing: "down" | "up" | "right" | "left". look: a CAST name or a look object.
 * pose: { walk (cycle position, two steps per 1; -1 or absent to stand), bob (px the body drops), blink, lean (px the
 * head and chest go forward, sideways only), hands: [[x, y], [x, y]] near and far hand (omit to let them hang or
 * swing), behind: (g, flip) => {} drawn into the grid before the body, front: (g, flip) => {} after it }.
 */
export function drawPerson(p, X, Y, facing, look, pose = {}, fade = 1) {
  const L = resolve(look), g = G.clear();
  const side = facing === "right" || facing === "left", up = facing === "up", down = facing === "down", flip = facing === "left" ? -1 : 1;
  const kid = !!L.small;
  const walk = pose.walk ?? -1, step = walk < 0 ? -1 : Math.floor(((((walk % 1) + 1) % 1) * 4)); // contact, pass, contact, pass
  const bob = (pose.bob ?? 0) + (step === 1 || step === 3 ? -1 : 0);
  const lean = side ? Math.round(pose.lean ?? 0) : 0;
  const set = (x, y, c) => g.set(x * flip, y, c);
  const get = (x, y) => g.get(x * flip, y);

  // the body plan, feet at y = 0: shoes, legs, pants top, torso, then the head over the neck
  const belt = -4 + bob, torsoTop = belt - (kid ? 5 : 6), headBot = torsoTop, rows = kid ? 12 : 13;
  const headTop = headBot - rows + 1, W = kid ? 13 : 14, hx0 = (side ? -6 : -7) + lean;
  const INSET = kid ? [4, 2, 1, 0, 0, 0, 0, 0, 0, 1, 2, 3] : [4, 2, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 3];
  const inHead = (x, y) => {
    const r = y - headTop;
    return r >= 0 && r < rows && x >= hx0 + INSET[r] && x <= hx0 + W - 1 - INSET[r];
  };
  const T = L.top, T2 = L.top2, P = L.pants, Sh = L.shoes, K = L.skin, H = L.hair;
  const longSleeves = ["jacket", "robe", "sweater"].includes(L.wear);
  const sleeve = L.wear === "jacket" ? T2 : T;

  // ---- legs and shoes
  const legs = () => {
    if (L.wear === "robe") {
      for (const [x, i] of side ? [[-1 + (step === 0 ? 1 : step === 2 ? -1 : 0), 0]] : [[-3, 0], [1, 1]]) for (let k = 0; k < 3; k++) set(x + k, -1, Sh[k === 0 ? 2 : 1]);
      return;
    }
    const pair = side
      ? [[-2 + (step === 0 ? 2 : step === 2 ? -2 : 0), false], [-2 + (step === 0 ? -2 : step === 2 ? 2 : 0), true]]
      : [[-4, false], [1, false]];
    pair.forEach(([lx, far], i) => {
      const lift = !side && ((step === 1 && i === 0) || (step === 3 && i === 1)) ? 1 : 0;
      for (let y = belt + 1; y <= -2 - lift; y++) for (let k = 0; k < 3; k++) set(lx + k, y, far ? P[0] : k === 0 ? P[2] : k === 2 ? P[0] : P[1]);
      for (let k = 0; k < 3 + (side ? 1 : 0); k++) set(lx + k, -1 - lift, far ? Sh[0] : k === 0 ? Sh[2] : Sh[1]);
    });
    // the pants top joins the legs
    const x0 = side ? -3 + lean : -4, w = side ? 7 : 8;
    for (let x = x0; x < x0 + w; x++) set(x, belt, x === x0 ? P[2] : x >= x0 + w - 2 ? P[0] : P[1]);
  };

  // ---- the torso and what's worn on it
  const torso = () => {
    const x0 = side ? -4 + lean : -5, w = side ? 8 : 10;
    for (let y = torsoTop; y < belt; y++)
      for (let x = x0; x < x0 + w; x++) {
        if (y === torsoTop && (x === x0 || x === x0 + w - 1)) continue; // round shoulders
        const lit = x <= x0 + 1 ? 2 : x >= x0 + w - 2 ? 0 : 1;
        let c = T[lit];
        const rx = x - x0, ry = y - torsoTop;
        if (L.wear === "overalls") {
          const bib = side ? rx >= 2 && rx <= 6 && ry >= 2 : rx >= 2 && rx <= w - 3 && ry >= 2;
          const strap = !side && (rx === 2 || rx === w - 3) && ry < 2;
          if (bib || strap || ry >= 4) c = T2[lit];
          if (down && ry === 2 && (rx === 2 || rx === w - 3)) c = GOLD;
        } else if (L.wear === "vest" || L.wear === "jacket") {
          const open = side ? rx >= w - 2 : rx >= 4 && rx <= w - 5;
          if (!open || up) c = T2[lit];
          if (down && open && rx === 4) c = T[2];
        } else if (L.wear === "apron") {
          if (down && rx >= 2 && rx <= w - 3 && ry >= 1) c = T2[ry === 1 ? 2 : 1];
          if (side && rx >= w - 3 && ry >= 1) c = T2[1];
          if (up && ry === 2) c = T2[1];
        } else if (L.wear === "tank") {
          if (ry < 2 && !(rx >= 2 && rx <= 3) && !(rx >= w - 4 && rx <= w - 3)) c = K[lit === 0 ? 0 : lit === 2 ? 2 : 1];
        } else if (L.wear === "robe" && down && (rx === 4 || rx === 5)) c = T2[1];
        set(x, y, c);
      }
    // the neck's shadow under the chin
    if (!up) for (let x = -1; x <= 0; x++) set(x + (side ? 1 + lean : 0), torsoTop, K[0]);
    // skirts and robes flare over the legs
    const skirt = L.wear === "dress" ? [belt, -2] : L.wear === "robe" ? [belt, -2] : L.wear === "apron" && L.skirt ? [belt, -2] : null;
    if (skirt)
      for (let y = skirt[0]; y <= skirt[1]; y++) {
        const spread = Math.floor((y - skirt[0] + 1) / 2);
        for (let x = x0 - spread; x < x0 + w + spread; x++) {
          const c = x <= x0 - spread + 1 ? T[2] : x >= x0 + w + spread - 2 ? T[0] : T[1];
          set(x, y, L.wear === "apron" && down && x >= x0 + 2 && x <= x0 + w - 3 ? T2[1] : y === skirt[1] && (x - x0) % 3 === 0 ? T[0] : c);
        }
      }
    // a scarf round the neck, its tail hanging on one side
    if (L.scarf) {
      const S = L.scarf;
      for (let x = x0; x < x0 + w; x++) (set(x, torsoTop, x < x0 + 3 ? S[2] : S[1]), set(x, torsoTop + 1, S[x < x0 + w - 3 ? 1 : 0]));
      const tx = side ? x0 - 1 : x0 + w - 3;
      if (!up) for (let y = torsoTop + 2; y <= torsoTop + 4; y++) (set(tx, y, S[1]), set(tx + 1, y, S[0]));
    }
  };

  // ---- arms: sleeve then skin (or sleeve all the way), 2 px wide, a darker inner edge; a round fist
  const swing = step < 0 ? 0 : step === 0 ? 1 : step === 2 ? -1 : 0;
  const shN = side ? [-1 + lean, torsoTop + 1] : [-6, torsoTop + 1], shF = side ? [-1 + lean, torsoTop + 1] : [5, torsoTop + 1];
  const hands = pose.hands ?? (side ? [[-1 + lean + 2 * swing, belt - 1], [-1 + lean - 2 * swing, belt - 1]] : [[-7, belt - 1 + (swing > 0 ? -1 : 0)], [6, belt - 1 + (swing < 0 ? -1 : 0)]]);
  const arm = (sh, hand, dark, outer) => {
    let [hx, hy] = hand;
    const dx = hx - sh[0], dy = hy - sh[1], len = Math.hypot(dx, dy), max = kid ? 6 : 7;
    if (len > max) (hx = sh[0] + (dx / len) * max), (hy = sh[1] + (dy / len) * max);
    const n = Math.max(1, Math.ceil(Math.hypot(hx - sh[0], hy - sh[1]) * 2));
    for (let i = 0; i <= n; i++) {
      const u = i / n, x = lerp(sh[0], hx, u), y = lerp(sh[1], hy, u);
      const cloth = longSleeves || u < (L.wear === "tank" ? 0 : 0.4), R = cloth ? sleeve : K;
      set(x, y, R[dark ? 0 : outer < 0 ? 2 : 1]);
      set(x + (outer < 0 ? 1 : -1), y, R[dark ? 0 : outer < 0 ? 1 : 0]);
    }
    set(hx, hy + 1, K[dark ? 0 : 2]), set(hx + (outer < 0 ? 1 : -1), hy + 1, K[dark ? 0 : 1]);
  };

  // ---- the head
  const head = () => {
    for (let y = headTop; y <= headBot; y++)
      for (let x = hx0; x < hx0 + W; x++) if (inHead(x, y)) set(x, y, x >= hx0 + W - 3 || y >= headBot - 1 ? K[1] : K[2]);
    const eyeY = headTop + (kid ? 8 : 9);
    const ex = side ? [hx0 + 10] : [hx0 + 3, hx0 + W - 4];
    // hair, then the face over it
    hair(eyeY);
    if (!up) {
      for (const x of ex) {
        if (!pose.blink) set(x, eyeY - 1, L.eyes ? L.eyes[0] : EYE);
        set(x, eyeY, pose.blink ? K[0] : EYE);
        if (!pose.blink && L.eyes) set(x, eyeY - 1, L.eyes[0]);
      }
      const mx = side ? hx0 + 12 : hx0 + Math.floor(W / 2) - 1;
      set(mx, eyeY + 2, MOUTH);
      for (const x of side ? [hx0 + 9] : [hx0 + 2, hx0 + W - 3]) set(x, eyeY + 1, mix(K[2], BLUSH, 0.55));
      if (side) set(hx0 + W, eyeY + 1, K[1]); // the nose, just past the cheek
      if (L.glasses) {
        // thin round frames round each eye, a glint on the lens, a bridge between
        const R = L.glassesColor ?? hex("#5a4048");
        for (const x of ex) {
          for (const [dx, dy] of [[0, -2], [-1, -1], [-1, 0], [0, 1], [1, 0]]) set(x + dx, eyeY + dy, R);
          set(x + 1, eyeY - 1, hex("#e8f4ff"));
        }
        if (!side) for (let x = ex[0] + 2; x < ex[1] - 1; x++) set(x, eyeY - 1, R);
        else set(hx0 + 8, eyeY - 1, R);
      }
      beard(eyeY);
    }
    hat(eyeY);
    if (L.flower && !up) {
      const fx = side ? hx0 + 3 : hx0 + W - 3, fy = headTop + 4, F = L.flower;
      for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) set(fx + dx, fy + dy, F[1]);
      set(fx, fy, GOLD);
    }
  };

  // hair styles: a cap of hair over the top with volume past the head's edge, bangs, and whatever falls from it
  const hair = (eyeY) => {
    const st = L.hairStyle, Hc = (x, y) => (x <= hx0 + 4 && y <= headTop + 3 ? H[2] : x >= hx0 + W - 4 ? H[0] : H[1]);
    const put = (x, y) => set(x, y, Hc(x, y));
    const bald = st === "bald";
    const topRows = bald ? 0 : up ? rows - 2 : 5, hcx = hx0 + W / 2 - 0.5, hrx = W / 2 + 0.9, hry = 6.2;
    // a round cap of hair a little bigger than the skull, so the head reads round, not boxy
    const inCap = (x, y) => ((x - hcx) / hrx) ** 2 + ((y - (headTop + 5.5)) / hry) ** 2 <= 1;
    for (let y = headTop - 1; y < headTop + topRows; y++) for (let x = hx0 - 1; x <= hx0 + W; x++) if ((y < headTop + 6 && inCap(x, y)) || (y >= headTop + 5 && inHead(x, y))) put(x, y);
    if (bald) {
      for (let y = headTop + 5; y <= headTop + 8; y++) for (const x of side ? [hx0, hx0 + 1, hx0 + 2] : [hx0 - 1, hx0, hx0 + W - 1, hx0 + W]) put(x, y);
      set(hx0 + 4, headTop + 2, mix(K[2], WHITE_, 0.5)); // a shine on top
      return;
    }
    if (up) {
      // the back of the head: hair down to the nape, with a few strands
      for (let y = headTop + 5; y < headTop + rows - 3; y++) (put(hx0 - 1, y), put(hx0 + W, y));
      for (const [x, y] of [[hx0 + 3, 4], [hx0 + 7, 3], [hx0 + 10, 5], [hx0 + 5, 7], [hx0 + 9, 8]]) set(x, headTop + y, H[0]);
    } else if (side) {
      // the back half covered, the front showing the face under the bangs
      for (let y = headTop + 5; y <= headTop + 10; y++) for (let x = hx0 - 1; x <= hx0 + 5 - (y > headTop + 8 ? 2 : 0); x++) if (inHead(x, y) || (x === hx0 - 1 && y < headTop + 9)) put(x, y);
      for (const x of [hx0 + 7, hx0 + 8, hx0 + 10, hx0 + 11]) put(x, headTop + 5);
      set(hx0 + 6, eyeY, K[1]), set(hx0 + 6, eyeY + 1, K[0]); // the ear
    } else {
      // bangs: a jagged fringe, locks down past the ears
      for (let x = hx0; x < hx0 + W; x++) if ((x - hx0) % 4 !== 3) put(x, headTop + 5);
      for (let x = hx0; x < hx0 + W; x++) if ((x - hx0) % 4 === 1 || x === hx0 || x === hx0 + W - 1) put(x, headTop + 6);
      for (let y = headTop + 6; y <= eyeY; y++) (put(hx0 - 1, y), put(hx0, y), put(hx0 + W - 1, y), put(hx0 + W, y));
    }
    // strand lines in the fringe
    if (!up) for (const x of side ? [hx0 + 6, hx0 + 9] : [hx0 + 3, hx0 + 7, hx0 + 10]) set(x, headTop + 3, H[0]);
    const long = st === "long" || st === "wavy" || (st === "braid" && up);
    if (long) {
      const bottom = headBot + (st === "wavy" ? 7 : 6), top = headTop + 5;
      for (let y = top; y <= bottom; y++) {
        const u = (y - top) / (bottom - top), wob = st === "wavy" && ((y - headTop) >> 1) % 2 ? 1 : 0;
        const strand = (x) => set(x, y, (x + (y >> 1)) % 4 === 0 ? H[0] : Hc(x, y));
        if (up) {
          // the back: full width, tapering to a soft point
          const inset = Math.round(u * u * 4);
          for (let x = hx0 - 1 - wob + inset; x <= hx0 + W + wob - inset; x++) strand(x);
        } else if (side) {
          const w = Math.round(5 - u * 2);
          for (let x = hx0 - 2 - wob; x <= hx0 - 2 + w; x++) strand(x);
        } else {
          // locks either side of the face, over the shoulders, thinning at the ends
          const w = u > 0.75 ? 1 : 2;
          for (let k = 0; k <= w; k++) (strand(hx0 - 1 - wob + k - 1), strand(hx0 + W - k + wob));
        }
      }
    }
    if (st === "messy" || st === "curly") {
      for (const [dx, dy] of [[3, -1], [6, -1], [9, -1], [4, -2], [-2, 3], [W + 1, 4], [-2, 6], [W + 1, 7]]) put(hx0 + dx, headTop + dy);
      if (st === "curly") for (const [dx, dy] of [[-2, 1], [W + 1, 1], [-3, 4], [W + 2, 5], [1, -1], [11, -1]]) put(hx0 + dx, headTop + dy);
    }
    if (st === "spiky") for (const [dx, dy] of [[2, -1], [2, -2], [5, -1], [5, -2], [5, -3], [8, -1], [8, -2], [11, -1], [-2, 2], [W + 1, 2]]) put(hx0 + dx, headTop + dy);
    if (st === "bun" || st === "topknot") {
      // a round bun sitting on top, a dark crease where it meets the head
      const bx = hx0 + W / 2 - 0.5 + (side ? -2 : 0), by = headTop - 2.5, r = 3.3;
      for (let y = Math.floor(by - r); y <= by + r; y++)
        for (let x = Math.floor(bx - r - 0.5); x <= bx + r + 0.5; x++) {
          const d = ((x - bx) / (r + 0.4)) ** 2 + ((y - by) / r) ** 2;
          if (d <= 1) set(x, y, y > by + r - 1.2 ? H[0] : x < bx - 0.5 && y < by ? H[2] : x > bx + 1 ? H[0] : H[1]);
        }
    }
    if (st === "ponytail") {
      if (side) for (let y = headTop + 4; y <= headBot + 3; y++) (put(hx0 - 2, y), put(hx0 - 3 + (y > headBot ? 1 : 0), y));
      else if (up) for (let y = headBot - 2; y <= headBot + 4; y++) (put(hx0 + 6, y), put(hx0 + 7, y));
      else for (let y = headTop + 6; y <= headBot + 2; y++) put(hx0 + W + 1, y);
      if (!up) set(side ? hx0 - 2 : hx0 + W + 1, headTop + 6, L.hatColor ? L.hatColor[1] : hex("#d84a4a")); // the tie, at the root of the tail
    }
    if (st === "pigtails") for (const x of side ? [hx0 - 2, hx0 - 3] : [hx0 - 2, hx0 - 3, hx0 + W + 1, hx0 + W + 2]) for (let y = headTop + 6; y <= headBot + 2; y++) put(x, y);
    if (st === "braid") {
      const bx = side ? hx0 - 1 : up ? hx0 + 6 : hx0 + W - 2;
      for (let y = headBot - 2; y <= headBot + 7; y++) (set(bx, y, (y & 1) ? H[2] : H[0]), set(bx + 1, y, (y & 1) ? H[0] : H[1]));
      set(bx, headBot + 8, L.hatColor ? L.hatColor[1] : hex("#d84a4a"));
    }
  };

  const beard = (eyeY) => {
    if (!L.beard) return;
    const B = L.beardColor ?? H;
    const x0 = side ? hx0 + 7 : hx0 + 2, x1 = side ? hx0 + W : hx0 + W - 3;
    if (L.beard === "full")
      for (let y = eyeY + 1; y <= headBot + 2; y++)
        for (let x = x0 - (y > eyeY + 2 ? 0 : 0); x <= x1; x++) {
          if (y === headBot + 2 && (x === x0 || x === x1)) continue;
          if (!side && y === eyeY + 2 && x >= hx0 + 5 && x <= hx0 + 8) continue; // the mouth shows
          set(x, y, x <= x0 + 1 ? B[2] : x >= x1 - 1 ? B[0] : B[1]);
        }
    else if (L.beard === "mustache") for (let x = side ? hx0 + 10 : hx0 + 4; x <= (side ? hx0 + 13 : hx0 + W - 5); x++) set(x, eyeY + 2, B[1]);
    else for (let y = eyeY + 2; y <= headBot; y++) for (let x = x0; x <= x1; x++) if (inHead(x, y) && (x + y) % 2 === 0) set(x, y, mix(K[1], B[0], 0.45));
  };

  // hats sit over the hair
  const hat = (eyeY) => {
    const kind = L.hat;
    if (!kind) return;
    const C = L.hatColor ?? [INK, INK, INK], cx = hx0 + W / 2 - 0.5 + (side ? 1 : 0);
    const ellipse = (ey, rx, ry, fn) => {
      for (let y = Math.floor(ey - ry); y <= Math.ceil(ey + ry); y++)
        for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) if (((x - cx) / rx) ** 2 + ((y - ey) / ry) ** 2 <= 1) set(x, y, fn(x, y));
    };
    const dome = (y0, y1, rx, fn) => {
      for (let y = y0; y <= y1; y++) {
        const k = Math.min(1, (y - y0 + 1) / 2.2), r = rx * Math.sqrt(k);
        for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) if (Math.abs(x - cx) <= r) set(x, y, fn(x, y));
      }
    };
    const shade = (x, y, top) => (x < cx - 2 && y < top ? C[2] : x > cx + 2 ? C[0] : C[1]);
    if (kind === "straw" || kind === "sunhat" || kind === "cowboy") {
      const by = headTop + 3, rx = kind === "sunhat" ? 10.5 : 9.5;
      dome(headTop - 2, by, 5.5, (x, y) => (y === by - 1 ? (L.bandColor ?? C)[1] : shade(x, y, by - 3)));
      ellipse(by + 0.5, rx, kind === "cowboy" ? 1.4 : 1.7, (x, y) => (y > by + 1 ? C[0] : y > by ? C[1] : C[2]));
      if (kind === "cowboy") (set(cx - rx, by - 1, C[1]), set(cx + rx, by - 1, C[0]), set(cx, headTop - 2, C[0]));
      if (kind === "straw") for (const dx of [-3, 2]) set(cx + dx, headTop, C[0]);
      if (kind === "sunhat" && !up) {
        const fx = side ? cx - 4 : cx - 5, fy = by - 2, F = L.flower ?? [hex("#a85a10"), GOLD, WHITE_];
        for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1], [-1, -1], [1, 1], [1, -1], [-1, 1]]) set(fx + dx, fy + dy, F[1]);
        set(fx, fy, F[0]);
      }
    } else if (kind === "cap" || kind === "flatcap" || kind === "beanie" || kind === "bandana") {
      const y1 = headTop + (kind === "flatcap" ? 4 : kind === "beanie" ? 5 : 4);
      for (let y = headTop - 1; y <= y1; y++) for (let x = hx0 - 1; x <= hx0 + W; x++) if (inHead(x, y + (y < headTop + 1 ? 1 : 0)) || (y >= headTop + 2 && (x === hx0 - 1 || x === hx0 + W))) set(x, y, shade(x, y, headTop + 2));
      if (kind === "flatcap") for (let x = hx0 - 2; x <= hx0 + W + 1; x++) set(x, y1, C[0]);
      if (kind === "cap") {
        if (down) for (let x = hx0 + 2; x < hx0 + W - 2; x++) set(x, y1 + 1, C[0]);
        if (side) for (let x = hx0 + W - 3; x <= hx0 + W + 2; x++) (set(x, y1, C[1]), set(x, y1 + 1, C[0]));
        set(cx, headTop - 1, C[2]);
      }
      if (kind === "beanie") {
        for (let x = hx0 - 1; x <= hx0 + W; x++) (set(x, y1, C[2]), set(x, y1 - 1, C[1]));
        for (const [dx, dy] of [[0, -2], [-1, -2], [1, -2], [0, -3]]) set(cx + dx, headTop + dy, WHITE_);
      }
      if (kind === "bandana") {
        for (const [dx, dy] of [[3, 1], [9, 2]]) set(hx0 + dx, headTop + dy, WHITE_);
        const kx = side ? hx0 - 2 : up ? cx : hx0 + W + 1;
        if (!down) for (const [dx, dy] of [[0, 4], [-1, 5], [0, 6], [1, 5]]) set(kx + dx, headTop + dy, C[0]);
      }
    } else if (kind === "witch") {
      const by = headTop + 4;
      for (let y = headTop - 12; y < by; y++) {
        const u = (y - (headTop - 12)) / (by - headTop + 12), r = 1 + u * 5.5, off = (1 - u) ** 2 * 4;
        for (let x = Math.floor(cx - r + off); x <= Math.ceil(cx + r + off); x++) set(x, y, y === by - 2 ? GOLD : x < cx + off - 1 ? C[2] : x > cx + off + 2 ? C[0] : C[1]);
      }
      ellipse(by + 0.5, 11, 2, (x, y) => (y > by ? C[0] : C[1]));
    } else if (kind === "chef") {
      for (let y = headTop - 7; y <= headTop + 3; y++)
        for (let x = hx0; x < hx0 + W; x++) {
          const puff = y < headTop + 1 ? Math.abs(Math.sin((x - hx0) * 0.9)) * 1.5 : 0;
          if (y < headTop - 6 + puff || (y < headTop - 3 && (x === hx0 || x === hx0 + W - 1))) continue;
          set(x, y, y >= headTop + 2 ? hex("#d8d4de") : x > hx0 + W - 4 ? hex("#c8c4d2") : WHITE_);
        }
    } else if (kind === "bow") {
      const bx = hx0 + W - 4 - (side ? 6 : 0), by = headTop + 1;
      for (const [dx, dy] of [[-2, -1], [-2, 0], [-2, 1], [-1, 0], [1, 0], [2, -1], [2, 0], [2, 1], [-3, 0], [3, 0]]) set(bx + dx, by + dy, dx < 0 ? C[2] : C[1]);
      set(bx, by, C[0]);
    } else if (kind === "headband") {
      for (let x = hx0 - 1; x <= hx0 + W; x++) if (get(x, headTop + 4) || inHead(x, headTop + 4)) set(x, headTop + 4, x < cx ? C[2] : C[1]);
    } else if (kind === "goggles") {
      for (let x = hx0 - 1; x <= hx0 + W; x++) if (get(x, headTop + 3) || inHead(x, headTop + 3)) set(x, headTop + 3, C[0]);
      if (!up) for (const gx of side ? [hx0 + 9] : [hx0 + 3, hx0 + W - 5]) for (let dy = 2; dy <= 4; dy++) for (let dx = 0; dx <= 2; dx++) set(gx + dx, headTop + dy, dy === 2 || dx === 0 ? hex("#c8f0ff") : hex("#5ab4e0"));
    }
  };

  // draw order: tool behind, far arm, legs, torso and arms (arms first when seen from behind), head, near arm, tool in front
  pose.behind?.(g, flip, { belt, torsoTop });
  if (side) arm(shF, hands[1], true, -1);
  legs();
  if (up) (arm(shN, hands[0], false, -1), arm(shF, hands[1], false, 1), torso());
  else (torso(), !side && (arm(shN, hands[0], false, -1), arm(shF, hands[1], false, 1)));
  head();
  if (side) arm(shN, hands[0], false, -1);
  pose.front?.(g, flip, { belt, torsoTop });
  // one outline, dark, picking up a little of the color it wraps
  g.outline((x, y, nx, ny) => {
    const inner = g.get(x - Math.sign(nx), y - Math.sign(ny)) || g.get(x - Math.sign(nx), y) || g.get(x, y - Math.sign(ny));
    return inner ? mix(inner, INK, 0.8) : INK;
  });
  g.draw(p, fade, X, Y);
  return { belt, torsoTop };
}

const RAMPS = ["skin", "hair", "top", "top2", "pants", "shoes", "hatColor", "bandColor", "scarf", "beardColor", "flower", "eyes"];

/** A look with its ramps resolved to colors (cached on the look object). */
function resolve(look) {
  const L = typeof look === "string" ? LOOKS[look] : look;
  if (!L) throw new Error(`no look ${look}`);
  if (L._r) return L._r;
  const r = { ...L };
  for (const k of RAMPS) if (L[k]) r[k] = L[k].map((c) => (typeof c === "number" ? c : hex(c)));
  r.top2 = r.top2 ?? r.top;
  r.glassesColor = L.glassesColor ? hex(L.glassesColor) : null;
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
