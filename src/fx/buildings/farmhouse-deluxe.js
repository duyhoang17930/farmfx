import { asset, CREAM, LEAF, RED, WOOD, box, post, wave } from "../_kit/art.js";
import { doorway, gable, window } from "../_kit/architecture.js";
export const { meta, draw } = asset({
  name:"Deluxe farmhouse", desc:"A second farmhouse upgrade with two dormers, a wraparound porch, flower boxes and warm shutters.",
  tags:["building","farmhouse","upgrade"],size:[80,80],origin:[40,62],palette:CREAM,duration:3.2,options:{open:-1,lit:true},
},(p,ph,C,o)=>{
  gable(p,-4,0,51,28,12,C,LEAF,7);
  for(const x of [-14,10]){
    p.poly([[x-6,-30],[x,-39],[x+6,-30],[x+6,-25],[x-6,-25]],RED[1]);
    p.poly([[x-5,-30],[x,-37],[x+5,-30],[x+5,-25],[x-5,-25]],RED[3]);
    window(p,x-2,-31,5,5,o.lit);
  }
  window(p,-25,-20,8,8,o.lit);window(p,7,-20,8,8,o.lit);
  doorway(p,-10,0,10,15,C,o.open<0?Math.max(0,wave(ph,1,-.18)):Math.max(0,Math.min(1,o.open)));
  p.poly([[-29,-12],[20,-12],[25,-9],[-30,-9]],LEAF[2]);p.line(-30,-9,25,-9,LEAF[4]);
  for(const x of [-27,-14,5,22])post(p,x,0,9,CREAM);
  p.rect(-29,0,53,3,WOOD[2]);p.line(-27,3,25,3,WOOD[1]);
  for(const x of [-23,12]){
    box(p,x-4,-1,8,4,2,WOOD);
    for(const dx of [-2,1,3]){p.line(x+dx,-6,x+dx,-10,LEAF[3]);p.px(x+dx,-9+(dx%2),RED[4]);}
  }
});
