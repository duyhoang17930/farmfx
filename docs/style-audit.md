# Style audit

How farmfx measures itself against [STYLE.md](STYLE.md), and where the style pass started from.

## Tools

| command | what it gives |
|---|---|
| `node tools/audit-style.mjs [ids] [--out DIR] [--strict]` | every asset measured, rules broken, worst first: `audit.md`, `.json`, `.csv` (default `records/style-pass/before/`) |
| `node tools/check.mjs --style` | the same rules as warnings next to the usual checks (`--style=strict`: as failures) |
| `node tools/archipelago-map.mjs --readability` | per sprite: its rim and body against the ground right under it; per island: how busy the floor is (`*.readability.json`) |
| `node tools/archipelago-map.mjs --crops DIR [--crop-scale 3]` | one nearest-neighbour close-up per island |

The measurements live in [tools/lib/style-metrics.mjs](../tools/lib/style-metrics.mjs):

| rule | measured as | limit |
|---|---|---|
| fat pixels | color runs across and down: scaled-up art has almost only even runs and no 1 px runs | 1 px runs >= 6% or even runs <= 75% |
| flat slab | biggest region of one flat color | creatures 200 px, other standing things and icons 600 px |
| black outline | silhouette pixels with every channel < 24 | <= 15% |
| thick outline | silhouette step-down that keeps the same tone one more pixel in | average < 1.75 px |
| no outline | share of the silhouette darker than the body behind it | >= 30% (standing things, icons) |
| no contact shadow | translucent pixels in the rows round the ground line | some, for anything standing that does not fly or swim |
| soft alpha | distinct alpha values in one still | <= 6 |
| smooth glow | distinct light strengths | <= 10 |
| repeats / wallpaper | distinct tiles in an 8 x 8 block / spread of the tiles' mean tone | >= 3 / >= 0.6 L* |
| readability (map) | max(rim, body) vs ground lightness | >= 15 L* |

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
