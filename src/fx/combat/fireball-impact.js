import * as recipe from "../_kit/pixel-recipes/explosions/small-explosion.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "fireball impact",
  tags: [...recipe.meta.tags, "combat", "fireball-impact"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
