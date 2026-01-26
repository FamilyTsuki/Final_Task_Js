import GameObject from "./GameObject";

export default class Actor extends GameObject {
  name;
  hp;
  hpMax;
  size; //? {width: Number, height: Number}
  img; //? Image

  constructor(name, hp, hpMax, position, size, img) {
    super(position);

    this.name = name;
    this.hp = hp;
    this.hpMax = hpMax;
    this.size = size;
    this.img = img;
  }

  get name() {
    return this.name;
  }
  get hp() {
    return this.hp;
  }

  isAlive() {
    return this.hp > 0;
  }

  attack(actor) {
    console.log(`${this.name} attacking ${actor.name}`);
  }

  draw(ctx) {
    if (!ctx) throw new Error("No ctx on draw !");

    if (
      this.img instanceof HTMLImageElement &&
      this.img.complete &&
      this.img.naturalWidth !== 0
    ) {
      ctx.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
    } else {
      ctx.fillStyle = typeof this.img === "string" ? this.img : "red";
      ctx.fillRect(
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
    }
  }
  move() {}
  checkCollision(other) {
    return (
      this.position.x < other.position.x + other.size.width &&
      this.position.x + this.size.width > other.position.x &&
      this.position.y < other.position.y + other.size.height &&
      this.position.y + this.size.height > other.position.y
    );
  }
}
