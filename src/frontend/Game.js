import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import Enemies from "./managers/Enemies";
import Keyboard from "./managers/Keyboard";
import Player from "./models/actors/Player";

export default class Game {
  #canvas;
  #keyboard;
  #player;
  #enemies;
  #projectiles;
  #bonks;

  /**
   *
   * @param {Scene} scene
   * @param {Player} player
   * @param {Enemies} enemies
   * @param {Keyboard} keyboard
   */
  constructor(scene, player, enemies, keyboard) {
    this.#canvas = document.getElementById("game-canvas");
    this.scene = scene;
    if (!this.#canvas) {
      throw new Error("No canvas found !");
    }

    this.#keyboard = keyboard;
    this.#player = player;
    this.#enemies = enemies;
    this.#projectiles = [];
    this.#bonks = [];
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
  get projectiles() {
    return this.#projectiles;
  }
  set projectiles(projectiles) {
    this.#projectiles = projectiles;
  }
  get bonks() {
    return this.#bonks;
  }
  set bonks(bonks) {
    this.#bonks = bonks;
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
    this.#enemies.update(
      this.#player.position,
      this.#projectiles,
      this.#bonks,
      this.#player,
    );
  }
  moveEnemies() {
    this.#enemies.move();
  }

  spawnBoss() {
    this.#enemies.spawnBoss(this.scene);
  }

  /**
   *
   * @param {Number} enemyNumber
   */
  spawnWave(enemyNumber) {
    for (let x = 0; x < enemyNumber; x++) {
      this.#enemies.add(x, 3 + x);
    }
  }

  /**
   *
   * @param {String} key
   */
  spawnAt(key) {
    return this.#enemies.spawnAt(this.#keyboard.find(key), this.scene);
  }

  /**
   *
   * @param {Scene} scene
   * @param {Array} keyboardLayout
   * @returns {Game}
   */
  static async init(scene, keyboardLayout) {
    const models = await modelsLoad();

    const keyboard = Keyboard.init(scene, keyboardLayout, models.key.scene);

    const enemies = new Enemies(
      keyboard.keyboardLayout,
      models.enemy.model.scene,
      models.enemy.texture,
      models.boss.scene,
      models.fireBall.scene,
    );

    const player = new Player(
      models.player.scene,
      { x: 0, y: 0, z: 5 },
      { width: 0.4, height: 0.4 },
      scene,
      models.fireBall.scene,
      enemies,
    );

    return new Game(scene, player, enemies, keyboard);
  }
}

async function modelsLoad() {
  const loader = new GLTFLoader();
  const textureLoader = new TextureLoader();

  return {
    key: await loader.loadAsync("../../public/assets/models/key.glb"),
    enemy: {
      model: await loader.loadAsync("../../public/assets/models/fireball.glb"),
      texture: await textureLoader.loadAsync("./assets/textures/bug.png"),
    },
    player: await loader.loadAsync("../../public/assets/models/player.glb"),
    boss: await loader.loadAsync("../../public/assets/models/yameter.glb"),
    fireBall: await loader.loadAsync("../../public/assets/models/fireball.glb"),
  };
}
