# Art direction: top-down 3/4

farmfx draws for **2D top-down farming games seen at a 3/4 angle**: the camera looks down at the ground from above and
a little in front, so the ground is a flat map of tiles, and everything standing on it (crops, trees, animals,
buildings, people) shows its **front and its top** at once. It's the look of the cozy farming-sim genre. Generic
genre conventions are fine; never copy a specific game's sprites, characters, palettes, UI or logos.

## The grid

- **One tile is 16 x 16 px.** Everything is sized in tiles. A crop fills one tile, a bush one, a tree 2 x 3 (trunk on
  one tile, canopy spilling over the ones around it), a chicken about one tile, a cow 2 x 2, a person 1 wide and 2 tall
  (about 16 x 32), a small building 3 x 3 to 5 x 4.
- **Canvases are whole tiles**: 16, 32, 48, 64... wide and tall, with room for what pokes out of the footprint (a
  canopy, a raised wing, flying soil).
- **The origin is the middle of the bottom edge of the footprint**: the point where the thing meets the ground, at its
  front. For a one-tile crop on a 16 x 32 canvas, that's `origin: [8, 28]` with the tile's ground from y = -12 to
  y = +4 (the tile's front edge 4 px below the origin, its back edge 12 px above). Engines line that point up with
  the tile.
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
  wood, dark green round leaves), never flat black. Inner detail lines are softer still. Drop the outline where a
  highlight touches the edge.
- **Clean shapes at 1x.** No anti-aliasing noise, no lone pixels inside shapes, no gradients: hard ramp steps. Dither
  only for translucent things (water, mist, shadows) or big soft surfaces.
- **Light buffer sparingly.** Farm daylight is mostly color. Keep glow for things that really glow: sparkles,
  fireflies, lanterns, magic, the ripe twinkle.

## Motion

- **Gentle and readable.** Idle loops breathe and sway (1 to 2 px), crops and grass sway in the wind on whole-loop
  sine waves, animals blink and look about.
- **Pops and squash.** Growing, harvesting, picking up: a squash-and-stretch pop, a little bounce, a sparkle.
- **12 fps feel for bodies** (poses hold on 12 fps steps), particles at full rate.
- **Loops for anything that lives on the map**, one-shots for actions and feedback.

## Previews

Render on the `field` backdrop (`bg: "field"`): grass seen from above with a faint 16 px tile grid, so size and
footing are easy to judge. Sprite sheets stay transparent: the game draws the ground.
