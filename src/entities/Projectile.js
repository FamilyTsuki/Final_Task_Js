import DamageObject from "./DamageObject.js";

export default class Projectile extends DamageObject {
  constructor(position, size, damage, velocity, img, team = "player") {
    super(position, size, damage);
    this.velocity = velocity;
    this.img = img;
    this.team = team;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.x < -100 || this.position.x > 2000) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    if (this.img && this.img.complete && this.img.naturalWidth !== 0) {
      ctx.drawImage(
        this.img,
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
    } else {
      ctx.fillStyle = "orange";
      ctx.fillRect(
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
    }
  }
}
