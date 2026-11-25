import * as recipe from "../_kit/pixel-recipes/status/stunned.js";

const overrides = {};
export const meta = { ...recipe.meta, name: "stun stars",
  tags: [...recipe.meta.tags, "combat", "stun-stars"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
