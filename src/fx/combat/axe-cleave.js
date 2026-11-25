import * as recipe from "../_kit/pixel-recipes/melee/heavy-cleave.js";

const overrides = {"radius":35,"palette":["#653940","#a95e4f","#df8971","#ffc18d","#fff1c9"]};
export const meta = { ...recipe.meta, name: "axe cleave",
  tags: [...recipe.meta.tags, "combat", "axe-cleave"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
