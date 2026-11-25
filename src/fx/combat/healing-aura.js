import * as recipe from "../_kit/pixel-recipes/holy/heal-aoe.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "healing aura",
  tags: [...recipe.meta.tags, "combat", "healing-aura"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
