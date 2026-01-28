import Enemies from "./entities/Enemies";
import Keyboard from "./entities/Keyboard";

export default class Game {
  #canvas;
  #keyboard;
  #enemies;

  constructor(scene, enemies, keyboard) {
    this.#canvas = document.getElementById("game-canvas");
    this.scene = scene;
    if (!this.#canvas) {
      throw new Error("No canvas found !");
    }

    this.#keyboard = keyboard;
    this.#enemies = enemies;
  }

  keyboardUpdate() {
    this.#keyboard.update();
  }

  keyboardUpdateSize() {
    if (this.#keyboard.updateSize) {
      this.#keyboard.updateSize(this.#canvas);
    }
  }

  get keyboard() {
    return this.#keyboard;
  }
  get enemies() {
    return this.#enemies;
  }

  static async init(scene, keyboardLayout) {
    const keyboard = Keyboard.init(scene, keyboardLayout);

    return new Game(
      scene,
      await Enemies.init(keyboard.keyboardLayout, scene),
      keyboard,
    );
  }
}
