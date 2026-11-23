import { meta as grass, draw as paint } from "./grass.js";
export const meta = { ...grass, name: "Autumn grass", desc: "The autumn grass tile with seeded ground texture and animated tufts.", options: {...grass.options,season:"autumn"} };
export const draw = paint;
