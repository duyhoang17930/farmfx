import { hex, ramp } from "../../core/index.js";
import { STEEL, WOOD } from "./art.js";
import { groundShadow } from "./sprite.js";

// Original hood, scarf and satchel. Side pixels face right and are mirrored for left.
const HEAD = {
  down: [
    "....ooooo....", "..oHHHHHHHo..", ".oHHHHHHHHho.", "oHHHHHHHhhhho",
    "oHHHhhhhhhhho", "ohhhoooooohho", ".ooSFFFSooho.", ".oSFeFFeSSo..",
    "..oSFFFFSo...", "...oSSSSo....", "....oooo.....",
  ],
  up: [
    "....ooooo....", "..oHHHHHHHo..", ".oHHHHHHHHho.", "oHHHhhhhhhhho",
    "oHHhhhhhhhhho", "ohhhhhhhhhho.", ".ohhhhhhhho..", ".ohhhohhho...",
    "..ohhohho....", "...ohoho.....", "....ooo......",
  ],
  right: [
    "....ooooo....", "..oHHHHHHHo..", ".oHHHHHHHHho.", "oHHHHHHhhhhho",
    "oHHhhhhhhhooo", "ohhhhhhhoFFo.", "ohhhhhhoF-eo.", ".ohhhhhoFFSSo",
    "..ohhhoSFFSo.", "...ooooSSSo..", ".......ooo...",
  ],
};
const HOOD = ["#33353e", "#66743e", "#aabb62", "#dc9170", "#f6bd8b"];
export const WINDKEEPER = ["#243848", "#386879", "#6fb0aa", "#db9067", "#ffd3a1"];
const COAT = ramp(["#343042", "#563e57", "#775467", "#ac717b", "#e39a8b"]);
const PANTS = ramp(["#2b2939", "#45435a", "#65637c"]);
const SCARF = ramp(["#633a37", "#c15c41", "#f08d55", "#ffb46a"]);
const eye = hex("#362c3b");

const KEEPER_HEAD = {
  down: [
    ".........ww......", ".....oooowW......", "....oHHHHow......", "...oHHHHHHoo.....",
    "..oHHHHHhhHho....", ".oHHHHhhhHHhho...", "oHHHhhhhhhhHHhoo.",
    "oLLLllLLLLLLLllo.", ".oooBBMBBMBBooo..", "..oBBSFFFFFFFSo..",
    "..oBSeFFFFeFSo...", "...oSFRFFRFFo....", "....oSSSSSSo.....", ".....oooooo......",
  ],
  up: [
    ".........ww......", ".....oooowW......", "....oHHHHow......", "...oHHHHHHoo.....",
    "..oHHHHHhhHho....", ".oHHHHhhhHHhho...", "oHHHhhhhhhhHHhoo.",
    "oLLLllLLLLLLLllo.", ".oooLLLllLLLooo..", "..oMMMLLMMMBBo...",
    "..oBMMMMMMMMBo...", "...oBBMRRMMBo....", "....oBBBBBBo.....", ".....oooooo......",
  ],
  right: [
    "......ww.........", "....oowW.........", "...oHHowooo......", "..oHHHHHHHHo.....",
    ".oHHHHHHHHhhoo...", ".oHHHHHHhhhhhoo..", "oHHHhhhhhhhhhhoo.",
    "oLLLLllllLLLLLLo.", ".ooLoooBBBFFoo...", "..oMMBBSFFFFFo...",
    "..oBMMBBSFeFFo...", "...oMMBBSFRFSo...", "....oBBSFFFFo....", "......oooooo.....",
  ],
};
const KEEPER_HAT = ramp(["#615444", "#b7894f", "#d8a961", "#efd388", "#f5e5ab"]);
const KEEPER_COAT = ramp(["#344e55", "#406e78", "#548f99", "#76b0b0", "#b3d8c6"]);
const KEEPER_PANTS = ramp(["#3b3849", "#54566b", "#70798e"]);
const KEEPER_SCARF = ramp(["#683a52", "#a25067", "#dd746c", "#ffa284"]);
const KEEPER_FEATHER = ramp(["#527d79", "#dcf5d9"]);
const KEEPER_HAIR = ramp(["#653937", "#92503e", "#c4794e"]);

const WALK = [
  { feet: [-2, 0], sideFeet: [-2, 2], arms: 2, bob: 0 },
  { feet: [-3, 0], sideFeet: [0, 1], arms: 1, bob: -1 },
  { feet: [0, -2], sideFeet: [2, -2], arms: -2, bob: 0 },
  { feet: [0, -3], sideFeet: [1, 0], arms: -1, bob: -1 },
];
const STAND = { feet: [0, 0], sideFeet: [0, 0], arms: 0, bob: 0 };

export function explorer(p, palette, facing, { step = -1, bob = 0, lean = 0, hand, tool, tip, shadow = true, outfit } = {}) {
  const keeper = outfit === "windkeeper";
  const coat = keeper ? KEEPER_COAT : COAT;
  const pants = keeper ? KEEPER_PANTS : PANTS;
  const scarf = keeper ? KEEPER_SCARF : SCARF;
  const mirrored = facing === "left";
  const view = mirrored ? "right" : facing;
  const side = view === "right";
  const back = view === "up";
  const motion = WALK[step] ?? STAND;
  const yy = bob + motion.bob;
  const upper = yy + Number(keeper);
  const x = (value) => mirrored ? -value : value;
  const rect = (left, top, w, h, color) => p.rect(x(mirrored ? left + w - 1 : left), top, w, h, color);
  const line = (a, b, color) => p.line(x(a[0]), a[1], x(b[0]), b[1], color);
  const poly = (points, color) => p.poly(points.map(([px, py]) => [x(px), py]), color);
  const shoulder = [lean + (side ? -1 : 4 + Number(keeper)), upper - 10];
  const grip = hand ?? [shoulder[0] + (side ? motion.arms : 2), yy - 6 - (side ? 0 : motion.arms)];
  const far = [lean + (side ? 3 : -4 - Number(keeper)), upper - 10];
  const arm = (start, end, near) => {
    line(start, end, coat[0]);
    line([start[0] - 1, start[1]], [end[0] - 1, end[1]], coat[near ? 3 : 1]);
    if (keeper) rect(end[0] - 1, end[1] - 1, 2, 1, coat[4]);
    rect(end[0] - 1, end[1], 2, 2, palette[near ? 4 : 3]);
  };
  const heldTool = () => {
    const dx = tip[0] - grip[0], dy = tip[1] - grip[1];
    const length = Math.hypot(dx, dy);
    const along = [dx / length, dy / length], across = [-along[1], along[0]];
    const at = (a, b) => [tip[0] + a * along[0] + b * across[0], tip[1] + a * along[1] + b * across[1]];
    const blade = (points, color) => poly(points.map(([a, b]) => at(a, b)), color);
    line([grip[0] - 2 * along[0], grip[1] - 2 * along[1]], tip, WOOD[0]);
    line(grip, tip, WOOD[3]);
    if (tool === "axe") {
      blade([[-2, -2], [1, -2], [3, 1], [3, 4], [0, 5], [-2, 2]], STEEL[0]);
      blade([[-1, 0], [1, 0], [2, 2], [2, 4], [0, 4]], STEEL[3]);
      line(at(2, 2), at(1, 4), STEEL[4]);
    } else if (tool === "pickaxe") {
      blade([[-3, -5], [0, -4], [2, -1], [2, 2], [0, 5], [-3, 6], [-1, 2], [-1, -2]], STEEL[0]);
      line(at(-2, -4), at(1, -1), STEEL[3]);
      line(at(1, -1), at(1, 2), STEEL[4]);
      line(at(1, 2), at(-2, 5), STEEL[3]);
    } else {
      blade([[-4,-2],[0,-3],[3,0],[0,3],[-4,2]],STEEL[0]);
      line(at(-2,-1),at(2,0),STEEL[4]);
      line(at(0,-2),at(0,2),STEEL[2]);
    }
  };

  if (shadow) groundShadow(p, 0, keeper ? 1 : 0, keeper ? 7 : 6.5, 2, keeper ? 0.75 : 1);
  arm(far, [far[0] - (side ? motion.arms : 1), yy - 6 + (side ? 0 : motion.arms)], false);
  for (let i = 0; i < 2; i++) {
    const foot = side ? -2 + i * 3 + motion.sideFeet[i] : -4 + i * 5;
    const lift = motion.feet[i];
    rect(foot, lift - 6, 3, 6, pants[i === 0 ? 1 : 2]);
    rect(foot + Number(side), lift - 2, side ? 4 : 3, 2, pants[0]);
    rect(foot + Number(side), lift - 2, 2, 1, WOOD[2]);
  }
  const shoulderWidth = keeper ? 5 : 4, coatWidth=keeper?6:5;
  poly([[lean - shoulderWidth, upper - 12], [lean + shoulderWidth, upper - 12], [lean + coatWidth, yy - 5],
    [lean + 3, yy - 3], [lean - 4, yy - 4], [lean - coatWidth, yy - 6]], coat[0]);
  rect(lean - 3, upper - 11, keeper ? 9 : 7, keeper ? 5 : 6, coat[2]);
  rect(lean - 3, upper - 11, 2, keeper ? 4 : 5, coat[3]);
  if (back || side) {
    rect(lean - (side ? 5 : 3), yy - 11, 5, 6, WOOD[0]);
    rect(lean - (side ? 4 : 2), yy - 10, 3, 4, WOOD[2]);
    rect(lean - (side ? 4 : 2), yy - 10, 3, 1, WOOD[4]);
  } else {
    line([lean - 2, yy - 11], [lean + 2, yy - 6], WOOD[3]);
    rect(lean + 1, yy - 7, 3, 3, WOOD[1]);
  }
  rect(lean - 4, upper - 13, 8, 3, scarf[0]);
  rect(lean - 3, upper - 13, 7, 2, scarf[2]);
  rect(lean - 4, upper - 11, 2, 3, scarf[1]);
  if (keeper) {
    const tailX = lean - (side || back ? 5 : 4);
    const tailY = yy - 6 + (step === 1 ? -1 : step === 3 ? 1 : 0);
    poly([[lean - 3, yy - 12], [tailX - 3, tailY - 2], [tailX + 1, tailY], [lean - 1, yy - 10]], scarf[0]);
    line([lean - 3, yy - 11], [tailX - 2, tailY - 2], scarf[2]);
    rect(lean + (side || back ? -3 : 1), yy - 9, 2, 2, KEEPER_HAT[3]);
    rect(lean - 1, yy - 5, 3, 1, coat[3]);
  }

  if (back && tool) {
    heldTool();
    arm(shoulder, grip, true);
  }
  const colors = keeper
    ? { o: KEEPER_HAT[0], H: KEEPER_HAT[3], h: KEEPER_HAT[2], L: KEEPER_HAT[1], l: KEEPER_HAT[4],
      B: KEEPER_HAIR[0], M: KEEPER_HAIR[1], R: KEEPER_HAIR[2], S: palette[3], F: palette[4], e: eye,
      w: KEEPER_FEATHER[0], W: KEEPER_FEATHER[1] }
    : { o: palette[0], h: palette[1], H: palette[2], S: palette[3], F: palette[4], e: eye, "-": palette[4] };
  const heads = keeper ? KEEPER_HEAD : HEAD;
  const offset = keeper ? 8 : 6;
  p.sprite(heads[view] ?? heads.down, colors, (mirrored ? -lean : lean) - offset, yy - (keeper ? 26 : 23), { flip: mirrored });
  if (!back || !tool) {
    if (tool) heldTool();
    arm(shoulder, grip, true);
  }
}

export { HOOD };
