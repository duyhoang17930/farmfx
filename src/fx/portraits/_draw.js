import { hex, red, green, blue } from "../../core/index.js";
import { CAST } from "../_kit/cast.js";
import { figurePalette } from "../_kit/figure-colors.js";
import { portraitArt } from "./_art.js";

const LASH = hex("#38242a");
const LIP = hex("#a45350");
const MOUTH = hex("#602e35");
const TONGUE = hex("#dc887c");
const skinKeys = new WeakMap();

function skinKey(art, color) {
  if (!skinKeys.has(art)) {
    const channels = [red, green, blue];
    const target = hex(color);
    const distance = (key) => channels.reduce((sum, c) => sum + (c(hex(art.palette[key])) - c(target)) ** 2, 0);
    skinKeys.set(art, Object.keys(art.palette).reduce((best, key) => distance(key) < distance(best) ? key : best));
  }
  return skinKeys.get(art);
}

function closeEye(p, x, y, left, smiling, glasses, skin) {
  const width = glasses ? (left ? 3 : 2) : (left ? 4 : 3);
  const start = x - 1;
  p.rect(start, y - (glasses ? 1 : 2), width, glasses ? 3 : 4, skin);
  if (!glasses) p.rect(x, y + 2, width - 1, 1, skin);
  p.rect(start, y, width, 1, LASH);
  if (smiling && width > 2) {
    p.rect(x, y, width - 2, 1, skin);
    p.rect(x, y - 1, width - 2, 1, LASH);
  }
}

export function drawPortrait(p, name, pose = {}) {
  const art = portraitArt[name];
  const look = CAST[name];
  const palette = figurePalette(art.palette, pose);
  const skin = hex(palette[skinKey(art, look.skin[2])]);
  const dy = -48 + Math.round(pose.bob ?? 0);
  const [nearX, nearY, farX, farY, mouthX, mouthY] = art.features;
  const face = {
    rect: (x, y, w, h, color) => p.rect(x - 20, y + dy, w, h, color),
  };
  p.sprite(art.rows, palette, -20, dy);
  if ((pose.blink || pose.expression === "happy") && look.portraitEyes !== "closed") {
    const happy = pose.expression === "happy";
    closeEye(face, nearX, nearY, true, happy, look.glasses, skin);
    closeEye(face, farX, farY, false, happy, look.glasses, skin);
  }
  const talk = (pose.talk ?? 0) > 0.3;
  const surprised = pose.expression === "surprised";
  const neutral = pose.expression === "neutral";
  if (talk || surprised || neutral) {
    if (look.beard !== "full") face.rect(mouthX - 2, mouthY - 1, 5, 2, skin);
    if (talk || surprised) {
      const width = talk ? 4 : 3;
      face.rect(mouthX - 1, mouthY - 1, width, 2, MOUTH);
      face.rect(mouthX, mouthY + 1, width - 2, 1, TONGUE);
    } else {
      face.rect(mouthX - 1, mouthY, 3, 1, LIP);
    }
  }
}
