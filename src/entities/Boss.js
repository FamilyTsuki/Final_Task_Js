import Actor from "./Actor.js";
import Projectile from ".//Projectile.js";
import Bonk from "./Bonk.js";

export default class Boss extends Actor {
  constructor(name, hp, position, size, img) {
    super(name, hp, hp, position, size, img);
    this.stateTimer = 0;
    this.attackInterval = 3000;
    this.projectileImg = new Image();
    this.projectileImg.src = "./assets/ink_ball.png";
  }

  update(deltaTime, player, projectiles, bonks) {
    if (this.hp <= 0) return;

    this.stateTimer += deltaTime;

    if (this.stateTimer >= this.attackInterval) {
      this.stateTimer = 0;

      if (Math.random() > 0.5) {
        this.attackTentacle(player, bonks);
      } else {
        this.attackInkRain(projectiles);
      }
    }
  }

  attackTentacle(player, bonks) {
    bonks.push(
      new Bonk(
        {
          x: player.position.x - 60 + player.size.width / 2,
          y: player.position.y - 150 + player.size.height / 2,
        },
        { width: 120, height: 300 },
        25,
      ),
    );
  }
  checkCollision(other) {
    return (
      this.position.x < other.position.x + other.size.width &&
      this.position.x + this.size.width > other.position.x &&
      this.position.y < other.position.y + other.size.height &&
      this.position.y + this.size.height > other.position.y
    );
  }
  attackInkRain(projectiles) {
    const nbProjectiles = 5;
    for (let i = 0; i < nbProjectiles; i++) {
      const velocity = {
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
      };

      projectiles.push(
        new Projectile(
          {
            x: this.position.x + this.size.width / 2,
            y: this.position.y + this.size.height / 2,
          },
          { width: 30, height: 30 },
          10,
          velocity,
          this.projectileImg,
          "boss",
        ),
      );
    }
  }

  draw(ctx) {
    if (this.hp <= 0) return;
    super.draw(ctx);

    ctx.fillStyle = "black";
    ctx.fillRect(this.position.x, this.position.y - 20, this.size.width, 10);
    ctx.fillStyle = "purple";
    const hpWidth = (this.hp / this.hpMax) * this.size.width;
    ctx.fillRect(this.position.x, this.position.y - 20, hpWidth, 10);
  }
}
