import Actor from "./Actor.js";
import Projectile from "./Projectile.js";
import * as THREE from "three";
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
    scene,
  ) {
    super(playerName, hp, hpMax, position, size, img);
    this.targetPosition = { x: position.x, y: position.y };
    this.speed = 0.1;
    this.imgIdle = img;
    this.imgMove = new Image();
    this.imgMove.src = "./assets/ron.png";

    this.projectileImg = new Image();
    this.projectileImg.src = "./assets/fireball.png";

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);
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

    if (Math.abs(dx) < 0.01) this.position.x = this.targetPosition.x;
    if (Math.abs(dy) < 0.01) this.position.y = this.targetPosition.y;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      this.img = this.imgIdle;
    } else {
      this.img = this.imgMove;
    }
  }
  handleKeyPress(key) {
    if (key.length === 1 && key.match(/[a-z]/i)) {
      this.#currentWord += key.toLowerCase();
    } else if (key === "Backspace") {
      this.#currentWord = this.#currentWord.slice(0, -1);
      return;
    } else {
      return;
    }

    let ok = this.#wordSpells.some((s) => s.word.startsWith(this.#currentWord));

    if (!ok) {
      this.#currentWord = "";
    } else {
      const completeSpell = this.#wordSpells.find(
        (s) => s.word === this.#currentWord,
      );
      if (completeSpell) {
        const p = this.attack(completeSpell.word);
        this.#currentWord = "";
        return p;
      }
    }
  }

  getCurrentWord() {
    return this.#currentWord;
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
    return { position: { x: 700, y: 300 }, size: { width: 50, height: 50 } };
  }
  shootProjectile(spellDamage) {
    const target = this.findClosestEnemy();
    if (!target) {
      console.error("pas d'enemi trouver");
      return null;
    }

    const projectileSpeed = 2;
    const projectileSize = { width: 80, height: 80 };

    const dx = target.position.x - this.position.x;
    const dy = target.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const velocity = {
      x: (dx / distance) * projectileSpeed,
      y: (dy / distance) * projectileSpeed,
    };

    const startPosition = {
      x: this.position.x + this.size.width / 2,
      y: this.position.y + this.size.height / 2,
    };
    return new Projectile(
      startPosition,
      projectileSize,
      spellDamage,
      velocity,
      this.projectileImg,
    );
  }
  attack(word) {
    const spell = this.#wordSpells.find((s) => s.word === word);
    if (!spell) {
      console.error("sa marche pas");
      return null;
    }

    return this.shootProjectile(spell.damage);
  }
}
