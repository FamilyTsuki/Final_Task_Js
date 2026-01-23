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
    ctx.drawImage(
      this.img,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height,
    );
  }
  move() {}
}
