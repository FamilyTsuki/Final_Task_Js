import Actor from "../Actor";

export default class Enemy extends Actor {
  #damage;
  constructor(
    position,
    img = undefined,
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

  moveTo(newPos) {
    this.targetPosition = newPos;
  }

  update() {
    const dx = this.targetPosition.x - this.position.x;
    const dy = this.targetPosition.y - this.position.y;

    this.position.x += dx * this.speed;
    this.position.y += dy * this.speed;

    if (Math.abs(dx) < 4) this.position.x = this.targetPosition.x;
    if (Math.abs(dy) < 4) this.position.y = this.targetPosition.y;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      this.img = this.imgIdle;
    } else {
      this.img = this.imgMove;
    }
  }
}
