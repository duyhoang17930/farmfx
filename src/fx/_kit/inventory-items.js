import { fit } from "../../core/index.js";
import { asset } from "./art.js";

export function itemPoly(p,x,y,points,color) {
  p.poly(points.map(([dx,dy]) => [x+dx,y+dy]),color);
}

export function inventoryItems(group, definitions) {
  const prefix = `items/${group}/`;
  return {
    item(id) {
      const [desc,palette,paint] = definitions[id];
      const name = id[0].toUpperCase() + id.slice(1).replaceAll("-"," ");
      return asset({
        name, desc, tags: ["item","inventory",group,id], size: [16,16], origin: [8,8],
        duration: 1, fps: 1, bg: "dark", palette,
      }, (p,_phase,C) => paint(p,0,0,C));
    },
    drawIcon(p,id,x,y) {
      const key = typeof id === "string" && id.startsWith(prefix) ? id.slice(prefix.length) : id;
      if (!Object.hasOwn(definitions,key)) return false;
      const [,palette,paint] = definitions[key];
      paint(p,x,y,fit(palette,5));
      return true;
    },
  };
}
