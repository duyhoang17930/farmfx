# farmfx.

**<!-- count -->0<!-- /count --> pixel art assets and animations for farming games, every one a small piece of
code.** Crops that grow from seed to harvest, animals going about their day, tilled and watered soil, weather and
seasons, and a farmer who hoes, waters, sows and harvests. Play them live, recolor them for another season, drop
them into a browser game, or export sprite sheets for any engine.

Built on [pixelfx](https://github.com/patch-gg/pixelfx) by Patch: the same core, tools, gallery and acting
system, with a library made for farms instead of fights.

[catalog](docs/CATALOG.md) · [use one](#use-one) · [farmer actions](#farmer-actions) · [make your own](#make-your-own) ·
[license](#license)

## what's in it.

<!-- catalog -->
| category | effects | some of them |
|---|---|---|
<!-- /catalog -->

Every asset is a file in `src/fx/<category>/<name>.js`. The [catalog](docs/CATALOG.md) lists them all.

## use one.

**In a browser game** (canvas, Phaser, PixiJS, Kaplay, three.js), use the code. No dependencies.

```js
import { createFrame, clearFrame, createFx, composite } from "farmfx";
import * as carrot from "farmfx/fx/crops/carrot";

const frame = createFrame(320, 180);                 // your game's pixel resolution
const img = new ImageData(320, 180);
const fx = createFx(carrot, { x: 160, y: 140 });    // also: flip, seed, palette...

function tick(dt) {
  fx.update(dt);
  clearFrame(frame);
  fx.draw(frame, "back");
  drawCharacters();
  fx.draw(frame, "front");
  composite(frame, img.data, backgroundColor);
  ctx.putImageData(img, 0, 0);                       // scale up with image-rendering: pixelated
}
```

Install from GitHub with `npm i github:duyhoang17930/farmfx`, or copy `src/core` and the assets you want.

**In any engine** (Godot, Unity, GameMaker, Defold, LÖVE, Bevy), use sprite sheets:

```bash
node tools/render.mjs crops/carrot --sheet
```

That writes a transparent PNG of every frame in a grid and an Aseprite-style JSON (frame rects, durations, and
`meta.farmfx` with fps, loop, columns and the pivot). `node tools/sheets.mjs` exports the whole library to `sheets/`.

Any asset takes a `palette`, so a summer field can turn autumn gold without touching its code:

```bash
node tools/render.mjs crops/wheat --gif --opts '{"palette": ["#2a1a08","#5c3a10","#a0701c","#d8a830","#f4d860","#fff4b0"]}'
```

## farmer actions.

The `farming` category is acted out by the stock character from pixelfx: he winds up, swings the hoe, the soil
bursts, he recovers. Swap `createFx` for `createAct` to play the character too:

```js
import { createAct } from "farmfx";
import * as hoe from "farmfx/fx/farming/hoe";

const act = createAct(hoe, { x: 80, y: 140 });
// act.update(dt); act.draw(frame); act.shake gives a little camera shake on contact
```

Got your own farmer sprite? Read the timing from `hoe.act` (or `meta.farmfx.act` in a sprite sheet's JSON) and
start your own animation `windup` seconds before the effect.

## make your own.

```bash
node tools/new.mjs crops/pumpkin         # a working starting point (add --loop for a loop)
node tools/render.mjs crops/pumpkin      # records/crops/pumpkin/contact.png: look at it
node tools/check.mjs crops/pumpkin       # spills, seams, unseeded randomness, slow frames
node tools/index.mjs                     # update the registry, catalog and this README
node tools/serve.mjs                     # the gallery, locally
```

Then go round: look at the contact sheet, fix the worst thing, render again. [docs/AUTHORING.md](docs/AUTHORING.md)
has the contract, the drawing API and the quality bar. `src/fx/_kit/` holds the shared helpers: `creature.js`
(outlined creatures in a grid, springs, hops), `sprite.js` (outlined sprites, shadows, bobs), `weather.js`,
`water.js`, `nature.js` and `ui.js`.

The `farmfx` Claude Code skill in `skills/farmfx` teaches Claude to find, use, export and make assets the same way.
Copy it into `~/.claude/skills/`, or add this repo as a plugin marketplace.

## license.

MIT, code and assets. Use them in anything, commercial included. farmfx is built on pixelfx (MIT, Patch and Hugo
Duprez) and parts adapt Hugo Duprez's MIT effects and Hollow Crown's MIT source: see [NOTICE.md](NOTICE.md).
