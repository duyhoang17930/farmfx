import { fit } from "../../core/index.js";
import { explorer, HOOD } from "../_kit/island-explorer.js";

const POSES = {
  down: [
    [0, 0, 5, -8, 8, -15], [-1, -1, 4, -15, 7, -24], [0, 0, 6, -12, 10, -19],
    [0, 2, 5, -4, 6, 4], [0, 2, 5, -3, 3, 5], [0, 1, 5, -6, 8, 0], [0, 0, 5, -8, 8, -15],
  ],
  up: [
    [0, 0, 5, -9, 8, -16], [-1, -1, 6, -11, 11, -17], [0, 0, 7, -17, 11, -25],
    [0, 2, 5, -19, 4, -30], [0, 2, 4, -18, 2, -29], [0, 1, 6, -13, 7, -22], [0, 0, 5, -9, 8, -16],
  ],
  right: [
    [0, 0, 3, -8, 8, -15], [-2, -1, -4, -14, -10, -22], [0, 0, 1, -15, 2, -25],
    [2, 2, 9, -8, 18, -5], [2, 2, 9, -7, 17, -2], [1, 1, 6, -7, 13, -6], [0, 0, 3, -8, 8, -15],
  ],
};

// Hold the wind-up and contact for two frames each.
const FRAME_POSE = [0, 1, 1, 2, 3, 3, 4, 5, 6];
export const meta = {
  name: "Gathering swing",
  desc: "The explorer swings an axe or pickaxe in four facings, with a contact cue for impact effects.",
  tags: ["player", "chop", "mine", "axe", "pickaxe"], size: [48, 48], origin: [24, 36],
  duration: 0.6, fps: 15, loop: false, bg: "field", omitTerminalFrame: true,
  events: { contact: 4 / 15 },
  options: { facing: "right", tool: "pickaxe", palette: HOOD },
};

export function draw(p, t, o) {
  const frame = Math.floor(t * meta.fps + 1e-6);
  if (frame >= FRAME_POSE.length) return;
  const poses = POSES[o.facing === "left" ? "right" : o.facing] ?? POSES.right;
  const [lean, bob, hx, hy, tx, ty] = poses[FRAME_POSE[frame]];
  explorer(p, fit(o.palette, 5), o.facing, { lean, bob, hand: [hx, hy], tip: [tx, ty], tool: o.tool });
}
