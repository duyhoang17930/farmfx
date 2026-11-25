import * as recipe from "../_kit/pixel-recipes/explosions/barrel-explosion.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "bomb explosion",
  tags: [...recipe.meta.tags, "combat", "bomb-explosion"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
