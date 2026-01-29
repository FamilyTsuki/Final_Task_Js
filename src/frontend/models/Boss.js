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
    this.attackInterval = 1400;
    this.scene = scene;
    this.fireballModel = fireballModel;
    this.totalTime = 0;
    this.container = new THREE.Group();
    this.scene.add(this.container);
    this.targetRotationX = 0;
    this.targetRotationY = 0;
    this.attackPhase = "idle";
    this.attackStartTime = 0;
    this.isAttacking = false;

    if (bossModel) {
      this.mesh = bossModel.scene.clone();

      this.mesh.traverse((child) => {
        if (child.isMesh) {
          child.visible = true;
          if (child.isSkinnedMesh) {
            child.frustumCulled = false;
          }
        }
      });

      this.scene.add(this.mesh);
      this.mesh.scale.set(this.size.width, this.size.height, this.size.width);
    }
    this.isEmerging = true;
    this.emergeProgress = 0;

    this.mesh.position.y = -10;
    this.mesh.scale.set(0, 0, 0);
  }

  get isDead() {
    return this.hp <= 0 || this.hp === undefined;
  }

  update(deltaTime, player, projectiles, bonks) {
    if (this.hp <= 0) return;
    if (this.isEmerging) {
      this.emergeProgress += deltaTime * 0.0005;

      if (this.emergeProgress < 1) {
        const t = this.emergeProgress;
        const smoothProgress = t * t * (3 - 2 * t);

        this.mesh.position.y = -10 * (1 - smoothProgress);

        const s_w = this.size.width * smoothProgress;
        const s_h = this.size.height * smoothProgress;
        this.mesh.scale.set(s_w, s_h, s_w);

        if (window.startShake) window.startShake(0.3);

        this.mesh.updateMatrixWorld(true);
        return;
      } else {
        this.isEmerging = false;
        this.mesh.position.y = 0;
        this.mesh.scale.set(this.size.width, this.size.height, this.size.width);
      }
    }
    const spacing = 3.2;
    this.totalTime += deltaTime * 0.001;

    if (this.mesh) {
      let xToReach = this.isAttacking ? this.targetX : this.position.x;
      this.mesh.position.x = THREE.MathUtils.lerp(
        this.mesh.position.x,
        xToReach * spacing,
        0.05,
      );
      this.mesh.position.z = this.position.y * spacing;

      if (this.isAttacking) {
        const elapsed = this.totalTime - this.attackStartTime;

        if (elapsed < 0.8) {
          this.mesh.rotation.x = 0;
        } else if (elapsed < 1.0) {
          const strikeProgress = (elapsed - 0.8) / 0.2;
          this.mesh.rotation.x = strikeProgress * 1.4;
        } else if (elapsed < 1.2) {
          this.mesh.rotation.x = 1.4;
        } else if (elapsed < 1.6) {
          const recoveryProgress = (elapsed - 1.2) / 0.4;
          this.mesh.rotation.x = 1.4 * (1 - recoveryProgress);
        } else {
          this.isAttacking = false;
          this.mesh.rotation.x = 0;
        }
      } else {
        this.mesh.rotation.y = Math.sin(this.totalTime * 2) * 0.2;
      }

      this.mesh.updateMatrixWorld(true);
    }

    this.stateTimer += deltaTime;
    if (this.stateTimer >= this.attackInterval) {
      this.stateTimer = 0;
      if (Math.random() > 0.5) this.attackTentacle(player, bonks);
      else this.attackInkRain(player, projectiles);
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

      const speed = 0.1;
      const velocity = {
        x: Math.sin(finalAngle) * speed,
        y: Math.cos(finalAngle) * speed,
      };

      projectiles.push(
        new Projectile(
          { x: this.rawPosition.x, y: this.rawPosition.y },
          { width: 0.4, height: 0.4 },
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
    this.targetX = player.position.x;
    this.attackStartTime = this.totalTime;
    this.isAttacking = true;

    bonks.push(
      new Bonk(
        { x: player.position.x, y: player.position.y },
        { width: 1, height: 4 },
        25,
        this.scene,
        3.2,
      ),
    );
  }
  die() {
    this.isDead = true;
    if (this.mesh && this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
      this.mesh.visible = false;
    }
  }
}
