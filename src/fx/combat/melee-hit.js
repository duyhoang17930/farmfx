import * as recipe from "../_kit/pixel-recipes/impacts/blunt-hit.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "melee hit",
  tags: [...recipe.meta.tags, "combat", "melee-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
