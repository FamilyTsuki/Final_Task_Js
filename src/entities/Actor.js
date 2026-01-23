export default class Actor {
  name;
  hp;
  hpMax;
  position; //? {x: ..., y: ...}
  size; //? {width: ..., height: ...}
  img; //? Image

  constructor(name, hp, hpMax, position, size, img) {
    this.name = name;
    this.hp = hp;
    this.hpMax = hpMax;
    this.position = position;
    this.size = size;
    this.img = img;
  }

  attack(actor) {
    console.log(`${this.name} attacking ${actor.name}`);
  }
  render(ctx) {
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
