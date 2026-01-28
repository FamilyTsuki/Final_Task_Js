import Actor from "./Actor.js";
import Projectile from "./Projectile.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Player extends Actor {
  #wordSpells = [
    { word: "undefined", damage: 100, range: 10 },
    { word: "nuke", damage: 999900, range: 99990 },
    { word: "sum", damage: 10, range: 1000 },
  ];
  #currentWord = "";
  constructor(
    playerName = "Unknow",
    hp = 100,
    hpMax = 100,
    rawPosition,
    size,
    scene,
    fireballModel,
  ) {
    const spacing = 3.2;
    const position = {
      x: rawPosition.x * spacing,
      y: rawPosition.y * spacing,
      z: rawPosition.z,
    };

    super(playerName, hp, hpMax, rawPosition, position, size);
    this.targetPosition = { x: position.x, y: position.y, z: position.z };
    this.speed = 0.1;

    this.mesh = new THREE.Group();
    this.scene = scene;
    scene.add(this.mesh);

    this.fireballModel = fireballModel;
    this.playerModel = null;
    this.jumpTimer = 0;
    this.startJumpPos = { x: position.x, y: position.y };
    this.totalJumpDist = 0;
    this.jumpSound = new Audio("../../public/assets/sounds/jump.wav");
    this.jumpSound.volume = 0.5;

    this.damageSound = new Audio("../../public/assets/sounds/ouch.wav");
    this.damageSound.volume = 0.5;

    const loader = new GLTFLoader();
    loader.load("./assets/player.glb", (gltf) => {
      this.playerModel = gltf.scene;
      this.playerModel.scale.set(1.3, 1.3, 1.3);

      this.playerModel.position.y = 0.6;

      this.mesh.add(this.playerModel);
    });
  }

  get wordSpells() {
    return this.#wordSpells.map((wordSpell) => wordSpell.word);
  }
  get currentWord() {
    return this.#currentWord;
  }

  //? closestEnemy = {pos: {x: Number, y: Number}, dist: Number}
  attack(word, closestEnemy = null) {
    const spell = this.#wordSpells.find((wordSpell) => wordSpell.word === word);

    if (!spell) {
      throw new Error("There is no spell related to that word.");
    }

    if (closestEnemy) {
      if (closestEnemy.dist <= spell.range) {
        return this.shootProjectile(
          spell.damage,
          closestEnemy.instance.position,
        );
      }
    }

    return false;
  }

  moveTo(newPos) {
    this.startJumpPos = { x: this.x, y: this.y };
    this.targetPosition = newPos;

    const dx = this.targetPosition.x - this.startJumpPos.x;
    const dy = this.targetPosition.y - this.startJumpPos.y;
    this.totalJumpDist = Math.sqrt(dx * dx + dy * dy);
    this.jumpSound.play();
  }
  update() {
    const dx = this.targetPosition.x - this.x;
    const dy = this.targetPosition.y - this.y;
    const currentDist = Math.sqrt(dx * dx + dy * dy);
    const spacing = 3.2;

    this.x += dx * this.speed;
    this.y += dy * this.speed;

    if (this.mesh && this.playerModel) {
      this.mesh.position.set(this.x, 0, this.y);

      if (currentDist > 0.01) {
        this.mesh.lookAt(
          this.targetPosition.x * spacing,
          0,
          this.targetPosition.y * spacing,
        );

        const progression =
          this.totalJumpDist > 0 ? 1 - currentDist / this.totalJumpDist : 1;

        const jumpAmplitude = 2.0;
        this.playerModel.position.y =
          0.6 + Math.sin(progression * Math.PI) * jumpAmplitude;
      } else {
        this.playerModel.position.y = 0.6;
        this.playerModel.rotation.x = 0;
        this.x = this.targetPosition.x;
        this.y = this.targetPosition.y;
      }
    }
  }
  damage(nb) {
    this.hp -= nb;
    this.damageSound.play();
  }
  handleKeyPress(key, findClosestEnemy) {
    if (key.length === 1 && key.match(/[a-z]/i)) {
      this.#currentWord += key.toLowerCase();
    } else if (key === "Backspace") {
      this.#currentWord = this.#currentWord.slice(0, -1);
    }

    let ok = this.#wordSpells.some((spell) =>
      spell.word.startsWith(this.#currentWord),
    );

    if (!ok) {
      this.#currentWord = "";
    } else {
      const completeSpell = this.#wordSpells.find(
        (spell) => spell.word === this.#currentWord,
      );
      if (completeSpell) {
        this.#currentWord = "";
        return completeSpell.word;
      }
    }

    return false;
  }

  shootProjectile(spellDamage, target) {
    if (!target) {
      throw new Error("No target !");
    }

    const projectileSpeed = 2;
    const projectileSize = { width: 80, height: 80 };

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    const velocity = {
      x: (dx / distance) * projectileSpeed,
      y: (dy / distance) * projectileSpeed,
    };

    const startPosition = {
      x: this.x,
      y: this.y,
    };
    console.log(startPosition, this.position);
    return new Projectile(
      startPosition,
      projectileSize,
      spellDamage,
      velocity,
      this.scene,
      "player",
      1.0,
      this.fireballModel,
    );
  }
}
