import Actor from "./Actor.js";

export default class Player extends Actor {
  #wordSpells = [{ word: "undifined", damage: 100, range: 10 }];

  constructor(
    playerName = "Unknow",
    hp = 100,
    hpMax = 100,
    position,
    size,
    img,
  ) {
    super(playerName, hp, hpMax, position, size, img);
    this.targetPosition = { x: position.x, y: position.y };
    this.speed = 0.2;
  }

  //? closestEnemy = {target: Enemy, range: Number}
  attack(closestEnemy, word) {
    const spell = this.#wordSpells.find((wordSpell) => wordSpell.word === word);

    if (!spell) {
      throw new Error("There is no spell related to that word.");
    }

    if (closestEnemy.range <= spell.range) {
      closestEnemy.target.hp = closestEnemy.target.hp - spell.damage;

      return true;
    }

    return false;
  }

  get wordSpells() {
    return this.#wordSpells.map((wordSpell) => wordSpell.word);
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
      const playerImg = new Image();
      playerImg.src = "./assets/player.jpg";
      this.img = playerImg;
    } else {
      const playerImg = new Image();
      playerImg.src = "./assets/ron.png";
      this.img = playerImg;
    }
  }
}
