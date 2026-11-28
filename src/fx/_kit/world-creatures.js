import { ease, fit, hex, rand, TAU } from "../../core/index.js";
import { drawCreature } from "./creature-art.js";
import { CREAM, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD, round, wave } from "./art.js";
import { groundShadow, Layer, twinkle } from "./sprite.js";
import { detailSlabs } from "./surface-detail.js";

/** The surface a family is made of, for the detail worked into its big flat areas. */
function materialOf(spec){
  const {family:f,palette:pal}=spec;
  if(f==="golem")return pal==="crystal"||pal==="ice"?"facets":"cracks";
  if(f==="elemental")return pal==="ice"?"facets":"bubbles";
  if(f==="treant"||f==="plant"||f==="mimic")return "grain";
  if(["dragon","worm","spider","demon","fish","crab"].includes(f))return "scales";
  if(f==="slime"||f==="jelly"||f==="octopus")return "bubbles";
  if(f==="mummy")return "wraps";
  if(f==="wizard"||f==="folk"||f==="ghost")return "folds";
  if(f==="bone")return "cracks";
  return "mottle";
}

const palettes={green:LEAF,blue:WATER,red:RED,poison:["#272d39","#435341","#83a05f","#b0bd72","#e7df93"],
  crystal:["#38445f","#526c99","#719cbe","#aae0dd","#eff4dc"],bone:CREAM,ghost:VIOLET,stone:STEEL,fire:RED,
  ice:WATER,lightning:GOLD,wood:WOOD,amber:GOLD,pink:["#5a3346","#93505f","#cf7d86","#f0a8a5","#ffd7c4"],dark:["#2d253e","#463651","#644c68","#8b6e8d","#d1a3b7"]};
const layers={animal:new Layer(64,64),enemy:new Layer(64,64),boss:new Layer(112,112)};
// Draws the creature's shapes at its own size instead of resampling a fixed-size sprite: a boss twice as big gets
// twice the room for detail with 1 px lines, and a chick at half size stays crisp, never a resampled smear.
class Scaled{
  constructor(p,k){this.p=p;this.k=k;}
  px(x,y,c){this.p.px(x*this.k,y*this.k,c);}
  dot(x,y,c,a){this.p.dot(x*this.k,y*this.k,c,a);}
  rect(x,y,w,h,c,a){const k=this.k;this.p.rect(Math.round(x*k),Math.round(y*k),Math.max(1,Math.round(w*k)),Math.max(1,Math.round(h*k)),c,a);}
  line(x0,y0,x1,y1,c,a){const k=this.k;this.p.line(x0*k,y0*k,x1*k,y1*k,c,a);}
  beam(x0,y0,x1,y1,w,c,a){const k=this.k;this.p.beam(x0*k,y0*k,x1*k,y1*k,Math.max(1,w*k),c,a);}
  poly(pts,c,a){const k=this.k;this.p.poly(pts.map(([x,y])=>[x*k,y*k]),typeof c==="function"?(x,y)=>c(x/k,y/k):c,a);}
  glow(x,y,r,c,a){const k=this.k;this.p.glow(x*k,y*k,r*k,c,a);}
  tri(x0,y0,x1,y1,x2,y2,c,a){this.poly([[x0,y0],[x1,y1],[x2,y2]],c,a);}
  polyline(pts,c,a){this.p.polyline(pts.map(([x,y])=>[x*this.k,y*this.k]),c,a);}
  ellipse(x,y,rx,ry,c,a){const k=this.k;this.p.ellipse(x*k,y*k,rx*k,ry*k,c,a);}
  circle(x,y,r,c,a){const k=this.k;this.p.circle(x*k,y*k,r*k,c,a);}
  ring(x,y,r,w,c,a){const k=this.k;this.p.ring(x*k,y*k,r*k,Math.max(1,w*k),c,a);}
  arc(x,y,r,w,a0,a1,c,a){const k=this.k;this.p.arc(x*k,y*k,r*k,typeof w==="function"?(u)=>Math.max(1,w(u)*k):Math.max(1,w*k),a0,a1,c,a);}
}
const lavaStone=fit(["#24232d","#393540","#514654","#76616b","#aa8784"],5);
const tails=new Set(["fox","squirrel","raccoon","wolf","snow-wolf","angry-boar","donkey","deer","mini-dragon","frost-dragon","fire-dragon"]);
export function roster(source){
  return Object.fromEntries(source.trim().split(String.fromCharCode(10)).flatMap(line=>{
    const [family,palette,scale,...ids]=line.trim().split(/ +/);
    return ids.map(id=>[id,{family,palette,scale:+scale}]);
  }));
}
const states={
  enemy:["idle","move","attack","hurt","stunned","death","spawn"],
  boss:["idle","move","attack","attack-heavy","attack-ranged","phase","hurt","death","spawn","reward"],
  animal:["idle","walk","eat","sleep"],
};
export function worldCreature(id,kind,spec){
  const size=kind==="boss"?[96,96]:kind==="animal"?[48,48]:[64,64];
  const origin=[size[0]/2,size[1]-12], duration=1.25;
  const meta={name:id.replaceAll("-"," "),desc:`A top-down ${id.replaceAll("-"," ")} with selectable animation states.`,
    tags:[kind,spec.family],size,origin,duration,fps:12,loop:true,bg:"field",
    collision:{width:kind==="boss"?30:kind==="animal"?12:16,height:kind==="boss"?19:10},
    clips:states[kind],options:{state:"idle",facing:"down",palette:palettes[spec.palette],seed:1}};
  function draw(p,t,o){
    const phase=t/duration,state=o.state,C=fit(o.palette,5), exit=state==="death", enter=state==="spawn"||state==="phase";
    const visibility=enter?ease.outCubic(phase):exit?1-ease.inQuad(phase):1;
    const attack=state.startsWith("attack"),side=o.facing==="left"?-1:1,scale=spec.scale*(kind==="boss"?1.9:1);
    const shift=(state==="hurt"?3:attack?(state==="attack-heavy"?8:4):0)*Math.sin(phase*Math.PI)*side;
    const depth=state==="sleep"?4:0;
    const flying=["bird","bat","bee","dragon","insect","ghost"].includes(spec.family);
    groundShadow(p,shift,flying?2:0,Math.min(21,12*scale)*(flying?.86:1),flying?2.7:3.8,visibility*(flying?.58:.85));
    const layer=layers[kind], L=layer.f.w;
    drawCreature(new Scaled(layer.begin(-L/2,-L+12),scale),spec,id,C,{phase,state,facing:o.facing,tails});
    // a creature drawn big gets fills to match: 1 px material detail in every slab, so it has the texel density
    // of the small sprites round it
    detailSlabs(layer.f,materialOf(spec),{min:kind==="boss"?36:scale>=1.1?56:80,seed:o.seed});
    const bounds=Math.min(L/2,size[0]/2)-1;
    p.shade(-bounds,-origin[1]+1,bounds,10,(x,y,v)=>{
      const color=layer.get(x-shift,y-depth);
      v.a=visibility;
      return state==="hurt"&&phase<0.23&&color?C[4]:color;
    });
    if(["stunned","phase","reward"].includes(state))for(let i=0;i<3;i++){
      const a=TAU*(phase+i/3);
      twinkle(p,Math.cos(a)*14*scale,Math.min(-12,-25*scale)+Math.sin(a)*3,
        2.1+rand(i,7,o.seed),GOLD[3],GOLD[4]);
    }
    if(attack&&phase>0.28&&phase<0.58){
      const u=(phase-0.28)/0.3;
      if(state==="attack-ranged")p.ellipse(side*(17+19*u),-11,4,3,C[4],1-u);
      else p.arc(shift,-10,Math.min(23,11*scale+9*u),2,-1.2,1.2,C[4],1-u);
    }
  }
  return {meta,draw};
}
