# Catalog

8 effects in 4 categories. Every one is a file in
`src/fx/<category>/<name>.js`; render any of them with `node tools/render.mjs <id> --gif`.

## characters

farmers and villagers, walking and idle in four facings.

| effect | id | | size | what it does |
|---|---|---|---|---|
| Elder | `characters/elder` | loop 1.6s | 112×48 | An old man with a white beard and a flat cap, top-down 3/4, about 16 x 28 px. Walks or stands in four facings; facing 'all' shows them side by side. |
| Farmer | `characters/farmer` | loop 1.6s | 112×48 | A farmer in a straw hat and overalls, top-down 3/4, about 16 x 28 px. Walks or stands in four facings; facing 'all' shows them side by side. |
| Kid | `characters/kid` | loop 1.6s | 112×48 | A small kid in a red cap and a yellow tee, top-down 3/4, about 16 x 28 px. Walks or stands in four facings; facing 'all' shows them side by side. |
| Villager | `characters/villager` | loop 1.6s | 112×48 | A villager with long red hair and a green dress, top-down 3/4, about 16 x 28 px. Walks or stands in four facings; facing 'all' shows them side by side. |

## farming

hoeing, watering, sowing, harvesting, done by a farmer in four facings.

| effect | id | | size | what it does |
|---|---|---|---|---|
| Hoe | `farming/hoe` | one-shot 1.8s | 120×80 | Side-facing, top-down 3/4: the farmer heaves a hoe overhead and chops it in; clods fly and bounce, dust rolls, and a patch of tilled soil opens as he drags it back. |
| Water | `farming/water` | one-shot 2.2s | 120×80 | Side-facing, top-down 3/4: the farmer tips a watering can; drops arc from the rose and splash across the ground, and a dark wet patch spreads and glistens. |

## crops

seed to sprout to ripe, swaying in the wind.

| effect | id | | size | what it does |
|---|---|---|---|---|
| Carrot | `crops/carrot` | loop 4.8s | 32×48 | One tile of tilled soil, top-down 3/4: seed, sprout, feathery fronds, an orange shoulder swelling out, a ripe twinkle, pulled up in a spray of soil. stage 0..4 holds one. |

## animals

chickens, cows, sheep, pigs, ducks going about their day.

| effect | id | | size | what it does |
|---|---|---|---|---|
| Chicken | `animals/chicken` | loop 3.2s | 48×48 | A hen, side-facing (flip for left), top-down 3/4: three grains land around her feet, she pecks each up, flaps, drops a feather, jerks her head about and blinks. |
