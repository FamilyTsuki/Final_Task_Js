import GameObject from "./GameObject";

export default class Key extends GameObject {
  #key;
  #isPressed;
  #tileSize;
  #depth;
  #offset;
  #tempPos;
  constructor(key, x, y, isPressed, tileSize) {
    super({
      x: x * (tileSize + 10) + 50,
      y: y * (tileSize + 5) + 50,
    });

    ((this.#tempPos = { x, y }), (this.#key = key));
    this.#isPressed = isPressed;
    this.#tileSize = tileSize;

    this.#depth = 6;
    this.#offset = isPressed ? 3 : 0;
  }

  get key() {
    return this.#key;
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
    ctx.fillStyle = this.#isPressed ? "#b56500" : "#555";
    ctx.fillRect(this.x, this.y, this.#tileSize, this.#tileSize + this.#depth);

    //? body of key
    ctx.fillStyle = this.#isPressed ? "#FF9800" : "#eee";
    ctx.fillRect(this.x, this.y + this.#offset, this.#tileSize, this.#tileSize);

    //? border of body key
    ctx.strokeStyle = this.#isPressed ? "#e68a00" : "#999";
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
      this.y + this.#tileSize / 2 + 7 + this.#offset - 20,
    );
    ctx.fillText(
      `x: ${this.#tempPos.x}`,
      this.x + this.#tileSize / 2,
      this.y + this.#tileSize / 2 + 7 + this.#offset,
    );
    ctx.fillText(
      `y: ${this.#tempPos.y}`,
      this.x + this.#tileSize / 2,
      this.y + this.#tileSize / 2 + 7 + this.#offset + 20,
    );
  }
}
