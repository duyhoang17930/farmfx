import { asset, CREAM, GOLD, RED, STEEL, WATER, WOOD } from "../../_kit/art.js";

export const { meta, draw } = asset({
  name: "Touch action",
  desc: "A pixel touch control with pressed, hold progress and locked states.",
  tags: ["button", "touch", "mobile"], size: [48, 48], origin: [24, 24],
  duration: 1, fps: 1, palette: WATER, bg: "dark",
  options: { state: "ready", progress: 0, mark: "+", tool: "" },
}, (p, _t, C, o) => {
  const locked = o.state === "locked";
  const y = o.state === "pressed" ? 2 : 0;
  p.circle(0, 2, 19, C[0]);
  p.circle(0, y, 18, locked ? RED[1] : C[3]);
  p.circle(0, y, 15, C[0]);
  p.arc(0, y, 14, 1, Math.PI, Math.PI * 1.5, C[2]);
  if (o.progress > 0) p.arc(0, y, 17, 1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, o.progress), GOLD[4]);
  if (o.tool === "axe" || o.tool === "pick") {
    const shade = locked ? RED[0] : STEEL[0];
    const steel = locked ? RED[4] : STEEL[4];
    p.beam(-6, y + 7, 4, y - 5, 3, shade);
    p.line(-6, y + 6, 4, y - 6, WOOD[4]);
    if (o.tool === "pick") {
      p.poly([[-7,y-6],[-4,y-9],[1,y-9],[7,y-5],[9,y-1],[6,y-2],[3,y-5],[-1,y-6]], shade);
      p.poly([[-5,y-7],[-2,y-8],[1,y-8],[6,y-5],[8,y-2],[3,y-5],[0,y-7]], steel);
    } else {
      p.poly([[-1,y-8],[4,y-9],[8,y-5],[8,y],[5,y+1],[1,y-4]], shade);
      p.poly([[0,y-7],[4,y-8],[7,y-4],[7,y-1],[5,y],[3,y-4]], steel);
    }
  } else {
    p.text(String(o.mark).slice(0, 1), 0, y - 3, locked ? RED[4] : CREAM[4], { align: "center", font: "big" });
  }
});
