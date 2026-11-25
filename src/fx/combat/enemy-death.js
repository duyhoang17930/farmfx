import * as recipe from "../_kit/pixel-recipes/spawn/disintegrate.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "enemy death",
  tags: [...recipe.meta.tags, "combat", "enemy-death"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
