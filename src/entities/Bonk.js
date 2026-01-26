import DamageObject from "./DamageObject.js";

export default class Bonk extends DamageObject {
  constructor(position, size, damage) {
    super(position, size, damage);
    this.timer = 0;
    this.isAttacking = false;
    this.duration = 1000;
    this.attackWindow = 200;
  }

  update(deltaTime, player) {
    this.timer += deltaTime;

    if (this.timer < this.duration) {
      this.isAttacking = false;
    } else if (this.timer < this.duration + this.attackWindow) {
      if (!this.isAttacking) {
        this.isAttacking = true;
        if (this.checkCollision(player)) {
          player.hp -= this.damage;
          console.log("AIE ! Le joueur a pris un Bonk !");
        }
      }
    } else {
      this.isDead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    if (!this.isAttacking) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.fillRect(
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
      ctx.strokeRect(
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
    } else {
      ctx.fillStyle = "white";
      ctx.fillRect(
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
      ctx.fillStyle = "red";
      ctx.globalAlpha = 0.8;
      ctx.fillRect(
        this.position.x,
        this.position.y,
        this.size.width,
        this.size.height,
      );
    }
    ctx.restore();
  }
}
