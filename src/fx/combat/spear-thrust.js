import * as recipe from "../_kit/pixel-recipes/melee/thrust.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "spear thrust",
  tags: [...recipe.meta.tags, "combat", "spear-thrust"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
