import Actor from "./Actor.js";
import Projectile from "./Projectile.js";
import Bonk from "./Bonk.js";
import * as THREE from "three";

export default class Boss extends Actor {
  constructor(
    name,
    hp,
    rawPosition,
    position,
    size,
    scene,
    fireballModel,
    bossModel,
  ) {
    super(name, hp, hp, rawPosition, position, size);
    this.stateTimer = 0;
    this.attackInterval = 1000;
    this.scene = scene;
    this.fireballModel = fireballModel;

    if (bossModel) {
      this.mesh = bossModel.scene.clone();

      this.mesh.traverse((child) => {
        if (child.isMesh) {
          child.visible = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.material.transparent = false;
            child.material.opacity = 1;
          }
        }
      });

      this.scene.add(this.mesh);

      this.mesh.scale.set(this.size.width, this.size.height, this.size.width);
    }
  }

  update(deltaTime, player, projectiles, bonks) {
    if (this.hp <= 0) {
      if (this.mesh) this.mesh.visible = false;
      return;
    }

    if (this.mesh) {
      this.mesh.position.set(this.x, 0, this.y);
      this.mesh.updateMatrixWorld(true);
    }

    if (this.debugSphere) {
      this.debugSphere.position.set(this.x, this.y, -5);
    }

    this.stateTimer += deltaTime;
    if (this.stateTimer >= this.attackInterval) {
      this.stateTimer = 0;

      if (Math.random() > 0.5) {
        this.attackTentacle(player, bonks);
      } else {
        this.attackInkRain(player, projectiles);
      }
    }
  }

  checkCollision(other) {
    return (
      this.rawPosition.x < other.position.x + other.size.width &&
      this.rawPosition.x + this.size.width > other.position.x &&
      this.rawPosition.y < other.position.y + other.size.height &&
      this.rawPosition.y + this.size.height > other.position.y
    );
  }

  attackInkRain(player, projectiles) {
    const nbProjectiles = 5;

    const dx = player.position.x - this.rawPosition.x;
    const dy = player.position.y - this.rawPosition.y;
    const angleToPlayer = Math.atan2(dx, dy);

    for (let i = 0; i < nbProjectiles; i++) {
      const spread = Math.PI / 2;

      const finalAngle = angleToPlayer + (Math.random() - 0.5) * spread;

      const speed = 0.2;
      const velocity = {
        x: Math.sin(finalAngle) * speed,
        y: Math.cos(finalAngle) * speed,
      };

      projectiles.push(
        new Projectile(
          { x: this.rawPosition.x, y: this.rawPosition.y },
          { width: 0.5, height: 0.5 },
          10,
          velocity,
          this.scene,
          "boss",
          3.2,
          this.fireballModel,
        ),
      );
    }
  }
  attackTentacle(player, bonks) {
    bonks.push(
      new Bonk(
        {
          x: player.position.x,
          y: player.position.y,
        },
        { width: 1, height: 4 },
        25,
        this.scene,
        3.2,
      ),
    );
  }
}
