import Projectile from "../Projectile";
import Spell from "../Spell";

export default class ProjectileLuncher extends Spell {
  #projectileModel;

  constructor(word, damage, range, projectileModel) {
    super(word, damage, range);

    this.#projectileModel = projectileModel;
  }

  /**
   * @param target = { x: Number, y: Number }
   * @param player = { pos: {x: Number, y: Number}, size: { width: Number, height: Number } }
   */
  shootProjectile(target, player, scene) {
    console.log(scene);
    if (!target) {
      throw new Error("No target !");
    }

    const projectileSpeed = 2;
    const projectileSize = { width: 80, height: 80 };

    const dx = target.x - player.pos.x;
    const dy = target.y - player.pos.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    const velocity = {
      x: (dx / distance) * projectileSpeed,
      y: (dy / distance) * projectileSpeed,
    };

    const spacing = 3.2;
    const startPosition = {
      x: (player.pos.x + player.size.width / 2) * spacing,
      y: (player.pos.y + player.size.height / 2) * spacing,
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
    @param closestEnemy = { instance: Enemy, dist = Number }
    @param player = { pos: {x: Number, y: Number}, size: { width: Number, height: Number } }
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
