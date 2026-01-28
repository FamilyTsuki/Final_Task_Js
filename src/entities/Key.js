import GameObject from "./GameObject";

export default class Key extends GameObject {
  #key;
  #isPressed;
  #tileSize;
  #rawPos;

  constructor(key, x, y, isPressed, tileSize) {
    super({ x, y });

    this.#key = key;
    this.#rawPos = { x, y };
    this.#isPressed = isPressed;
    this.#tileSize = tileSize;

    this.mesh = null;
  }

  get key() {
    return this.#key;
  }
  get rawPos() {
    return this.#rawPos;
  }
  set isPressed(isPressed) {
    this.#isPressed = isPressed;
  }

  get isPressed() {
    return this.#isPressed;
  }
  set isPressed(val) {
    this.#isPressed = val;
  }
}
