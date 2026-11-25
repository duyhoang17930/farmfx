import { asset, GOLD, LEAF, RED, STEEL, VIOLET, WATER, WOOD } from "./art.js";
import { icon } from "./farm-ui.js";

const families={
 gathering:[LEAF,{"woodcutting":"wood","mining":"iron-ore","foraging":"berry","gathering-speed":"speed-potion","double-drop":"stone",
   "rare-resource":"diamond","resource-regrowth":"seed","resource-magnet":"magnet-ring"}],
 farming:[WOOD,{"agriculture":"carrot","irrigation":"energy-potion","fertilization":"fertilizer","animal-husbandry":"egg","crop-yield":"wheat",
   "crop-growth":"growth-booster","fishing":"raw-fish","cooking":"soup"}],
 industry:[STEEL,{"crafting":"wood","smelting":"iron-ingot","metallurgy":"steel-ingot","engineering":"gear","electricity":"battery",
   "automation":"mechanical-part","robotics":"motor","mass-production":"metal-plate"}],
 economy:[GOLD,{"commerce":"coin-pouch","bargaining":"paper","banking":"gold-key","coin-production":"items/special/coin",
   "cheaper-land":"treasure-map","cheaper-crafting":"plank","market-expansion":"brick","passive-income":"gold-bar"}],
 combat:[RED,{"sword-mastery":"steel-ingot","archery":"stick","defense":"defense-ring","critical-strike":"ruby","attack-speed":"speed-potion",
   "dodge":"speed-ring","health-boost":"medium-health-potion","regeneration":"antidote"}],
 magic:[VIOLET,{"alchemy":"small-energy-potion","enchanting":"ancient-scroll","fire-magic":"amber","ice-magic":"sapphire","lightning-magic":"fuel-cell",
   "healing-magic":"small-health-potion","teleportation":"teleport-scroll","summoning":"spirit-essence"}],
};
export function skillAsset(path){
  const [group,id]=path.split("/");
  const [palette,icons]=families[group];
  const emblem=icons[id]==="energy-potion"?"small-energy-potion":icons[id];
  return asset({name:id.replaceAll("-"," "),desc:`An inventory-scale emblem for the ${id.replaceAll("-"," ")} skill.`,
    size:[32,32],origin:[16,16],duration:1,fps:1,palette,bg:"dark",tags:["skill",group,id],options:{unlocked:true}},(p,_t,C,o)=>{
    p.poly([[0,-13],[10,-9],[13,0],[10,9],[0,13],[-10,9],[-13,0],[-10,-9]],C[0]);
    p.poly([[0,-11],[9,-7],[11,0],[9,7],[0,11],[-9,7],[-11,0],[-9,-7]],C[1]);
    p.polyline([[-10,-6],[-8,-9],[0,-12],[7,-9]],C[o.unlocked?4:2]);
    p.arc(0,0,9,1,0.1,4.7,C[3]);
    if(o.unlocked){
      icon(p,emblem,0,0,0);
      if(/double|mass|speed|cheaper|passive|yield/.test(id))p.px(7,-6,GOLD[4]);
    }else{
      p.arc(0,-1,4,1.4,Math.PI,Math.PI*2,C[3]);p.rect(-4,-1,9,6,C[2]);p.px(0,2,C[4]);
    }
  });
}
