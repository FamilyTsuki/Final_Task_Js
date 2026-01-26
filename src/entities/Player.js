import Actor from "./Actor.js";

export default class Player extends Actor {
  #wordSpells = [{ word: "fire", damage: 100, range: 10 }];

  constructor(playerName, hp, hpMax, position, size, img) {
    super(playerName, hp, hpMax, position, size, img);
  }

  moveTo(newPosition) {
    try {
      if (!newPosition || typeof newPosition.x !== "number") {
        throw new Error("Position de déplacement invalide");
      }
      this.position = newPosition;
    } catch (e) {
      console.error("Erreur de mouvement :", e.message);
    }
  }

  draw(ctx) {
    super.draw(ctx);
  }

  get wordSpells() {
    return this.#wordSpells.map((wordSpell) => wordSpell.word);
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
}
