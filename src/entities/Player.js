import Actor from "./Actor.js";

export default class Player extends Actor {
  #wordSpells = [
    { word: "undifined", damage: 100, range: 10 },
    { word: "nuke", damage: 999900, range: 99990 },
  ];
  #currentWord = "";
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
  attack(word, closestEnemy = null) {
    const spell = this.#wordSpells.find((wordSpell) => wordSpell.word === word);

    if (!spell) {
      throw new Error("There is no spell related to that word.");
    }
    if (closestEnemy) {
      if (closestEnemy.range <= spell.range) {
        closestEnemy.target.hp = closestEnemy.target.hp - spell.damage;

        return true;
      }
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
  handleKeyPress(key) {
    if (key.length === 1 && key.match(/[a-z]/i)) {
      this.#currentWord += key.toLowerCase();
    } else {
      return;
    }

    let ok = false;

    for (let i = 0; i < this.#wordSpells.length; i++) {
      let spellWord = this.#wordSpells[i].word.toLowerCase();

      let match = true;
      for (let j = 0; j < this.#currentWord.length; j++) {
        if (this.#currentWord[j] !== spellWord[j]) {
          match = false;
          break;
        }
      }

      if (match === true) {
        ok = true;
        break;
      }
    }

    if (ok === false) {
      this.#currentWord = "";
      console.log("Mot reset");
    } else {
      console.log("Mot en cours :", this.#currentWord);
      for (let i = 0; i < this.#wordSpells.length; i++) {
        if (this.#currentWord == this.#wordSpells[i].word) {
          this.attack(this.#wordSpells[i].word);
          console.log("ATTAK");
          this.#currentWord = "";
        }
      }
    }
  }

  getCurrentWord() {
    if (this.#currentWord !== "") return this.#currentWord;
    else return "";
  }
  getWordList() {
    let list = [];
    for (let i = 0; i < this.#wordSpells.length; i++) {
      list.push(this.#wordSpells[i].word);
    }
    return list;
  }
  getHp() {
    return this.hp;
  }
  findClosestEnemy() {
    return {
      position: { x: 700, y: 300 },
      size: { width: 50, height: 50 },
      hp: 100,
    };
  }
  shootProjectile(spellDamage, projectileSpeed, projectileSize, projectileImg) {
    const target = this.findClosestEnemy();

    if (!target) {
      console.log("Pas d'ennemi à cibler !");
      return null;
    }

    const dx = target.position.x - this.position.x;
    const dy = target.position.y - this.position.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const normalizedDx = dx / distance;
    const normalizedDy = dy / distance;

    const velocity = {
      x: normalizedDx * projectileSpeed,
      y: normalizedDy * projectileSpeed,
    };

    const startPosition = {
      x: this.position.x + this.size.width / 2 - projectileSize.width / 2,
      y: this.position.y + this.size.height / 2 - projectileSize.height / 2,
    };

    return new Projectile(
      startPosition,
      projectileSize,
      spellDamage,
      velocity,
      projectileImg,
    );
  }
  attack(closestEnemy, word) {
    const spell = this.#wordSpells.find((wordSpell) => wordSpell.word === word);

    if (!spell) {
      throw new Error("There is no spell related to that word.");
    }

    const newProjectile = this.shootProjectile(
      spell.damage,
      CONFIG.projectile.speed,
      CONFIG.projectile.size,
      projectileImg,
    );

    if (newProjectile) {
      return newProjectile;
    }
    return false;
  }
}
