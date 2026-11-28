# Style audit

How farmfx measures itself against [STYLE.md](STYLE.md), and where the style pass started from.

## Tools

| command | what it gives |
|---|---|
| `node tools/audit-style.mjs [ids] [--out DIR] [--strict]` | every asset measured, rules broken, worst first: `audit.md`, `.json`, `.csv` (default `records/style-pass/before/`) |
| `node tools/check.mjs --style` | the same rules as warnings next to the usual checks (`--style=strict`: as failures) |
| `node tools/archipelago-map.mjs --readability` | per sprite: its rim and body against the ground right under it; per island: how busy the floor is (`*.readability.json`) |
| `node tools/archipelago-map.mjs --crops DIR [--crop-scale 3]` | one nearest-neighbour close-up per island |
| `node tools/showcase.mjs [--out DIR] [--scale 4]` | the cast at one scale on the tile grid, and two 320 x 180 game mock-ups with the HUD (dungeon boss fight, farm morning) |

The measurements live in [tools/lib/style-metrics.mjs](../tools/lib/style-metrics.mjs):

| rule | measured as | limit |
|---|---|---|
| fat pixels | color runs across and down: scaled-up art has almost only even runs and no 1 px runs | 1 px runs >= 6% or even runs <= 75% |
| flat slab | biggest region of one flat color | creatures 200 px, other standing things and icons 600 px |
| black outline | silhouette pixels with every channel < 24 | <= 15% |
| thick outline | silhouette step-down that keeps the same tone one more pixel in | average < 1.75 px |
| no outline | share of the silhouette darker than the body behind it | >= 30% (standing things, icons) |
| no contact shadow | translucent pixels in the rows round the ground line | some, for anything standing that does not fly or swim |
| soft alpha | share of neighbouring translucent pixels whose alpha differs by a sliver (< 20 / 255) | <= 12% |
| smooth glow | share of neighbouring lit pixels whose light differs by under 5% | <= 15% |
| repeats / wallpaper | distinct tiles in an 8 x 8 block / spread of the tiles' mean tone | >= 3 / >= 0.6 L* |
| readability (map) | max(rim, body) vs the ground round the sprite, CIE76 delta E | >= 20 |

## Baseline (before the style pass)

1428 assets: 1423 measured, 5 full-screen skipped, 218 break at least one rule.

| rule | assets | notable |
|---|---|---|
| flat slab | 38 | 10 of 15 bosses, cave / dungeon / mine entrances, shields |
| thick outline | 47 | equipment (15), weapons (16), entrances, slime king |
| soft alpha | 62 | building chimney smoke, combat effects, fx/smoke |
| smooth glow | 57 | combat effects, lighting |
| wallpaper | 26 | every big biome ground: grass, snow, sand, crystal, volcanic, dungeon |
| no outline | 13 | pigsty, shrine, temple, crusher, arrows, spear |
| no contact shadow | 12 | conveyor pieces, duck, frog |
| black outline | 11 | damage numbers, ground-crack, ground-slam, rock projectile |
| repeats | 11 | walls, fences, gates (one tile for every position) |
| fat pixels | 4 | transitions, scrollbar (full-screen style, expected) |

Median outline width: items 1.14 px, but weapons 1.66 and equipment 1.83: the bazaar's armoury reads heavier than
the item mats beside it.

Map readability (sprites whose rim and body are both within 15 L* of the ground under them):

| island | floor L* p5..p95 | low-contrast sprites |
|---|---|---|
| Hầm Ngục (dungeon) | 35.7..43.4 | 24 / 60 |
| Núi Lửa (volcano) | 23.7..49.5 | 11 / 23 |
| Nghĩa Địa (graveyard) | 35.5..41.2 | 13 / 33 |
| Chợ Phiên (bazaar) | 40.8..83.9 | 55 / 329 (items on brown mats) |
| Nông Trại (farm) | 37.6..55.1 | 27 / 128 |
| Đảo Pha Lê (crystal) | 48.2..57.1 | 5 / 35 |
| Đảo Tuyết (snow) | 72.2..85.6 | 0 / 27 |

Seen in the close-ups and not yet a numbered rule: island coasts step in whole tiles, the brazier's
`light-flicker` leaves a hard dark box on the volcano, and a boss attack leaves a soft dark ellipse on the floor.

## Progress

| phase | flat slab | thick outline | soft alpha | smooth glow | no outline | black outline | no shadow | wallpaper |
|---|---|---|---|---|---|---|---|---|
| baseline | 37 | 47 | 62 | 57 | 13 | 11 | 12 | 26 |
| 1: pixel scale | 5 | 15 | 62 | 57 | 12 | 11 | 12 | 26 |
| 2: pixel VFX | 5 | 15 | 0 | 0 | 12 | 0 | 12 | 26 |
| 3: outline + shadow | 5 | 13 | 0 | 0 | 8 | 0 | 0 | 26 |
| 4: readability | 4 | 13 | 0 | 0 | 8 | 0 | 0 | 27 |
| 5: terrain | 4 | 13 | 0 | 0 | 8 | 0 | 0 | 9 |

Phase 1 (mixel): `drawScale` on the painter (effects authored at 2x land at 1x with 1 px detail), material detail in
big fills (`_kit/surface-detail.js`: bosses and enemies, buildings, machines, gear), 1 px plate outlines for armor,
helmets, boots, capes, shields, staffs, rings and rock gates, and the bazaar's armoury and tool rack shown as
half-size inventory icons.

Phase 2 (VFX): the painter steps translucency (1/6) and added light (1/16, Bayer-dithered), and lifts any color
under `#161122` to that floor, so smoke, auras, magic circles and glows render as hard bands and dither, and soot
is never flat black. Measured with the smoothness rules above, before the change soft alpha hit 62 assets and
smooth glow 12 (the counts in the baseline row use the older level-count rules). On the map the volcano's dark box
was a square `burnt-ground` patch, now a ragged scorch.

Phase 3 (outline, shadow): `outlineRim()` inks a 1 px colored rim where a sprite has none (buildings, machines,
dungeon and exploration props); the map gives every standing category a contact shadow when the sprite lacks one;
flat, wall-hung, flying and swimming things are exempt. The 8 left without an outline are threads (hooks, bait,
track) and glowing or underwater animals.

Phase 4 (readability): dark floors calmed per biome, creature rim light, lighter lava-stone ramps, the bazaar's mats
replaced by `tiles/display-mat` slate with a name plate per group, and map readability measured as color difference
(delta E) instead of lightness alone. Sprites under delta E 20 from the ground, Phase 3 -> Phase 4:

| island | before | after |
|---|---|---|
| Hầm Ngục (dungeon) | 17 / 60 | 9 / 60 |
| Đầm Lầy (swamp) | 7 / 25 | 1 / 25 |
| Núi Lửa (volcano) | 14 / 23 | 3 / 23 |
| Nghĩa Địa (graveyard) | 10 / 33 | 5 / 33 |
| Đảo Pha Lê (crystal) | 7 / 35 | 7 / 35 |
| Chợ Phiên (bazaar) | 55 / 329 on brown mats (L*) | 32 / 329 |

Phase 5 (terrain): organic coasts (rounded corners, wandering waterline, foam, transparent water side, south bank
face) for both coast families (`terrain()` shores and `exploration/island-shore`), macro tone drift and scattered
decals on every open floor, worn slabs on paved floors, damp hollows in tilled soil, and path tiles with wandering
verges, rounded turns and filleted crossings. The wallpaper rule now compares tiles' mean tone (the median hid
drift on discrete palettes): 22 tiles before, 9 after. The 9 left are the dark floors Phase 4 keeps quiet on
purpose, tilled soil (furrows) and dungeon slabs; the 11 "repeats" are walls, fences and gates.

Phase 6 (presentation): `tools/showcase.mjs` renders the cast sheet (player, villagers, livestock, every enemy and
boss on the 16 px grid, the player repeated beside the bosses for scale) and two game-resolution mock-ups with the
HUD; `--crops` on the archipelago map gives a close-up per island. All enlarged nearest-neighbour from 1x.
