// The cast: ready-made looks for src/fx/_kit/person.js (and the portraits), all original. Every color is a ramp,
// dark to light. A look's fields:
//   skin, hair, top, top2 (overalls, vest, jacket, apron trim), pants, shoes: ramps
//   hairStyle  short | messy | spiky | curly | long | wavy | braid | bun | ponytail | pigtails | bald
//   wear       tee | overalls | vest | jacket | apron | dress | robe | tank | sweater   (skirt: true puts an apron on a skirt)
//   hat        straw | sunhat | cowboy | cap | flatcap | beanie | bandana | witch | chef | bow | headband | goggles
//   hatColor, bandColor, flower, scarf, beard (full | mustache | stubble), beardColor, glasses, eyes, small

const SKIN = {
  fair: ["#a8604a", "#e8a07a", "#ffd0aa"],
  light: ["#9a5440", "#d98e64", "#f4bc8c"],
  tan: ["#7a4430", "#c07a52", "#e6a676"],
  brown: ["#5a3020", "#9a5a3a", "#c88458"],
  deep: ["#3e2016", "#6e3e28", "#9a5e3c"],
};
const HAIR = {
  brown: ["#3a2014", "#6a3a1e", "#9a5a2c"],
  chestnut: ["#4a1e10", "#8a3a1a", "#c4622c"],
  black: ["#14121c", "#2a2836", "#4a4660"],
  blond: ["#8a6020", "#d0a040", "#f4d878"],
  ginger: ["#7a2a10", "#d0582a", "#f4904a"],
  grey: ["#5e5a68", "#a29eaa", "#e2dee8"],
  white: ["#9a96a8", "#d4d0de", "#ffffff"],
  purple: ["#3a1e5a", "#6a3ea0", "#a070d8"],
  pink: ["#a03a6a", "#e070a0", "#ffb0d0"],
  blue: ["#1e2e7a", "#3a5ad0", "#78a0f4"],
  silver: ["#6a6e88", "#b0b4cc", "#eceef8"],
};
const STRAW = ["#9a6a1e", "#d8a440", "#f4d07a"], DENIM = ["#1e2c5a", "#34509a", "#5a7cc8"], BOOT = ["#2a1810", "#4a2e1e", "#6e4630"];

export const CAST = {
  // the farmer: straw hat, overalls over a cream shirt
  farmer: { skin: SKIN.light, hair: HAIR.brown, hairStyle: "messy", wear: "overalls", top: ["#a8906a", "#e4d2aa", "#fff2d4"], top2: DENIM, pants: DENIM, shoes: BOOT, hat: "straw", hatColor: STRAW, bandColor: ["#6a3a1a", "#8a4e24", "#a86030"] },
  // a farm girl: red bandana, long brown hair, overalls
  rosa: { skin: SKIN.fair, hair: HAIR.chestnut, hairStyle: "long", wear: "overalls", top: ["#c8b490", "#f0e4c8", "#fff8ea"], top2: DENIM, pants: DENIM, shoes: BOOT, hat: "bandana", hatColor: ["#7a1818", "#c42e2a", "#f05a48"] },
  // an old farmer: straw hat, a white beard
  grandpa: { skin: SKIN.light, hair: HAIR.white, hairStyle: "short", beard: "full", beardColor: HAIR.white, wear: "overalls", top: ["#7a3a24", "#a85a34", "#d08048"], top2: DENIM, pants: DENIM, shoes: BOOT, hat: "straw", hatColor: STRAW, bandColor: ["#4a2a14", "#6a3a1e", "#8a4e24"] },
  // a grandma: grey bun, round glasses, an apron over a brown dress
  nana: { skin: SKIN.fair, hair: HAIR.grey, hairStyle: "bun", glasses: true, glassesColor: "#6a4a2a", wear: "apron", skirt: true, top: ["#4a2416", "#7a3e24", "#a45a34"], top2: ["#c8b490", "#f0e4c8", "#fffaf0"], pants: ["#4a2416", "#7a3e24", "#a45a34"], shoes: BOOT },
  // a bookish lad: black messy hair, glasses, a brown vest
  theo: { skin: SKIN.light, hair: HAIR.black, hairStyle: "messy", glasses: true, wear: "vest", top: ["#b4a684", "#e8dcbc", "#fff6e0"], top2: ["#2e1e16", "#4a3022", "#6a4630"], pants: ["#2a2430", "#3e3646", "#5a5064"], shoes: BOOT },
  // a florist: ginger braid with a flower, a green dress
  fern: { eyes: ["#143a1a", "#2a7030", "#5aa850"], skin: SKIN.fair, hair: HAIR.ginger, hairStyle: "braid", flower: ["#a86a10", "#fff0d8", "#ffffff"], wear: "dress", top: ["#2a5a2a", "#3e8a3a", "#6ab45a"], pants: ["#2a5a2a", "#3e8a3a", "#6ab45a"], shoes: BOOT, hatColor: ["#a86a10", "#f0b020", "#ffe070"] },
  // a fair-haired lad in a vest
  arlo: { skin: SKIN.light, hair: HAIR.blond, hairStyle: "messy", wear: "vest", top: ["#b4a684", "#e8dcbc", "#fff6e0"], top2: ["#3a2414", "#5a3a20", "#7a5230"], pants: ["#3a2a20", "#56402e", "#765a42"], shoes: BOOT },
  // a witch: wavy purple hair, a pointed hat, a dark robe
  wisteria: { eyes: ["#2a1450", "#5a2ea0", "#9a6ae0"], skin: SKIN.fair, hair: HAIR.purple, hairStyle: "wavy", wear: "robe", top: ["#1e1830", "#30284a", "#4a3e6a"], top2: ["#a07a1e", "#e0b040", "#ffe080"], pants: ["#1e1830", "#30284a", "#4a3e6a"], shoes: BOOT, hat: "witch", hatColor: ["#22183e", "#3e2e6a", "#5e4a96"] },
  // a woodsman: a full brown beard, a tank top under dark overalls
  bram: { skin: SKIN.tan, hair: HAIR.brown, hairStyle: "messy", beard: "full", beardColor: HAIR.brown, wear: "overalls", top: ["#7a4430", "#c07a52", "#e6a676"], top2: ["#2a2430", "#3e3646", "#5a5064"], pants: ["#2a2430", "#3e3646", "#5a5064"], shoes: BOOT },
  // a baker: a chef's hat, an apron
  clove: { skin: SKIN.fair, hair: HAIR.brown, hairStyle: "bun", wear: "apron", top: ["#c8c0b8", "#f0ece6", "#ffffff"], top2: ["#a83a2a", "#e05a40", "#ff8a6a"], pants: ["#3a2e2a", "#56463e", "#76625a"], shoes: BOOT, hat: "chef" },
  // a wanderer: a green flat cap, a scarf, a brown jacket
  rowan: { eyes: ["#1e3a1e", "#3a6a3a", "#6a9a5a"], skin: SKIN.light, hair: HAIR.brown, hairStyle: "short", wear: "jacket", top: ["#6a5a2a", "#a08a40", "#c8b060"], top2: ["#4a2a18", "#6e4026", "#946038"], pants: ["#2a3020", "#3e4630", "#5a6444"], shoes: BOOT, hat: "flatcap", hatColor: ["#2a4a1e", "#3e6e2a", "#62983e"], scarf: ["#3a6a1e", "#5a9a2a", "#8acc4a"] },
  // a pink-haired girl with a bow, a blouse under denim
  pip: { eyes: ["#5a1a3a", "#a03a6a", "#e070a0"], skin: SKIN.fair, hair: HAIR.pink, hairStyle: "wavy", wear: "overalls", top: ["#c8a0a8", "#f4dce0", "#ffffff"], top2: ["#2a4a8a", "#4070c0", "#6a9ae8"], pants: ["#2a4a8a", "#4070c0", "#6a9ae8"], shoes: ["#5a1a2a", "#a03040", "#d05060"], hat: "bow", hatColor: ["#8a1a2a", "#d83a4a", "#ff6a70"] },
  // a tinkerer: goggles up, an orange scarf, olive overalls
  cog: { eyes: ["#3a2a10", "#7a5a20", "#b08a3a"], skin: SKIN.light, hair: HAIR.chestnut, hairStyle: "spiky", wear: "overalls", top: ["#8a4a10", "#d07a20", "#f4a040"], top2: ["#3a4220", "#56602e", "#768444"], pants: ["#3a4220", "#56602e", "#768444"], shoes: BOOT, hat: "goggles", hatColor: ["#4a3020", "#6a4630", "#8a6040"], scarf: ["#9a3a10", "#e0621e", "#ff9a4a"] },
  // a fisher girl: long blue hair, a flower, a white blouse and blue skirt
  marina: { eyes: ["#14205a", "#2a50b0", "#5a90e8"], skin: SKIN.fair, hair: HAIR.blue, hairStyle: "wavy", flower: ["#d86a9a", "#fff0f6", "#ffffff"], wear: "dress", top: ["#9aa8d8", "#d8e2fa", "#ffffff"], pants: ["#9aa8d8", "#d8e2fa", "#ffffff"], shoes: ["#2a2a5a", "#3e3e86", "#5a5ab0"] },
  // a quiet mage: silver hair, a purple scarf and robe
  ash: { eyes: ["#2a2440", "#5a5080", "#9088b8"], skin: SKIN.fair, hair: HAIR.silver, hairStyle: "messy", wear: "robe", top: ["#2a2036", "#40324e", "#5a4a6a"], top2: ["#6a3e9a", "#9a64d0", "#c896f4"], pants: ["#2a2036", "#40324e", "#5a4a6a"], shoes: BOOT, scarf: ["#4a2a6a", "#7044a0", "#9a6ad0"] },
  // a rancher: a cowboy hat, stubble, a leather jacket
  wade: { skin: SKIN.tan, hair: HAIR.brown, hairStyle: "short", beard: "stubble", wear: "jacket", top: ["#2a3a5a", "#3e5480", "#5a78a8"], top2: ["#5a2e14", "#8a4a22", "#b46a34"], pants: DENIM, shoes: BOOT, hat: "cowboy", hatColor: ["#3a2616", "#5e3e24", "#86603a"], bandColor: ["#a07a3a", "#c89a4a", "#e8c070"] },
  // a ponytailed girl: black hair, a red vest
  suki: { skin: SKIN.light, hair: HAIR.black, hairStyle: "ponytail", wear: "vest", top: ["#c8b8a0", "#f4ead8", "#fffaf0"], top2: ["#7a1a1a", "#b82e2a", "#e04a3e"], pants: ["#2a2430", "#3e3646", "#5a5064"], shoes: BOOT, hatColor: ["#7a1a1a", "#d83a3a", "#ff6a5a"] },
  // a gardener: a sunhat with a sunflower, green overalls
  sunny: { eyes: ["#1a3a1a", "#3a7a2a", "#6ab04a"], skin: SKIN.fair, hair: HAIR.blond, hairStyle: "long", wear: "overalls", top: ["#c8b490", "#f0e4c8", "#fff8ea"], top2: ["#2a5a2a", "#3e8a3a", "#6ab45a"], pants: ["#2a5a2a", "#3e8a3a", "#6ab45a"], shoes: BOOT, hat: "sunhat", hatColor: STRAW, bandColor: ["#2a5a2a", "#3e8a3a", "#6ab45a"], flower: ["#7a3a10", "#ffc820", "#fff0a0"] },
  // a runner: curly hair, a headband, a tank top
  kofi: { skin: SKIN.deep, hair: HAIR.black, hairStyle: "curly", wear: "tank", top: ["#2a3a7a", "#3e56b0", "#6080e0"], pants: DENIM, shoes: ["#5a5a6a", "#a0a0b0", "#e0e0ec"], hat: "headband", hatColor: ["#2a3a7a", "#3e56b0", "#6080e0"] },
  // a botanist: a white bucket hat, glasses, a braid
  ivy: { skin: SKIN.light, hair: HAIR.brown, hairStyle: "braid", glasses: true, glassesColor: "#4a2a1a", wear: "vest", top: ["#c8b490", "#f0e4c8", "#fff8ea"], top2: ["#2a4a2a", "#3e6a3a", "#5a8e50"], pants: ["#4a3a2a", "#6a5440", "#8e7458"], shoes: BOOT, hat: "cap", hatColor: ["#b4b4a4", "#e8e8dc", "#ffffff"] },
};
