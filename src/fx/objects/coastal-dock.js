import { asset, GOLD, WOOD } from "../_kit/art.js";
import { draw as deck, meta as deckMeta } from "../tiles/coastal-boardwalk.js";

export const { meta, draw } = asset({
  name: "Coastal dock",
  desc: "A raised trading platform with a deep deck, bollards and a small painted flag.",
  tags: ["dock", "trade", "coast"], size: [48, 48], origin: [24, 36], duration: 1, fps: 1,
  palette: WOOD,
}, (p, _t, C, o) => {
  p.poly([[-14,-10],[-8,-14],[8,-14],[15,-9],[15,0],[12,5],[-13,4]], C[0]);
  p.poly([[-13,-10],[-7,-13],[7,-13],[14,-8],[13,0],[10,2],[-12,2]], C[2]);
  p.line(-13,-9,-7,-12,C[4]);
  p.line(-5,-11,8,-11,C[3]);
  p.line(-10,3,12,3,C[1]);
  deck(p, 0, {...deckMeta.options, ...o, ends:"start"});
  p.rect(9,-15,3,12,C[0]);
  p.line(10,-14,10,-4,C[3]);
  p.poly([[11,-15],[18,-15],[16,-12],[11,-11]], GOLD[1]);
  p.line(11,-15,17,-15,GOLD[4]);
  p.px(8,-3,C[4]);
});
