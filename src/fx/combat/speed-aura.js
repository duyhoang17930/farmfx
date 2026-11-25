import * as recipe from "../_kit/pixel-recipes/status/haste.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "speed aura",
  tags: [...recipe.meta.tags, "combat", "speed-aura"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
