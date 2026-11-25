import * as recipe from "../_kit/pixel-recipes/melee/heavy-cleave.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "heavy slash",
  tags: [...recipe.meta.tags, "combat", "heavy-slash"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
