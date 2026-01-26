import Actor from "./Actor";

const ENEMY_IMG = new Image();
ENEMY_IMG.src = "../../assets/enemy.jpg";

export default class Enemy extends Actor {
  #damage;
  constructor(
    position,
    img = ENEMY_IMG,
    size = { width: 40, height: 40 },
    hp = 100,
    hpMax = 100,
    id = crypto.randomUUID(),
  ) {
    super(id, hp, hpMax, position, size, img);

    this.#damage = 10;
  }

  attack(player) {
    if (!player) {
      throw new Error("No player !");
    }

    player.hp -= this.#damage;
  }
}
