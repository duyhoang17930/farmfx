import { meta as grass, draw as paint } from "./grass.js";
export const meta = { ...grass, name: "Winter grass", desc: "The winter grass tile with seeded ground texture and animated tufts.", options: {...grass.options,season:"winter"} };
export const draw = paint;
