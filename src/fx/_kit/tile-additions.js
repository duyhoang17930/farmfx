import { terrain } from "./world-terrain.js";
const pairs={
  "grass-to-dirt":["grassland","desert"],"grass-to-sand":["grassland","sand"],
  "grass-to-stone":["grassland","rock"],"grass-to-snow":["grassland","snowland"],
  "dirt-to-stone":["desert","rock"],"snow-to-ice":["snowland","ice"],
};
const styles={wooden:"wood",rope:"wood",stone:"rock",brick:"volcanic",marble:"snowland",metal:"rock",iron:"rock",crystal:"crystal"};
export function newTile(id){
  if(Object.hasOwn(pairs,id))return terrain(id,"blend",...pairs[id]);
  const [a,b]=id.split("-");
  if(id==="sand-to-water")return terrain(id,"shore","sand","water");
  if(id.includes("cliff"))return terrain(id,"cliff","grassland");
  if(a==="river")return terrain(id,"river","water",b==="mouth"?"sand":"grassland");
  if(a==="pond"||a==="island"&&b!=="shadow"||a==="farmland")return terrain(id,"shore",a==="farmland"?"desert":"grassland",a==="farmland"?"grassland":"water");
  if(a==="island")return terrain(id,"shadow","water");
  if(b==="water"||b==="wave")return terrain(id,b==="wave"?"wave":"water",a==="shallow"?"tropical":a==="deep"?"ice":"water");
  const kind=b==="dock"?"bridge":b;
  return terrain(id,kind,styles[a],undefined,a==="wooden"?0:a==="brick"?1:2);
}
