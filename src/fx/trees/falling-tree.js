import { ease, Painter, rand, seg } from "../../core/index.js";
import { asset, WOOD } from "../_kit/art.js";
import { MAPLE, maple } from "../_kit/tree-crowns.js";
import { groundShadow, Layer } from "../_kit/sprite.js";

const TIP = 0.14;
const IMPACT = 0.72;
const DURATION = 1.24;
const sprite = new Layer(64,64);
let lastSprite = "";
const falling = asset({
  name: "Falling tree", desc: "A maple leans, falls sideways and settles in a puff of dust and leaf litter.",
  tags: ["tree", "chop", "impact"], size: [144,96], origin: [72,64],
  palette: MAPLE, loop: false, duration: DURATION, fps: 24,
}, (p, phase, C, o) => {
  if (phase >= 1) return;
  const t = phase * DURATION;
  const lean = seg(t,TIP,IMPACT);
  const windup = -0.085 * Math.sin(Math.PI*seg(t,0,TIP));
  const settle = 0.10 * Math.sin(Math.PI*seg(t,IMPACT,0.94));
  const angle = windup + 1.38*ease.inQuad(lean) - settle;
  const opacity = 1-seg(t,0.90,1.14);
  const cut = 5*ease.outCubic(seg(t,TIP,IMPACT));
  const reach = 40*Math.sin(angle);
  if (opacity > 0) {
    groundShadow(p,reach*0.6,-1,13+reach*0.25,3.6,opacity);
    const key = [o.seed,...C].join(",");
    if (lastSprite !== key) {
      maple(sprite.begin(-32,-56),C,WOOD,0,o.seed);
      lastSprite = key;
    }
    const side = p.fx;
    const body = new Painter(p.frame).place(p.toX(0,-cut),p.toY(0,-cut),
      side < 0, Math.atan2(p.sn,p.cs) + side*angle);
    body.fade = p.fade*opacity;
    body.shade(-30,-56,30,4,(x,y) => sprite.get(x,y));
  }
  if (t < IMPACT) return;
  const age = t-IMPACT;
  const dust = 1-seg(age,0.04,0.43);
  for (let i = 0; i < 10; i++) {
    const speed = 8+rand(i,4,o.seed)*30;
    const side = i%2 === 0 ? -1 : 1;
    const x = 38+side*(2+age*speed);
    const y = 1-rand(i,5,o.seed)*4-age*(9+speed*0.46)+age*age*25;
    p.disc(x,y,1.7+age*7,WOOD[3],dust*0.24);
    p.line(x,y-1,x+side*2,y,C[i%2+2],dust*(0.65+rand(i,8,o.seed)*0.35));
  }
});

export const meta = { ...falling.meta, events: { tip: TIP, impact: IMPACT } };
export const draw = falling.draw;
