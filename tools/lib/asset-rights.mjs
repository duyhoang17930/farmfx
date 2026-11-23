const referenceCategories = new Set(["characters", "portraits", "farming"]);

// The farming clips embed the same reference-derived figure as the character sprites.
export const usesReferenceArt = (id) => referenceCategories.has(id.split("/")[0]);
