import * as recipe from "../_kit/pixel-recipes/ui/exclamation.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "boss warning",
  tags: [...recipe.meta.tags, "combat", "boss-warning"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
