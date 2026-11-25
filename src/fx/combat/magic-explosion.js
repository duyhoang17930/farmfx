import * as recipe from "../_kit/pixel-recipes/arcane/mana-burst.js";
import { combatEvents } from "../_kit/combat-events.js";

const overrides = {};
export const meta = { ...recipe.meta, events: combatEvents("magic-explosion", recipe.meta), name: "magic explosion",
  tags: [...recipe.meta.tags, "combat", "magic-explosion"], options: { ...recipe.meta.options, ...overrides } };
export const { draw, drawBack, create, actorAlpha } = recipe;
