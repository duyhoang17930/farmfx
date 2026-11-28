# Art direction: top-down 3/4

farmfx draws for **2D top-down farming games seen at a 3/4 angle**: the camera looks down at the ground from above and
a little in front, so the ground is a flat map of tiles, and everything standing on it (crops, trees, animals,
buildings, people) shows its **front and its top** at once. It's the look of the cozy farming-sim genre. Generic
genre conventions are fine; never copy a specific game's sprites, characters, palettes, UI or logos.

## The grid

- **One tile is 16 x 16 px.** Everything is sized in tiles. A crop fills one tile, a bush one, a tree 2 x 3 (trunk on
  one tile, canopy spilling over the ones around it), a chicken about one tile, a cow 2 x 2, a person about 1 wide and
  1.5 tall, a small building 3 x 3 to 5 x 4.
- **The reference body is the player.** `player/idle` inks 13 x 23 px (hat included); the bare stock actor
  (`stockActor()`, k = 1) is 12 x 19. Measure new people, animals and props against it, not against a number in a doc:

  | thing | ink size (px) | in tiles |
  |---|---|---|
  | player, villager (`player/*`, `characters/*`) | 12-13 x 19-25 | 1 x 1.5 |
  | pine, oak | ~30 x 48 | 2 x 3 |
  | cow | ~39 x 30 | 2.5 x 2 |

- **Effects are authored at 2x, placed at 1x.** Effects with `actor: 2` are drawn round a 24 x 38 stock actor, twice
  the world scale, so a spell reads in a preview. In a 1x scene, give them the 2x actor and `drawScale: 0.5`: the
  painter rasterises their shapes again at half size, one screen pixel per pixel (never a resample), so they sit at
  the player's size with 1 px detail. `drawScale` is a placement option like `x`, `y`, `flip`; effects can't use it.
- **Inventory icons are half the hand-held size.** Weapons, equipment and tools are drawn to be held (20-30 px).
  Where they sit beside items (a shop shelf, a bag), draw them at `drawScale: 0.5`, about 12 x 15 px, the size of
  the 10 x 10 item icons.
- **Big means more detail, not bigger blocks.** A sprite drawn bigger (a boss at 1.9x, a cave mouth, a town hall)
  must keep the texel density of the small sprites round it: no area wider than 5 x 5 px of one flat color.
  Creatures get this from `detailSlabs()` (material per family: cracks, grain, scales, facets, bubbles, folds,
  wraps); buildings, machines and gear from `withSurfaceDetail()` (material picked from the fill's color), both in
  `_kit/surface-detail.js`.
- **Canvases are whole tiles**: 16, 32, 48, 64... wide and tall, with room for what pokes out of the footprint (a
  canopy, a raised wing, flying soil).
- **The origin is where the thing stands on the ground**: x in the middle of its footprint, y = 0 where its base meets
  the ground, which sits 4 px above the footprint's front edge. So a one-tile footprint spans x -8..+8 and y -12..+4
  around the origin. For a one-tile crop on a 32 x 48 canvas, `origin: [16, 40]`. Engines line that point up with
  the tile (tile's left edge + 8, top edge + 12).
- **Depth sorts by y.** Anything that stands is drawn so its ground contact is at y = 0 and taller parts go up from
  there; a game draws things in order of their y.

## The view

- **Ground is a plan.** Soil, water, paths, puddles, wet patches and furrows lie flat: they're shapes on the floor,
  seen from above, drawn as tiles or blobs, not as a horizon. There's no floor line, no sky behind the ground.
- **Standing things show front and top.** A box shows its front face and a lighter top face above it; a stump shows
  its rings on top; a crop's leaves are seen from slightly above; a pot shows its rim as an ellipse.
- **Round things on the ground are flattened.** A circle on the floor is an ellipse about twice as wide as it is tall
  (ry = rx / 2): rings, shadows, ripples, splashes, the mound of a crop.
- **Contact shadows, not cast shadows.** Under anything that stands, a soft dark ellipse (about the footprint's width,
  a quarter as tall), darker in the middle. When something jumps, its shadow stays on the ground and shrinks.
- **Animals and people face four ways**: down (towards the camera), up (away), and sideways (draw right, flip for
  left). An asset that only does one direction says so in its `desc` and faces down or right.
- **Things fall towards the bottom of the screen** in screen space, but particles that land do so on the ground near
  where they started, not on a floor line: give each one its own landing y (its own depth).

## Light, color, line

- **Light from the top-left**, always. Tops and left sides catch it, right sides and undersides go one or two steps
  darker.
- **Warm, saturated, friendly colors**, 3 to 5 shades per material, hue-shifted: shadows lean cooler and towards
  purple or blue, highlights warmer and towards yellow. Avoid pure black and pure grey.
- **Colored outlines.** A 1 px outline one or two steps darker than the color it wraps (dark brown round soil and
  wood, dark green round leaves), never flat black. Don't make a rim by drawing a dark shape and a lighter one 2 px
  inside it (that rim is 2 px); fill the shape and stroke it, as `plate()` in `_kit/art.js` does. Inner detail lines are softer still. Drop the outline where a
  highlight touches the edge.
- **Clean shapes at 1x.** No anti-aliasing noise, no lone pixels inside shapes, no gradients: hard ramp steps. Dither
  only for translucent things (water, mist, shadows) or big soft surfaces.
- **Light buffer sparingly.** Farm daylight is mostly color. Keep glow for things that really glow: sparkles,
  fireflies, lanterns, magic, the ripe twinkle.

## Effects: one way to render

Every effect mixes three things: opaque pixels, translucent volumes and light. Keep each in its lane so a sheet of
effects reads as one set.

- **Light falls off in steps.** `glow`, `glowLine` and `glowRing` quantize their falloff into 4 levels (the faint
  tail under the first level stays smooth) and dither
  between them (4 x 4 Bayer), so a flash or a bloom is a few hard rings, never a smooth airbrushed gradient. Don't
  rebuild a smooth glow by stacking many small ones.
- **Veils and darkening are banded too.** A screen-darkening veil or a big soft area picks its alpha from 2 or 3
  levels, not a continuous ramp. The painter enforces it: `blend`/`disc` alpha lands on steps of 1/6 (fainter than
  the first step is dithered), added light on steps of 1/16 of its color with Bayer dither between steps, so no
  effect can airbrush, whatever amounts it asks for.
- **No pure black, enforced.** Any color darker than `#161122` per channel is lifted to that floor (a deep cool
  violet) by the painter. Soot, scorch and shadow colors should still be picked warm-dark or violet-dark on purpose.
- **Glow belongs to the engine.** The `light` buffer is separate from color: in a game, feed it to the engine's
  lights or bloom (Unity URP 2D lights, Godot Light2D) instead of baking it in. Previews and the map composite it.
- **Translucent volumes** (smoke, gas, vapour, mist) use `blend`/`disc` with a flat alpha per puff; their edges come
  from overlapping puffs, and each volume needs a readable silhouette: a lit rim or a darker outline row, not just
  a fade.
- **Cooling fire leaves the fire ramp.** Flame puffs past orange turn translucent and drift into the smoke ramp;
  they never linger as hard saturated red discs.
- **One pixel size.** Detail is 1 px at the effect's scale. No 2 x 2 or larger "fat pixels" mixed in with 1 px ones.
- **Contrast with the ground it sits on.** An effect drawn on the floor must read on grass, sand and stone; check
  it on the `field` backdrop, not only on `ground`. Gas on grass needs a hue the grass doesn't have.

## Motion

- **Gentle and readable.** Idle loops breathe and sway (1 to 2 px), crops and grass sway in the wind on whole-loop
  sine waves, animals blink and look about.
- **Pops and squash.** Growing, harvesting, picking up: a squash-and-stretch pop, a little bounce, a sparkle.
- **12 fps feel for bodies** (poses hold on 12 fps steps), particles at full rate.
- **Loops for anything that lives on the map**, one-shots for actions and feedback.

## Previews

Render on the `field` backdrop (`bg: "field"`): grass seen from above with a faint 16 px tile grid, so size and
footing are easy to judge. Sprite sheets stay transparent: the game draws the ground.
