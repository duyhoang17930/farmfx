import * as recipe from "../_kit/pixel-recipes/holy/heal-aoe.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("healing-aura", recipe.meta), name: "healing aura",
  tags: [...recipe.meta.tags, "combat", "healing-aura"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
