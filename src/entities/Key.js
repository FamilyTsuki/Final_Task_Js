import GameObject from "./GameObject";

export default class Key extends GameObject {
  #key;
  #isPressed;
  #tileSize;
  #gridPos;

  constructor(key, x, y, isPressed, tileSize) {
    super({ x, y });

    this.#key = key;
    this.#gridPos = { x, y };
    this.#isPressed = isPressed;
    this.#tileSize = tileSize;

    this.mesh = null;
  }

  get key() {
    return this.#key;
  }
  get x() {
    return this.#gridPos.x;
  }
  get y() {
    return this.#gridPos.y;
  }

  get isPressed() {
    return this.#isPressed;
  }
  set isPressed(val) {
    this.#isPressed = val;
  }
}
