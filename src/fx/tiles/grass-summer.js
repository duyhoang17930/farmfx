import { meta as grass, draw as paint } from "./grass.js";
export const meta = { ...grass, name: "Summer grass", desc: "The summer grass tile with seeded ground texture and animated tufts.", options: {...grass.options,season:"summer"} };
export const draw = paint;
