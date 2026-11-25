import { roster, worldCreature } from "./world-creatures.js";

const species=roster(`
slime amber 1.12 slime-king
bone bone 1.04 skeleton-king
spider dark 1.08 giant-spider
folk green 1 goblin-king
treant wood 1.08 ancient-tree-guardian
golem stone 1.02 stone-titan
worm amber 1.13 sand-worm-queen
mummy amber 1 desert-pharaoh
golem ice 1.05 ice-giant
dragon ice 1.09 frost-dragon
golem fire 1.13 lava-titan
dragon fire 1.15 fire-dragon
golem crystal 1.14 crystal-golem
wizard ghost 1 dark-wizard
demon red 1.04 ancient-demon
`);
export const bossSprite=id=>worldCreature(id,"boss",species[id]);
