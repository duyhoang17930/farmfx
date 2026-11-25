import { draw, meta as shoreline } from "./island-shore.js";

export const meta = {
  ...shoreline,
  name: "Coastal shoreline",
  desc: "A quiet coastal tile with wind-swept grass and an irregular shore with a broader south-facing bank.",
  options: {
    ...shoreline.options, meadow: true, irregular: true,
    palette: ["#528258","#80a76b","#8eb56d","#9abe78","#c5d38a"],
    bank: ["#7e7861","#ab9267","#c5a778","#e5c993"],
  },
};
export { draw };
