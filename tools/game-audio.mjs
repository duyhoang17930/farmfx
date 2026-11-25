#!/usr/bin/env node
// Generate the original FarmFX sound effects, room tones, and music loops.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rate=22050, period=2*Math.PI;
const out=resolve(process.argv[2]??fileURLToPath(new URL("../audio/",import.meta.url)));
const soundEffects={
  gathering:`
wood-hit wood 205 .25
tree-fall fall 86 1.45
stone-hit metal 440 .22
stone-break rubble 165 .54
ore-hit metal 780 .32
ore-break rubble 315 .62
crystal-break glass 1250 .65
digging grit 151 .40
item-drop wood 240 .24
item-pickup up 590 .25`,
  farming:`
hoe-hit grit 211 .28
watering splash 180 .76
seed-plant wood 325 .19
crop-harvest swipe 315 .34
animal-feed grit 570 .42
fishing-cast swipe 490 .50
fishing-bite splash 408 .30
fishing-catch up 620 .48`,
  machines:`
furnace-loop furnace 75 2.2
sawmill-loop saw 123 2.25
hammer-metal metal 840 .43
machine-start motor 108 .75
machine-stop stop 165 .58
machine-working saw 86 1.8
electric-hum hum 60 2
crafting-complete up 392 .66`,
  combat:`
sword-swing swipe 670 .23
sword-hit metal 590 .32
arrow-shot swipe 1120 .22
arrow-hit wood 295 .28
shield-block metal 395 .40
critical-hit glass 890 .57
player-hurt down 360 .34
enemy-hurt down 220 .26
enemy-death down 124 .59
explosion boom 56 1.10
magic-cast up 335 .78
boss-roar roar 69 1.36`,
  gameplay:`
footstep-grass grit 187 .17
footstep-dirt wood 120 .18
footstep-stone metal 290 .17
footstep-sand grit 302 .19
footstep-snow grit 460 .24
footstep-wood wood 242 .16
coin-pickup glass 1090 .32
experience-pickup up 798 .26
level-up up 440 .86
skill-unlock up 349 .65
island-unlock up 292 1.06
chest-open motor 310 .47
door-open stop 320 .69
building-placement wood 163 .36
teleport warp 280 .69
achievement up 523 1.12`,
  ui:`
button-click wood 650 .095
button-hover up 670 .105
menu-open up 470 .22
menu-close down 470 .22
item-select glass 730 .12
item-equip metal 1150 .22
item-unequip down 570 .21
notification up 560 .40
success up 658 .43
error down 275 .33`,
};
const environments={
 forest:[7,0.26,104,"birds"],birds:[6,0.07,142,"birds"],ocean:[8,0.62,69,"surf"],river:[6,0.56,190,"water"],
 rain:[6,0.56,280,"rain"],thunder:[8,0.62,28,"thunder"],wind:[7,0.37,105,"gust"],desert:[8,0.42,152,"gust"],
 snowstorm:[7,0.57,150,"gust"],swamp:[8,0.31,85,"frogs"],cave:[7,0.22,52,"drips"],nighttime:[8,0.16,210,"crickets"],
};
// Scale degrees in the melody. Each cue also has a bass line and chord progression.
const tracks={
 "main-menu":[60,96,"major",[0,2,4,5,4,2,1,2,0,4,7,6,4,2,1,0],[0,3,4,0]],
 grassland:[67,110,"major",[0,2,4,2,3,5,4,1,2,4,5,7,4,2,1,0],[0,3,4,0]],
 desert:[57,106,"desert",[0,1,4,3,2,1,0,2,4,5,4,2,3,2,1,0],[0,1,4,0]],
 snowland:[62,79,"minor",[0,4,6,7,5,4,2,1,0,2,3,5,4,1,2,0],[0,5,3,4]],
 graveyard:[50,72,"minor",[0,1,3,2,4,2,1,0,5,4,3,1,3,2,1,0],[0,5,1,4]],
 volcanic:[48,116,"minor",[0,0,3,2,4,2,4,5,6,4,3,0,2,3,1,0],[0,5,4,0]],
 swamp:[55,86,"minor",[0,1,4,3,2,4,5,3,2,1,3,0,1,4,1,0],[0,3,5,4]],
 "crystal-island":[65,91,"major",[0,4,7,5,6,5,4,2,1,2,4,6,7,4,2,0],[0,2,3,4]],
 "tropical-island":[64,112,"major",[0,2,3,4,3,1,2,0,4,5,3,2,1,3,2,0],[0,4,3,0]],
 dungeon:[48,84,"minor",[0,2,1,3,0,3,2,1,4,5,4,6,3,2,1,0],[0,5,3,4]],
 combat:[57,134,"minor",[0,2,4,5,4,2,0,1,3,5,6,5,4,3,1,0],[0,3,4,0]],
 "boss-battle":[46,128,"desert",[0,1,3,4,0,2,3,5,6,5,4,1,3,2,1,0],[0,1,5,4]],
 nighttime:[60,74,"minor",[0,4,6,4,3,2,1,3,4,5,4,2,3,2,1,0],[0,5,3,0]],
 victory:[60,126,"major",[0,2,4,7,6,4,5,4,2,4,7,9,7,6,4,0],[0,3,4,0]],
};

const midi=n=>440*2**((n-69)/12);
const sample=(seconds)=>new Float32Array(Math.round(seconds*rate));
function seedFor(name){return [...name].reduce((seed,c)=>(Math.imul(seed,31)+c.charCodeAt(0))>>>0,137);}
function noiseGenerator(seed){
  return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};
}
function tone(out,start,duration,freq,slide,gain,attack,decay,partials=[1],loop=false){
  const at=Math.floor(start*rate), n=Math.max(1,Math.round(duration*rate));
  for(let i=0;i<n;i++){
    const j=at+i;
    if(!loop&&j>=out.length)break;
    const t=i/rate, u=i/n, taper=Math.min(1,t/attack,(duration-t)/0.028);
    const a=period*(freq*t+(slide-freq)*t*u*.5);
    let v=0;
    for(let h=0;h<partials.length;h++)v+=partials[h]*Math.sin(a*(h+1));
    out[j%out.length]+=v*taper*Math.exp(-decay*u)*gain;
  }
}
function burst(out,seconds,seed,amount,brightness,decay,delay=0){
  const rng=noiseGenerator(seed), start=Math.floor(delay*rate), n=Math.round(seconds*rate);
  let low=0;
  for(let i=0;i<n&&i+start<out.length;i++){
    low+=(rng()-low)*brightness;
    const env=Math.min(1,i/(rate*.004),(n-i)/(rate*.017))*Math.exp(-decay*i/n);
    out[start+i]+=low*amount*env;
  }
}
function room(out,seed,gain,base,brightness){
  const rng=noiseGenerator(seed), harmonics=80, duration=out.length/rate;
  for(let k=0;k<harmonics;k++){
    const freq=base*(1+brightness*k*k/23)+rng()*base*.3;
    const step=Math.max(1,Math.round(freq*duration))*period/out.length;
    const phase=rng()*period, volume=gain/(4+Math.sqrt(k)*5);
    for(let i=0;i<out.length;i++)out[i]+=Math.sin(step*i+phase)*volume;
  }
}
function sfx(name,kind,f,s){
  const out=sample(s), seed=seedFor(name);
  if(kind==="furnace"||kind==="saw"||kind==="hum"){
    room(out,seed,kind==="hum"?.17:.4,f,kind==="saw"?1.15:.18);
    const step=Math.round(f*s)*period/out.length;
    for(let i=0;i<out.length;i++){
      const a=step*i;
      out[i]+=Math.sin(a)*.24+Math.sin(a*3)*.09+(kind==="saw"?Math.sin(a*7)*.09:0);
    }
  }else if(kind==="up"||kind==="down"||kind==="warp"){
    const ratios=kind==="down"?[1,.8,.57]:kind==="warp"?[1,.7,2.4]:[1,1.26,1.5];
    for(const [i,r] of ratios.entries())tone(out,s*i*.19,s*(.53-i*.045),f*r,f*r*(kind==="warp"?1.7:1.01),.5-i*.055,.009,3,[1,.17,.1]);
    if(kind==="warp")burst(out,s*.67,seed,.26,.49,3,s*.1);
  }else if(kind==="metal"||kind==="glass"){
    for(const [i,r] of [1,2.17,3.39,4.72].entries())tone(out,i*.006,s*.91,f*r,f*r*.99,.48/(1+i),.002,2.5+i,[1,.21]);
    burst(out,s*.36,seed,.39,.74,6);
  }else if(kind==="splash"||kind==="rubble"||kind==="fall"){
    for(let i=0;i<4;i++){
      tone(out,s*i*.14,s*.4,f*(1+i*.13),f*.55,.48/(1+i*.25),.005,5,[1,.27]);
      burst(out,s*.36,seed+i*61,.7-i*.1,kind==="splash"?.72:.26,5,s*i*.14);
    }
  }else if(kind==="wood"||kind==="grit"){
    tone(out,0,s*.65,f,f*.42,kind==="wood"?.62:.4,.003,6,[1,.24,.12]);
    burst(out,s*.65,seed,.66,kind==="grit"?.64:.3,5);
  }else{
    const isEngine=kind==="motor"||kind==="stop", isBoom=kind==="boom"||kind==="roar";
    const to=kind==="motor"?f*2.5:kind==="swipe"?f*.4:f*.54;
    tone(out,0,s*.83,f,to,isBoom?.56:.37,isEngine?.06:.008,kind==="roar"?2.5:4,[1,.38,.21,.08]);
    burst(out,s*.83,seed,kind==="swipe"?.85:.65,kind==="swipe"?.79:isBoom?.16:.42,3.5);
  }
  return out;
}
function ambience(name,[s,volume,base,kind]){
  const out=sample(s), seed=seedFor(name), rng=noiseGenerator(seed);
  room(out,seed,volume,base,/surf|gust|thunder/.test(kind)?.19:.76);
  const twitter=/birds|frogs|crickets|drips/.test(kind);
  if(twitter){
    for(let i=0;i<12;i++){
      const start=(rng()*.5+.5)*s, pitch=base*(kind==="birds"?12:kind==="drips"?3:kind==="frogs"?3.5:8)*(1+rng()*.2);
      const length=.09+(rng()*.5+.5)*.27;
      tone(out,start,length,pitch,pitch*(kind==="birds"?1.48:.72),kind==="birds"?.24:.12,.014,3,[1,.15],true);
    }
  }else{
    for(let i=0;i<out.length;i++){
      const u=i/out.length;
      out[i]*=.73+.2*Math.sin(period*u*2)+.09*Math.sin(period*u*5+.7);
    }
    if(kind==="thunder")tone(out,s*.4,s*.52,43,19,.38,.09,2,[1,.48,.13]);
  }
  return out;
}
function music(name,[root,bpm,mode,phrase,chords]){
  const scales={major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10],desert:[0,1,4,5,7,8,10]};
  const scale=scales[mode], beat=60/bpm, half=beat/2, pace=name==="combat"||name==="boss-battle"||name==="volcanic";
  const note=(degree,base=root)=>midi(base+scale[degree%7]+12*Math.floor(degree/7));
  const out=sample(beat*16);
  for(let phraseIndex=0;phraseIndex<2;phraseIndex++){
    const octave=phraseIndex===1&&name==="victory"?12:0;
    for(const [i,degree] of phrase.entries()){
      const f=note(degree,root+octave), duration=half*(i%4===3?1.09:.8);
      tone(out,beat*8*phraseIndex+i*half,duration,f,f*.997,.25,.012,2.8,mode==="desert"?[1,.32,.2]:[1,.12,.12],true);
      if(i%4===1)tone(out,beat*8*phraseIndex+i*half+half*.3,half*.8,f*2,f*2,.048,.014,4,[1],true);
    }
  }
  for(const [bar,chord] of chords.entries()){
    const at=bar*beat*4;
    for(const step of [0,2,4]){
      const f=note(chord+step,root-12);
      tone(out,at+step*beat*.08,beat*3.8,f,f,.082,.12,1.7,[1,.075],true);
    }
    for(const i of [0,2,3]){
      const f=note(chord+(i===3?4:0),root-24);
      tone(out,at+i*beat,beat*.85,f,f,.19,.012,3,[1,.19,.08],true);
    }
    if(pace)for(let i=0;i<4;i++)tone(out,at+i*beat,beat*.27,105,46,.19,.002,5,[1,.12],true);
  }
  return out;
}
function wav(out){
  const file=Buffer.alloc(44+out.length*2);
  file.write("RIFF",0);file.writeUInt32LE(file.length-8,4);file.write("WAVEfmt ",8);
  file.writeUInt32LE(16,16);file.writeUInt16LE(1,20);file.writeUInt16LE(1,22);
  file.writeUInt32LE(rate,24);file.writeUInt32LE(rate*2,28);file.writeUInt16LE(2,32);file.writeUInt16LE(16,34);
  file.write("data",36);file.writeUInt32LE(out.length*2,40);
  const peak=out.reduce((a,b)=>Math.max(a,Math.abs(b)),.025);
  for(let i=0;i<out.length;i++)file.writeInt16LE(Math.round(out[i]*26212/peak),44+i*2);
  return file;
}
const index=[];
function save(group,name,material,loop=false){
  const path=join(out,group,name+".wav");
  mkdirSync(dirname(path),{recursive:true});writeFileSync(path,wav(material));
  index.push({id:group+"/"+name,path:group+"/"+name+".wav",sampleRate:rate,channels:1,seconds:material.length/rate,loop});
}
for(const [group,spec] of Object.entries(soundEffects))for(const line of spec.trim().split(String.fromCharCode(10))){
  const [name,kind,f,s]=line.trim().split(/ +/);
  save(group,name,sfx(name,kind,+f,+s),["hum","saw","furnace"].includes(kind));
}
for(const [name,spec] of Object.entries(environments))save("ambience",name,ambience(name,spec),true);
for(const [name,spec] of Object.entries(tracks))save("music",name,music(name,spec),true);
writeFileSync(join(out,"game-audio.json"),JSON.stringify(index,null,2)+"\n");
console.log(`${index.length} WAV files in ${out}`);
