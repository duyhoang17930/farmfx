import { ramp } from "../../core/index.js";
import { asset } from "./art.js";

const directions = {
  north: [0,-1], east: [1,0], south: [0,1], west: [-1,0],
};
const belt = ["#2a3344","#425062","#626e7b","#8e9da2","#c3ceba"];
const rails = ramp(["#63504e","#c08855","#f4c383"]);

// Ports describe how material moves relative to the tile's facing.
function beltPorts(kind, turn) {
  switch (kind) {
    case "belt": return [[0,-1,-1],[0,1,1]];
    case "corner": return [[0,-1,-1],[turn === "left" ? -1 : 1,0,1]];
    case "splitter": return [[0,-1,-1],[-1,0,1],[1,0,1]];
    case "merger": return [[-1,0,-1],[1,0,-1],[0,1,1]];
  }
}

function conveyor(kind, name, desc, facing) {
  return asset({
    name, desc, tags: ["machine", "conveyor", "transport"], size: [16,16], origin: [8,12],
    duration: 2, fps: 12, palette: belt,
    options: { facing, ...(kind==="corner" ? {turn:"right"} : {}), active:true },
  }, (p, phase, C, o)=>{
    const [fx,fy] = Object.hasOwn(directions,o.facing) ? directions[o.facing] : directions.east;
    const ports = beltPorts(kind,o.turn);
    const scroll = o.active ? Math.floor(phase*16) : 0;
    for (let y=0;y<16;y++) {
      for (let x=0;x<16;x++) {
        const dx=x-7.5, dy=y-7.5;
        const u=dx*fx+dy*fy, v=-dx*fy+dy*fx;
        const central = Math.abs(u)<4 && Math.abs(v)<4;
        let best = -1, color = central ? C[2] : 0;
        for (const [a,b,out] of ports) {
          const along = v*a+u*b;
          const across = u*a-v*b;
          const distance = Math.abs(across);
          if (along<0 || along<=best || distance>=6) continue;
          best = along;
          const track = Math.floor(out*along)-scroll;
          if (central && distance>=4) continue;
          if (!central && distance>=5) {
            color = C[0];
          } else if (!central && distance>=4) {
            const lit = across * (a * (fx + fy) + b * (fy - fx)) < 0;
            color = rails[lit ? (Math.floor(along)%4===1 ? 2 : 1) : 0];
          } else {
            const groove = track&3;
            const highlight = distance<2 && groove===3-Math.floor(distance);
            color = C[groove===0 ? 1 : highlight ? 4 : 2];
            if (distance>=3) color=C[groove===1?3:1];
          }
        }
        if (!color && Math.abs(u)<6 && Math.abs(v)<6) color = Math.abs(u)<5 && Math.abs(v)<5 ? rails[0] : C[0];
        if (color) p.px(x-8,y-12,color);
      }
    }
  });
}

export const conveyorBelt = conveyor("belt","Conveyor belt","A straight 16 px roller belt with traveling link highlights.","east");
export const conveyorCorner = conveyor("corner","Conveyor corner","A quarter-turn belt with interchangeable left and right bends.","north");
export const conveyorSplitter = conveyor("splitter","Conveyor splitter","A T-shaped belt splits the rear feed into two side outlets.","north");
export const conveyorMerger = conveyor("merger","Conveyor merger","A T-shaped belt joins both side feeds into the forward outlet.","north");
