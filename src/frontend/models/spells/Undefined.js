import Spell from "../Spell";

export default class Undefined extends Spell {
  constructor() {
    super("undefined", undefined, 10);
  }

  /**
   *
   * @param {Object} closestEnemy
   */
  effect(closestEnemy) {
    if (closestEnemy) {
      if (closestEnemy.dist <= this.range) {
        closestEnemy.instance.hp = undefined;
      }
    }
  }
}
