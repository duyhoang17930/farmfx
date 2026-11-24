import { icon } from "../_kit/farm-ui.js";

export const meta = {
  name: "Metal ingot",
  desc: "A small beveled metal bar for smelting recipes, inventory slots and ground pickups.",
  tags: ["ingot", "metal", "item", "icon"], size: [16, 16], origin: [8, 8],
  duration: 1, fps: 1, loop: true, bg: "dark",
};

export function draw(p) {
  icon(p, "ingot", 0, 0, 0);
}
