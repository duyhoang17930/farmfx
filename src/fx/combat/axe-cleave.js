import * as recipe from "../_kit/pixel-recipes/melee/heavy-cleave.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {"radius":35,"palette":["#653940","#a95e4f","#df8971","#ffc18d","#fff1c9"]};
export const meta = { ...recipe.meta, events: combatEvents("axe-cleave", recipe.meta), name: "axe cleave",
  tags: [...recipe.meta.tags, "combat", "axe-cleave"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
