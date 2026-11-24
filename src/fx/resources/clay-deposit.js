import { deposit } from "../_kit/resource-stone.js";
import { groundShadow } from "../_kit/sprite.js";

export const { meta, draw } = deposit("Clay deposit", "A low red-brown clay mound with a smooth cut face and drying cracks.",
  ["#50343b","#78443e","#a35c46","#cb805d","#e5a581"], (p, _phase, C) => {
    groundShadow(p, 0, -1, 13, 3.5);
    p.poly([[-13,-3],[-11,-7],[-7,-10],[3,-12],[10,-9],[13,-4],[9,0],[-8,0]], C[0]);
    p.poly([[-11,-5],[-7,-9],[3,-11],[9,-8],[11,-5],[6,-4],[-4,-4]], C[3]);
    p.poly([[-12,-4],[-4,-4],[6,-4],[12,-5],[9,-1],[-7,-1]], C[2]);
    p.line(-6,-9,0,-10,C[4]);
    p.polyline([[-3,-9],[-2,-7],[-4,-5],[-3,-4]], C[1]);
    p.polyline([[6,-9],[4,-7],[7,-6]], C[1]);
    p.line(-8,-3,-2,-3,C[1]);
    p.line(4,-2,8,-3,C[1]);
  });
