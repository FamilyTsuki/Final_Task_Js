import DamageObject from "./DamageObject.js";

export default class Projectile extends DamageObject {
  constructor(position, size, damage, velocity, img, team = "player") {
    super(position, size, damage);
    this.velocity = velocity;
    this.img = img;
    this.team = team;
  }

  update(canvasSize) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      this.position.x < 0 - this.size.width ||
      this.position.x > canvasSize.width + this.size.width
    ) {
      this.isDead = true;
    }

    if (
      this.position.y < 0 - this.size.height ||
      this.position.y > canvasSize.height + this.size.height
    ) {
      this.isDead = true;
    }
  }

  draw(ctx) {
    if (this.img && this.img.complete && this.img.naturalWidth !== 0) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate((Math.round(this.position.x) * Math.PI) / 5);
      ctx.drawImage(
        this.img,
        -this.size.width / 2,
        -this.size.height / 2,
        this.size.width,
        this.size.height,
      );
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = "orange";
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate((Math.round(this.position.x) * Math.PI) / 5);
      ctx.fillRect(
        -this.size.width / 2,
        -this.size.height / 2,
        this.size.width,
        this.size.height,
      );
      ctx.restore();
    }
  }
}
