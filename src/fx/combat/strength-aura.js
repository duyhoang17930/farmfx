import * as recipe from "../_kit/pixel-recipes/status/rage.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "strength aura",
  tags: [...recipe.meta.tags, "combat", "strength-aura"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
