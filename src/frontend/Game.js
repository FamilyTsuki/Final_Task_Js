import { GLTFLoader } from "three/examples/jsm/Addons.js";
import Enemies from "./managers/Enemies";
import Keyboard from "./managers/Keyboard";
import Player from "./models/actors/Player";

const loader = new GLTFLoader();

export default class Game {
  #canvas;
  #keyboard;
  #player;
  #enemies;
  #fireBallModel;

  constructor(scene, player, enemies, keyboard, enemyModel, fireBallModel) {
    this.#canvas = document.getElementById("game-canvas");
    this.scene = scene;
    if (!this.#canvas) {
      throw new Error("No canvas found !");
    }

    this.#keyboard = keyboard;
    this.#player = player;
    this.#enemies = enemies;
    this.#fireBallModel = fireBallModel;
  }

  get keyboard() {
    return this.#keyboard;
  }
  get player() {
    return this.#player;
  }
  get enemies() {
    return this.#enemies;
  }

  keyboardUpdate() {
    this.#keyboard.update();
  }

  keyboardUpdateSize() {
    if (this.#keyboard.updateSize) {
      this.#keyboard.updateSize(this.#canvas);
    }
  }

  update() {
    this.#enemies.clearDead();
    this.#enemies.update();
  }
  moveEnemies() {
    this.#enemies.move();
  }

  async spawnBoss() {
    await this.#enemies.spawnBoss(this.scene);
  }

  spawnWave(enemyNumber) {
    for (let x = 0; x < enemyNumber; x++) {
      this.#enemies.add(x, 3 + x);
    }
  }

  spawnAt(x, y) {
    return this.#enemies.spawnAt(x, y, this.scene);
  }

  static async init(scene, keyboardLayout) {
    const keyboard = Keyboard.init(scene, keyboardLayout);

    const enemyGltf = await loader.loadAsync(
      "../../public/assets/bug.glb",
      (enemyGltf) => enemyGltf,
    );

    const fireballGltf = await loader.loadAsync(
      "../../public/assets/fireball.glb",
      (fireballGltf) => fireballGltf,
    );

    const player = new Player(
      "Héros",
      100,
      100,
      { x: 0, y: 0, z: 5 },
      { width: 0.4, height: 0.4 },
      scene,
      fireballGltf.scene,
    );

    return new Game(
      scene,
      player,
      new Enemies(keyboard.keyboardLayout, enemyGltf.scene, fireballGltf.scene),
      keyboard,
      fireballGltf.scene,
    );
  }
}
