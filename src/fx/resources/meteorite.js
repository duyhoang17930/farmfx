import { asset, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name: "Meteorite", desc: "A scorched, pitted meteorite lodged in a shallow crater with dim pulsing embers.",
  tags: ["resource", "meteorite", "mining"], size: [32,32], origin: [16,24],
  fps: 12, duration: 2.5, palette: ["#26253a","#403548","#655169","#8d7182","#b2989f"],
}, (p, phase, C) => {
  groundShadow(p, 0, 0, 13.5, 3.1);
  p.ellipse(0,-1,13,4,C[0]);
  p.ellipse(0,-1,11,2.5,C[2]);
  p.poly([[-11,-5],[-8,-13],[-2,-18],[6,-17],[11,-12],[12,-6],[7,-2],[-5,-1]], C[0]);
  p.poly([[-10,-6],[-7,-13],[-2,-17],[5,-16],[9,-12],[11,-6],[4,-7],[-3,-4]], C[2]);
  p.poly([[-8,-11],[-2,-17],[5,-16],[8,-13],[3,-11],[-3,-10]], C[3]);
  p.line(-5,-15,-1,-17,C[4]);
  p.ellipse(-4,-11,2.4,1.5,C[1]);
  p.ellipse(4,-8,2.5,1.3,C[1]);
  p.ellipse(6,-13,1.5,1,C[1]);
  const heat = 0.62 + 0.28 * wave(phase);
  p.line(-7,-5,-3,-4,C[1]);
  p.line(-3,-4,0,-6,C[1]);
  p.dot(-3,-4,C[4],heat);
  p.dot(4,-8,C[4],heat);
  p.glow(-3,-4,3,C[3],heat * 0.28);
});
