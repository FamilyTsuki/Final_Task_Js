import Projectile from "../Projectile";
import Spell from "../Spell";

export default class ProjectileLuncher extends Spell {
  #projectileModel;

  /**
   *
   * @param {String} word
   * @param {Number} damage
   * @param {Number} range
   */
  constructor(word, damage, range, projectileModel) {
    super(word, damage, range);

    this.#projectileModel = projectileModel;
  }

  /**
   * @param {Object} target = { x: Number, y: Number }
   * @param {Player} player
   * @param {Scene} scene
   */
  shootProjectile(target, player, scene) {
    if (!target) {
      throw new Error("No target !");
    }

    const projectileSpeed = 2;
    const projectileSize = { width: 80, height: 80 };

    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    const velocity = {
      x: (dx / distance) * projectileSpeed,
      y: (dy / distance) * projectileSpeed,
    };

    const spacing = 3.2;
    const startPosition = {
      x: (player.x + player.size.width / 2) * spacing,
      y: (player.y + player.size.height / 2) * spacing,
    };
    return new Projectile(
      startPosition,
      projectileSize,
      this.damage,
      velocity,
      scene,
      "player",
      1.0,
      this.#projectileModel,
    );
  }

  /**
    @param {Object} closestEnemy = { instance: Enemy, dist = Number }
    @param {Player} player
    @param {Scene} scene
  */
  effect(closestEnemy, player, scene) {
    if (closestEnemy) {
      if (closestEnemy.dist <= this.range) {
        return this.shootProjectile(
          closestEnemy.instance.rawPosition,
          player,
          scene,
        );
      }
    }

    return false;
  }
}
