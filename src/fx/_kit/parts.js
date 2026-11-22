// Hand-drawn pixel parts for the people kit (src/fx/_kit/person.js), facing down (d), up (u) and right (s, side;
// left is the mirror). Each part is { x, y, rows }: rows of characters, the first one's top-left pixel at local (x, y),
// feet at y = 0. The composer stacks the parts and colors every character from the person's look:
//
//   .  nothing            o  ink                 x y z  skin, dark to light
//   1 2 3 4  hair, dark to shine                 E  eye   W  eye shine   R  blush   M  mouth
//   a b c  top (shirt), dark to light            u v w  top2 (overalls, vest, apron), dark to light
//   p q r  pants, dark to light                  s t    shoes, dark and light
//   5 6 7 8 9  hat, dark to shine     n  hat band     G  gold     +  white    *  glass blue    g  glasses frame
//   A C H  beard, dark to light       i j k  scarf, dark to light            F f  flower petal and middle
//
// Proportions, 1.5 tiles tall: head rows -20..-9 (hair to -22, hats above), torso -9..-4, legs -3..-2, shoes -1.

const P = (x, y, ...rows) => ({ x, y, rows });

export const FACE = {
  d: P(-7, -20,
    "...zzzzzzzz...",
    ".zzzzzzzzzzzz.",
    "zzzzzzzzzzzzzy",
    "zzzzzzzzzzzzzy",
    "zzzzzzzzzzzzyy",
    "zzzzzzzzzzzzyy",
    "zzzoozzzzoozyy",
    "zzzWEzzzzWEzyy",
    "zzzEEzzzzEEzyy",
    "zzRRzzzzzzRRyy",
    ".zzzzzMMzzzzy.",
    "..yyyyyyyyyy.."),
  u: P(-7, -20,
    "...zzzzzzzz...",
    ".zzzzzzzzzzzz.",
    "zzzzzzzzzzzzzy",
    "zzzzzzzzzzzzzy",
    "zzzzzzzzzzzzyy",
    "zzzzzzzzzzzzyy",
    "zzzzzzzzzzzzyy",
    "zzzzzzzzzzzzyy",
    "yzzzzzzzzzzzyy",
    "yyzzzzzzzzzyyy",
    ".yyyyyyyyyyyy.",
    "..xxxxxxxxxx.."),
  s: P(-7, -20,
    "...zzzzzzzz...",
    ".zzzzzzzzzzz..",
    "zzzzzzzzzzzzz.",
    "zzzzzzzzzzzzz.",
    "zzzzzzzzzzzzzz",
    "zzzzzzzzzzzzzz",
    "zzzzzzzzzoozzz",
    "zzzzzzzzzWEzzz",
    "zzzzzzzzzEEzzz",
    "yzzzzzzzRRzzz.",
    ".yzzzzzzzzzMz.",
    "..yyyyyyyyyy.."),
};
/** Which face rows hold the eyes: the lid, the shine row, the bottom row (for blinking). */
export const EYE_ROWS = [6, 7, 8];

// ---- hair: a base cap per style family, extras laid over it
const SHORT = {
  d: P(-8, -22,
    "....22233222....",
    "..222334332222..",
    ".22233443322221.",
    ".22334433222211.",
    "1223333222222211",
    "1222222222222211",
    "122.22.222.2.211",
    "12...2....2...21",
    ".1............1.",
    ".1............1."),
  u: P(-8, -22,
    "....22233222....",
    "..222334332222..",
    ".22233443322221.",
    ".22333333222211.",
    "1223232222222211",
    "1222322222222211",
    "1222222222222211",
    "1222122222122211",
    ".12221222212221.",
    ".11222222222211.",
    "..112222222211..",
    "....11111111...."),
  s: P(-8, -22,
    ".....2223322....",
    "...22233433222..",
    "..2223344332222.",
    ".222333443322221",
    ".222333322222221",
    "1222222222222221",
    "12222222222.22.1",
    "1222222.2...2...",
    ".122222.........",
    ".12222yx........",
    ".1222.zy........",
    "..11............"),
};
const BALD = {
  d: P(-8, -17, "12............21", "12............21", "122..........221", ".1............1."),
  u: P(-8, -16, "1222222222222221", "1222222222222221", ".12222222222221.", "..112222222211.."),
  s: P(-8, -17, "12222...........", "122222..........", "12222yx.........", ".122.zy.........", "..11............"),
};
export const HAIR = {
  short: { base: SHORT },
  messy: {
    base: SHORT,
    over: {
      d: P(-9, -24, "....1....1...1....", "...22...22..22....", "..................", "..................", "..................", "2................2", "12..............21", "..................", "1................1"),
      u: P(-9, -24, "....1....1...1....", "...22...22..22....", "..................", "..................", "..................", "2................2", "12..............21", "..................", "1................1"),
      s: P(-9, -24, "......1...1..1....", ".....22..22.22....", "..................", "..................", "2.................", "12................", "..................", "1................."),
    },
  },
  spiky: {
    base: SHORT,
    over: {
      d: P(-8, -26, "..2....2....2...", "..22..232..22...", ".222.23332.222..", ".22323333222222."),
      u: P(-8, -26, "..2....2....2...", "..22..232..22...", ".222.23332.222..", ".22323333222222."),
      s: P(-8, -26, "...2....2....2..", "..22..232..22...", ".222.23332.222..", ".22323333222222."),
    },
  },
  curly: {
    base: SHORT,
    over: {
      d: P(-9, -24, "....22..22..22....", "...2332.233.2332..", "..................", "2................2", "22..............22", "2................2", "22..............22", "2................2"),
      u: P(-9, -24, "....22..22..22....", "...2332.233.2332..", "..................", "2................2", "22..............22", "2................2", "22..............22", "2................2"),
      s: P(-9, -24, "....22..22..22....", "...2332.233.2332..", "..................", "2.................", "22................", "2.................", "22................", "2................."),
    },
  },
  long: {
    base: SHORT,
    back: {
      d: P(-9, -16, "11..............11", "122............221", "122............221", "1222..........2221", "1222..........2221", "1222..........2221", "1222..........2221", ".122..........221.", ".122..........221.", "..12..........21..", "...1..........1..."),
      s: P(-9, -14, "12222..", "122222.", "122222.", "122222.", ".12222.", ".1222..", "..122..", "...1..."),
    },
    // locks falling over the shoulders in front; seen from behind, the hair covers the back
    front: {
      d: P(-9, -14, "122............221", "122............221", "1222..........2221", ".122..........221.", ".122..........221.", ".122..........221.", "..12..........21..", "..12..........21..", "...1..........1..."),
      s: P(-7, -13, "1222.", "1222.", ".122.", ".122.", ".12..", "..1.."),
      u: P(-8, -12, "1222222222222221", "1222322222222221", "1222222222232221", "1222222222222221", ".12222222222221.", ".12223222222221.", "..122222222221..", "...1222222221...", "....11111111....") },
  },
  braid: {
    base: SHORT,
    over: {
      d: P(5, -12, "23", "31", "23", "31", "23", "31", "n."),
      u: P(-1, -12, "23", "31", "23", "31", "23", "31", "n."),
      s: P(-9, -12, "23", "31", "23", "31", "23", "31", "n."),
    },
  },
  bun: {
    base: SHORT,
    over: {
      d: P(-3, -26, ".2332.", "233432", "223322", ".1221."),
      u: P(-3, -26, ".2332.", "233332", "223322", ".1221."),
      s: P(-5, -26, ".2332.", "233432", "223322", ".1221."),
    },
  },
  ponytail: {
    base: SHORT,
    over: {
      d: P(7, -18, "n.", "12", "22", "12", "1."),
      u: P(-1, -13, "nn", "22", "23", "22", "12", "1."),
      s: P(-11, -19, "..n.", ".122", "1222", "1222", "122.", "12..", ".1.."),
    },
  },
  pigtails: {
    base: SHORT,
    over: {
      d: P(-11, -17, "n..............n", "12............21", "122..........221", "122..........221", "12............21", ".1............1."),
      u: P(-11, -17, "n..............n", "12............21", "122..........221", "122..........221", "12............21", ".1............1."),
      s: P(-11, -17, "n...", "12..", "122.", "122.", "12..", ".1.."),
    },
  },
  bald: { base: BALD, shine: true },
};
HAIR.wavy = HAIR.long;

// ---- hats
const STRAW = {
  d: P(-10, -26,
    ".......777777.......",
    ".....77888877766....",
    "....7788877777666...",
    "....nnnnnnnnnnnnn...",
    ".67777778877777766..",
    "6777888888877777776.",
    ".566666666666666665.",
    "..55............55.."),
};
STRAW.u = STRAW.d;
STRAW.s = P(-9, -26, ...STRAW.d.rows);
export const HAT = {
  straw: STRAW,
  sunhat: { ...STRAW, flower: true },
  cowboy: {
    d: P(-10, -26,
      "......5666665.......",
      ".....667787766......",
      ".....6777777765.....",
      ".....nnnnnnnnnn.....",
      "77..6777788776655.77",
      "67777888888777777776",
      ".566666666666666665."),
  },
  cap: {
    d: P(-8, -23, ".....677776.....", "...6778877766...", "..677888777766..", ".67778777777665.", ".66777777777665.", "..555555555555..", "..666666666666.."),
    u: P(-8, -23, ".....677776.....", "...6778877766...", "..677888777766..", ".67778777777665.", ".66777777777665.", ".66777777777765."),
    s: P(-8, -23, ".....677776......", "...6778877766....", "..677888777766...", ".67778777777665..", ".667777777776655.", "..555555555556666", "..............555"),
  },
  flatcap: {
    d: P(-9, -22, "....66777766......", "..667788877766....", ".6778887777777665.", "677777777777777766", "555555555555555555"),
    s: P(-9, -22, "....66777766......", "..667788877766....", ".6778887777777665.", "677777777777777766", ".55555555555555555"),
  },
  beanie: {
    d: P(-8, -25, ".......++.......", "......++++......", "....67777766....", "..677787777766..", ".67777777777766.", ".66777777777766.", ".87878787878787.", ".78787878787878."),
  },
  bandana: {
    d: P(-8, -23, ".....766667.....", "...776+6666766..", "..77666666+6665.", ".776+66666666655", ".67666666+666655", ".55555555555555."),
    u: P(-8, -23, ".....766667.....", "...776+6666766..", "..77666666+6665.", ".776+66666666655", ".67666666+666655", ".5555556655555..", "......6556......", ".....55..55....."),
    s: P(-10, -23, ".......766667.....", ".....776+6666766..", "....77666666+6665.", "...776+66666666655", "6..67666666+666655", "6655555555555555..", ".55..............."),
  },
  witch: {
    d: P(-11, -33,
      ".............55.......",
      "............566.......",
      "...........5666.......",
      "..........56676.......",
      ".........566776.......",
      "........5667776.......",
      ".......56677776.......",
      "......566777766.......",
      ".....5667777766.......",
      ".....GGGGGGGGGGG......",
      "66666777777777777666666",
      ".5666666666666666666665"),
  },
  chef: {
    d: P(-8, -30, "...8.89.898.....", "..89989998998...", ".8999999999998..", ".8999999999997..", ".8999999999997..", "..89999999997...", "..77777777776...", "..88888888887..."),
  },
  bow: { d: P(1, -24, "66...66", "676.676", "6778776", "676.676", "66...66"), u: P(1, -24, "66...66", "676.676", "6778776", "676.676", "66...66"), s: P(-5, -24, "66...66", "676.676", "6778776", "676.676", "66...66") },
  headband: { d: P(-8, -18, "5666666666666665"), u: P(-8, -18, "5666666666666665", ".......55......."), s: P(-8, -18, "5666666666666665") },
  goggles: {
    d: P(-8, -21, "...5555..5555...", "..5*+*5555*+*5..", "5555555555555555"),
    u: P(-8, -19, "5555555555555555"),
    s: P(-8, -21, ".........5555...", "........5*+*5...", "5555555555555555"),
  },
};
for (const h of Object.values(HAT)) (h.u = h.u ?? h.d), (h.s = h.s ?? h.d);

export const GLASSES = {
  d: P(-5, -15, "gggggggggg", "g..g..g..g", "g..g..g..g", ".gg....gg."),
  s: P(-2, -15, "ggggggg", "...g..g", "...g..g", "....gg."),
};

export const BEARD = {
  full: {
    d: P(-6, -12, "A..........A", "AC........CA", "ACCCC..CCCCA", "ACCHCCCCHCCA", ".ACCCHHCCCA.", "..ACCCCCCA..", "...AAAAAA..."),
    s: P(-1, -12, "A.......", "AC......", "ACC..CC.", "ACCCC.CC", "ACCHCCCA", ".ACCCCA.", "..AAAA.."),
  },
  mustache: { d: P(-4, -11, "ACCCCCCA"), s: P(2, -11, "ACCA") },
};

// ---- clothes: the torso (with the pants' top row), the skirt, and the legs
const tee = {
  d: P(-5, -9, ".bccbbbbb.", "bccbbbbbba", "bcbbbbbbba", "bcbbbbbbba", "bbbbbbbbaa", "rqqqqqqqqp"),
  u: P(-5, -9, ".bbbbbbbb.", "bcbbbbbbba", "bbbbbbbbba", "bbbbbbbbba", "bbbbbbbbaa", "rqqqqqqqqp"),
  s: P(-4, -9, ".bccbbb.", "bccbbbba", "bcbbbbba", "bcbbbbba", "bbbbbbaa", "rqqqqqqp"),
};
const vest = {
  d: P(-5, -9, ".vwccbbvv.", "uvwcbbbwvu", "uvvcbbbvvu", "uvvcbbbvvu", "uvvvbbvvvu", "rqqqqqqqqp"),
  u: P(-5, -9, ".vwwvvvvv.", "uvwvvvvvvu", "uvvvvvvvvu", "uvvvvvvvvu", "uvvvvvvvvu", "rqqqqqqqqp"),
  s: P(-4, -9, ".vwvvcb.", "uvwvvcbu", "uvvvvcbu", "uvvvvcbu", "uvvvvvbu", "rqqqqqqp"),
};
export const TORSO = {
  tee, sweater: tee, jacket: vest, vest,
  overalls: {
    d: P(-5, -9, ".bvbbbbvb.", "bcvbbbbvba", "bcGwwwwGba", "bvwwuuwwva", "vwwwvvvvvu", "uvvvvvvvvu"),
    u: P(-5, -9, ".bvbbbbvb.", "bbvbbbbvba", "bbbvbbvbba", "bbbbvvbbba", "vwvvvvvvvu", "uvvvvvvvvu"),
    s: P(-4, -9, ".bbvbbb.", "bcbvbbba", "bcbGwwwa", "bcbwwwva", "vwwvvvvu", "uvvvvvvu"),
  },
  apron: {
    d: P(-5, -9, ".bwbbbbwb.", "bcwbbbbwba", "bcwwwwwwba", "bcwwwwwwba", "bbwwwwwwaa", "bbwwwwwwaa"),
    u: P(-5, -9, ".bbbbbbbb.", "bcbbbbbbba", "bbwwwwwwba", "bbbbbbbbba", "bbbbbbbbaa", "bbbbbbbbaa"),
    s: P(-4, -9, ".bccbbb.", "bccbbbwa", "bcbbbbwa", "bcbbbbwa", "bbbbbbwa", "bbbbbbwa"),
  },
  dress: {
    d: P(-5, -9, ".bccbbbbb.", "bccbbbbbba", "bcbbbbbbba", "bcbbbbbbba", "aaaaaaaaaa", "bcbbbbbbba"),
    u: P(-5, -9, ".bbbbbbbb.", "bcbbbbbbba", "bbbbbbbbba", "bbbbbbbbba", "aaaaaaaaaa", "bbbbbbbbba"),
    s: P(-4, -9, ".bccbbb.", "bccbbbba", "bcbbbbba", "bcbbbbba", "aaaaaaaa", "bcbbbbba"),
  },
  robe: {
    d: P(-5, -9, ".bccwwbbb.", "bccbwwbbba", "bcbbwwbbba", "bcbbwwbbba", "bcbbwwbbba", "bcbbwwbbba"),
    u: P(-5, -9, ".bbbbbbbb.", "bcbbbbbbba", "bbbbbbbbba", "bbbbbbbbba", "bbbbbbbbba", "bbbbbbbbba"),
    s: P(-4, -9, ".bccbbw.", "bccbbbwa", "bcbbbbwa", "bcbbbbwa", "bcbbbbwa", "bcbbbbwa"),
  },
  tank: {
    d: P(-5, -9, ".zbzzzzbz.", "zzbbbbbbzy", "zcbbbbbbay", "zcbbbbbbay", "ybbbbbbbay", "rqqqqqqqqp"),
    u: P(-5, -9, ".zbzzzzbz.", "zzbbbbbbzy", "zbbbbbbbay", "zbbbbbbbay", "ybbbbbbbay", "rqqqqqqqqp"),
    s: P(-4, -9, ".zzbbz..", "zzcbbbzy", "zcbbbbay", "zcbbbbay", "ybbbbbay", "rqqqqqqp"),
  },
};
/** Skirts drawn over the legs, from the waist down. */
export const SKIRT = {
  dress: { d: P(-6, -3, ".bccbbbbbba.", "bccbbbbbbbaa", "bcbbabbabbaa"), s: P(-5, -3, ".bccbbbba.", "bccbbbbbaa", "bcbabbabaa") },
  robe: { d: P(-6, -3, ".bccbwwbbba.", "bccbbwwbbbaa", "bcbbbwwbbbaa"), s: P(-5, -3, ".bccbbbwa.", "bccbbbbwaa", "bcbbbbbwaa") },
  apron: { d: P(-6, -3, ".bcwwwwwwba.", "bcwwwwwwwbaa", "bcbwwwwwwbaa"), s: P(-5, -3, ".bccbbbwa.", "bccbbbbwaa", "bcbbbbbwaa") },
};
for (const s of Object.values(SKIRT)) s.u = s.d;

export const LEGS = {
  d: {
    stand: P(-4, -3, "rqp..rqp", "rqp..rqp", "tts..tts"),
    a: P(-4, -3, "rqp..rqp", "tts..rqp", ".....tts"),
    b: P(-4, -3, "rqp..rqp", "rqp..tts", "tts....."),
  },
  s: {
    stand: P(-4, -3, "..rqqp..", "..rqqp..", "..tttss."),
    a: P(-4, -3, "..rqqp..", ".pqp.rqp", "ss...tts"),
    b: P(-4, -3, "..rqqp..", ".rqp.pqp", "tts...ss"),
  },
};
LEGS.u = LEGS.d;

export const SCARF = {
  d: P(-5, -10, "kjjjjjjjji", "kkjjjjjjji", "......ji..", "......ji..", "......ij.."),
  u: P(-5, -10, "kjjjjjjjji", "kjjjjjjjii"),
  s: P(-4, -10, "kjjjjjji", "kkjjjjji", ".ji.....", ".ji.....", ".ij....."),
};

export const FLOWER = { d: P(3, -21, ".F.", "FfF", ".F."), s: P(-5, -21, ".F.", "FfF", ".F."), sunhat: { d: P(-7, -23, "F.F", ".f.", "F.F"), s: P(-6, -23, "F.F", ".f.", "F.F") } };
