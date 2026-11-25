// Times in seconds, measured from the start of the recipe's effect.
const hits = {
  "sword-slash": 0.06, "sword-double-slash": 0.06, "sword-spin": 0.17,
  "heavy-slash": 0.335, "spear-thrust": 0.07, "axe-cleave": 0.335, "bow-shot": 0.8,
  "arrow-impact": 0, "fire-arrow-impact": 0.32, "ice-arrow-impact": 0.26,
  "critical-hit": 0, "melee-hit": 0, "ranged-hit": 0.05, "poison-hit": 0.3,
  "fireball-impact": 0, "ice-explosion": 0.42, "lightning-bolt": 0.76,
  "chain-lightning": 0.17, "magic-missile": 0.82, "magic-explosion": 0.22,
  shockwave: 0.06, "ground-slam": 0, "ground-crack": 1.18,
  "rock-projectile": (options) => (170 + Math.sqrt(170 ** 2 - 1720 * (-26 + options.size * 0.8))) / 860,
  "bomb-explosion": 0.8, "large-explosion": 0,
};

const contactOnly = {
  "shield-block": 0, "shield-break": 1.4, parry: 0, "enemy-hit": 0,
  "enemy-death": 0.42, knockback: 0, "healing-aura": 0.3,
  "regeneration-aura": 1.05,
};

export function combatEvents(id, meta) {
  const hit = hits[id];
  const damage = typeof hit === "function" ? hit(meta.options) : hit;
  const contact = damage ?? contactOnly[id];
  return {
    ...(contact === undefined ? {} : { contact }),
    ...(damage === undefined ? {} : { damage }),
    ...(id === "sword-double-slash" ? { secondContact: 0.2, secondDamage: 0.2 } : {}),
    completion: meta.duration,
  };
}
