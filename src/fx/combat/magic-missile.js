import * as recipe from "../_kit/pixel-recipes/projectiles/magic-missile.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "magic missile",
  tags: [...recipe.meta.tags, "combat", "magic-missile"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
