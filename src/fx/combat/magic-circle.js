import * as recipe from "../_kit/pixel-recipes/arcane/rune-circle.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "magic circle",
  tags: [...recipe.meta.tags, "combat", "magic-circle"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
