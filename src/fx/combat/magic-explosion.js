import * as recipe from "../_kit/pixel-recipes/arcane/mana-burst.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "magic explosion",
  tags: [...recipe.meta.tags, "combat", "magic-explosion"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
