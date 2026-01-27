import GameObject from "./GameObject";

export default class Key extends GameObject {
  #key;
  #isPressed;
  #tileSize;
  #depth;
  #offset;
  #rawPos;
  constructor(key, x, y, isPressed, tileSize) {
    super({
      x: x * (tileSize + 10) + 50,
      y: y * (tileSize + 8) + 50,
    });

    ((this.#rawPos = { x, y }), (this.#key = key));
    this.#isPressed = isPressed;
    this.#tileSize = tileSize;

    this.#depth = 6;
    this.#offset = isPressed ? 3 : 0;
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
  set tileSize(tileSize) {
    this.#tileSize = tileSize;
  }

  draw(ctx) {
    this.#offset = this.#isPressed ? 3 : 0;

    //? low of key
    ctx.fillStyle = "#555";
    ctx.fillRect(this.x, this.y, this.#tileSize, this.#tileSize + this.#depth);

    //? body of key
    ctx.fillStyle = "#eee";
    ctx.fillRect(this.x, this.y + this.#offset, this.#tileSize, this.#tileSize);

    //? border of body key
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      this.x,
      this.y + this.#offset,
      this.#tileSize,
      this.#tileSize,
    );

    //? text of key
    ctx.fillStyle = this.#isPressed ? "white" : "#333";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      this.#key,
      this.x + this.#tileSize / 2,
      this.y + this.#tileSize / 2 + 7 + this.#offset,
    );
  }
}
