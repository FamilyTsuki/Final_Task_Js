import Actor from "./Actor.js";
import Projectile from "./Projectile.js";
import Bonk from "./Bonk.js";
import * as THREE from "three";

export default class Boss extends Actor {
  constructor(name, hp, position, size, scene, fireballModel, bossModel) {
    super(name, hp, hp, position, size);
    this.stateTimer = 0;
    this.attackInterval = 3000;
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

    const offsetY = 0;
    let spacing = 3.2;
    if (this.mesh) {
      this.mesh.position.set(
        this.position.x * spacing,
        offsetY,
        this.position.y * spacing,
      );
      this.mesh.updateMatrixWorld(true);
    }

    if (this.debugSphere) {
      this.debugSphere.position.set(this.position.x, this.position.y, -5);
    }

    this.stateTimer += deltaTime;
    if (this.stateTimer >= this.attackInterval) {
      this.stateTimer = 0;
      this.attackInkRain(projectiles);
    }
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
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
      };

      projectiles.push(
        new Projectile(
          { x: this.position.x, y: this.position.y },
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
