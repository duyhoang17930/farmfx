import * as recipe from "../_kit/pixel-recipes/fire/fireball.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "fireball",
  tags: [...recipe.meta.tags, "combat", "fireball"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
