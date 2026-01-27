import Keyboard from "./entities/Keyboard";

export default class Game {
  #canvas;
  #keyboard;

  constructor(scene, keyboardLayout) {
    this.#canvas = document.getElementById("game-canvas");

    if (!this.#canvas) {
      throw new Error("No canvas found !");
    }

    this.#keyboard = Keyboard.init(scene, keyboardLayout);
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
}
