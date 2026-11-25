import * as recipe from "../_kit/pixel-recipes/impacts/hit-flash.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "enemy hit",
  tags: [...recipe.meta.tags, "combat", "enemy-hit"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
