import { roster, worldCreature } from "./world-creatures.js";

const species=roster(`
slime green 1 green-slime
slime blue 1 blue-slime
slime red 1 red-slime
slime poison 1 poison-slime
slime crystal 1 crystal-slime
bone bone 1 skeleton skeleton-archer
bone stone 1.1 skeleton-knight
folk poison 1.02 zombie
ghost ghost 1 ghost
ghost dark 1.1 dark-spirit
folk green 1 goblin goblin-archer
folk green 1.17 goblin-warrior
bat dark 0.9 bat
bat red 1.02 vampire-bat
spider dark 0.95 spider
spider poison 1 poison-spider
bee amber 0.94 giant-bee
beast wood 1 angry-boar
beast dark 0.94 wolf
beast crystal 1 snow-wolf
worm amber 1 sand-worm
spider amber 1 scorpion
mummy bone 1 mummy
golem stone 1.11 stone-golem
golem ice 1.12 ice-golem
golem fire 1.13 lava-golem
elemental fire 1 fire-elemental
elemental ice 1 ice-elemental
elemental lightning 1 lightning-elemental
mushroom red 1 mushroom-monster
mimic wood 1 mimic-chest
plant green 1 carnivorous-plant
folk poison 1.2 swamp-monster
golem crystal 1 crystal-guardian
golem dark 1 dark-knight
demon red 1.15 demon
dragon fire 1.17 mini-dragon
treant wood 1.2 corrupted-tree
`);
export const enemySprite=id=>worldCreature(id,"enemy",species[id]);
