import { asset, wave } from "../_kit/art.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = asset({
  name:"Mist fern",desc:"A violet fern with small blue crystals along the stems.",
  tags:["tile","plant","crystal"],size:[32,32],origin:[16,24],duration:2.5,fps:12,
  palette:["#4d4a70","#6b5e89","#927aa3","#b9a2b3","#c3e5da"],options:{ growth:1 },
},(p,t,C,o)=>{
  const scale=o.growth===0?.76:o.growth===2?1.2:1;
  const wind=Math.round(wave(t,1,o.seed*.1));
  groundShadow(p,0,1,8*scale,2,.7);
  for(const [x,y] of [[-8,-7],[-4,-12],[3,-11],[8,-6]]){
    const dx=x*scale+wind,dy=y*scale;
    p.line(0,0,dx,dy,C[1]);
    for(const [u,d] of [[.41,-1],[.63,1],[.79,-1]]) {
      const bx=dx*u, by=dy*u;
      p.poly([[bx,by],[bx+d*3,by-3],[bx+d*4,by-3],[bx+d*3,by],[bx,by+1]],C[2]);
      p.px(bx+d*3,by-3,C[3]);
    }
    p.line(dx,dy-2,dx,dy+1,C[4]);
  }
});
