import { keyed, spots } from "./person.js";
import { groundShadow } from "./sprite.js";
import { drawWorkingCharacter } from "../characters/_draw.js";

const FACINGS = {
  down: { target: [0, 13], rest: [5, -6], windup: [4, -11], reach: [3, -1], lift: [3, -15], far: [-5, -5] },
  up: { target: [0, -15], rest: [5, -7], windup: [6, -16], reach: [1, -15], lift: [1, -24], far: [-5, -7] },
  side: { target: [16, 1], rest: [3, -6], windup: [0, -12], reach: [12, -3], lift: [8, -15], far: [3, -7] },
};

export const FIELD_OPTIONS = {
  facing: "all",
  look: "farmer",
  season: "original",
  colors: null,
  plot: true,
  seed: 1,
};

export const CONTACT = 0.5;
export const DURATION = 1.75;

export function fieldWork(p, t, o, harvest, props) {
  for (const { f, x } of spots(o.facing, 44)) {
    const direction = f === "left" ? -1 : 1;
    const side = f === "left" || f === "right";
    const plan = FACINGS[side ? "side" : f] ?? FACINGS.down;
    const key = keyed([
      [0, { hand: plan.rest, lean: 0, bob: 0 }],
      [0.33, { hand: harvest ? plan.rest : plan.windup, lean: harvest ? 1 : -1, bob: harvest ? 2 : -1 }],
      [CONTACT, { hand: plan.reach, lean: 3, bob: harvest ? 3 : 1 }, "snap"],
      [0.6, { hand: plan.reach, lean: 3, bob: harvest ? 3 : 1 }],
      [0.83, { hand: harvest ? plan.lift : plan.rest, lean: harvest ? 0 : 1, bob: harvest ? -1 : 0 }, "out"],
      [1.27, { hand: plan.rest, lean: 0, bob: 0 }],
      [DURATION, { hand: plan.rest, lean: 0, bob: 0 }],
    ], t);
    const [dx, y] = plan.target;
    const targetX = x + dx * direction;
    const release = [x + plan.reach[0] * direction, plan.reach[1]];
    const hand = [x + key.hand[0] * direction, key.hand[1]];
    const plot = () => { if (o.plot) props.plot(targetX, y, t); };
    const action = () => props.action(targetX, y, t, { release, hand });
    const held = props.held ? (g, flip) => props.held(g, plan.far[0] * flip, plan.far[1]) : null;
    if (f === "up") {
      plot();
      action();
    }
    groundShadow(p, x, 0, 6, 2);
    drawWorkingCharacter(p, x, 0, f, o.look, {
      hands: [key.hand, plan.far], lean: key.lean, bob: key.bob,
      behind: f === "up" ? held : null, front: f === "up" ? null : held,
    }, o);
    if (f !== "up") {
      plot();
      action();
    }
  }
}
