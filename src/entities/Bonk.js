import DamageObject from "./DamageObject.js";

export default class Bonk extends DamageObject {
  constructor(position, size, damage, velocity, img) {
    super(position, size, damage);
    this.velocity = velocity;
    this.img = img;
  }

  draw(ctx) {
    if (this.img && this.img.complete) {
      ctx.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
    } else {
      super.draw(ctx);
    }
  }
}
