import Enemies from "./entities/Enemies";
import Keyboard from "./entities/Keyboard";

export default class Game {
  #canvas;
  #keyboard;
  #enemies;

  constructor(scene, keyboardLayout) {
    this.#canvas = document.getElementById("game-canvas");

    if (!this.#canvas) {
      throw new Error("No canvas found !");
    }

    this.#keyboard = Keyboard.init(this.#canvas, keyboardLayout);
    this.#enemies = new Enemies(this.#keyboard.keyboardLayout);
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
}
