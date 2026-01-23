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

  get playerName() {
    return this.playerName;
  }
  get hp() {
    return this.hp;
  }
  get wordSpells() {
    return this.#wordSpells.map((wordSpell) => wordSpell.word);
  }
}
