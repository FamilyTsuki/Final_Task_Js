import Enemies from "./entities/Enemies";
import Keyboard from "./entities/Keyboard";

export default class Game {
  #canvas;
  #ctx;
  #keyboard;
  #enemies;

  constructor(keyboardLayout) {
    this.#canvas = document.getElementById("game-canvas");
    if (!this.#canvas) {
      throw new Error("No canvas find !");
    }
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;

    this.#ctx = this.#canvas.getContext("2d");
    if (!this.#ctx) {
      throw new Error("No ctx find !");
    }

    this.#keyboard = Keyboard.init(this.#canvas, keyboardLayout);
    this.#enemies = new Enemies(this.#keyboard.keyboardLayout);
  }

  keyboardDraw() {
    this.#keyboard.draw(this.#canvas, this.#ctx);
  }

  keyboardUpdateSize() {
    this.#keyboard.updateSize(this.#canvas);
  }

  get keyboard() {
    return this.#keyboard;
  }
  get enemies() {
    return this.#enemies;
  }
}
