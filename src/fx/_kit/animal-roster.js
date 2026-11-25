import { roster, worldCreature } from "./world-creatures.js";

const species=roster(`
bird red 0.84 rooster
bird amber 0.55 chick
beast wood 0.73 calf
beast bone 0.75 lamb
beast pink 0.68 piglet
bird amber 0.6 duckling
bird dark 1 turkey
bird bone 0.9 goose
beast stone 1 donkey
beast wood 1.02 deer
beast fire 0.92 fox
beast amber 0.61 squirrel
beast dark 0.78 raccoon
beast green 0.67 turtle
crab fire 0.78 crab
snail amber 0.6 snail
insect blue 0.64 dragonfly
insect red 0.49 ladybug
bird wood 0.88 owl
bird wood 1.1 eagle
bird green 0.91 parrot
bird stone 0.76 penguin
insect lightning 0.52 firefly
fish amber 0.9 koi-fish
fish pink 0.86 salmon
fish blue 1.1 tuna
fish amber 0.7 pufferfish
jelly ghost 0.84 jellyfish
octopus red 0.81 octopus
crab dark 0.93 lobster
`);
export const animalSprite=id=>worldCreature(id,"animal",species[id]);
