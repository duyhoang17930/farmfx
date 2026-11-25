import * as recipe from "../_kit/pixel-recipes/scifi/force-field.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "magic shield",
  tags: [...recipe.meta.tags, "combat", "magic-shield"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
