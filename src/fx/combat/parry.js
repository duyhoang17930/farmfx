import * as recipe from "../_kit/pixel-recipes/impacts/parry.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "parry",
  tags: [...recipe.meta.tags, "combat", "parry"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
