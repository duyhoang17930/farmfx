import { fit } from "../../core/index.js";
const materials=[
  ["#3c2b2d","#654236","#986242","#b7804e","#e6af71"],
  ["#303341","#494d57","#6f7a7d","#a0a5a2","#d0d0ba"],
  ["#472e3c","#76473e","#b46749","#e48c5c","#ffc295"],
  ["#30374a","#4c586d","#758b9b","#a5bbc1","#e2e4cd"],
  ["#283849","#3e546e","#63859f","#9abccb","#e1eee5"],
  ["#62422e","#926033","#c08c46","#ebbd58","#ffe68c"],
  ["#2f375e","#465b8a","#638fc2","#96ccd6","#d4f4f5"],
  ["#232232","#3b3049","#584d6f","#837699","#bbacbc"],
];
export const toolTiers=new Set(["axe","pickaxe","hoe","shovel","hammer","scythe","watering-can","fishing-rod"]);
export function toolColors(C,tier){
  const material=materials[Math.round(tier)-1];
  return material?fit(material,5):C;
}
