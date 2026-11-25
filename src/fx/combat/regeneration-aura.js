import * as recipe from "../_kit/pixel-recipes/nature/healing-bloom.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "regeneration aura",
  tags: [...recipe.meta.tags, "combat", "regeneration-aura"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
