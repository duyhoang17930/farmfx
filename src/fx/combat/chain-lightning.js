import * as recipe from "../_kit/pixel-recipes/lightning/chain-lightning.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "chain lightning",
  tags: [...recipe.meta.tags, "combat", "chain-lightning"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
