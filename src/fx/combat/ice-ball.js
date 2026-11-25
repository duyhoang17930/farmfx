import * as recipe from "../_kit/pixel-recipes/water/water-orb.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "ice ball",
  tags: [...recipe.meta.tags, "combat", "ice-ball"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
