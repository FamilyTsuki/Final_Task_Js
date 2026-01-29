import Spell from "../Spell";
import * as THREE from "three";

export default class FireCircle extends Spell {
  #duration;
  #scene;
  #player;
  #enemies;

  #loopId;
  #attackSpeed;

  #mesh;
  #timer;
  #isActive;

  /**
   *
   * @param {String} word
   * @param {Number} damage
   * @param {Number} duration
   * @param {Scene} scene
   * @param {Player} player
   * @param {Enemies} enemies
   */
  constructor(word, damage, range, duration, scene, player, enemies) {
    super(word, damage, range);

    this.#duration = duration;
    this.#scene = scene;
    this.#player = player;
    this.#enemies = enemies;

    this.#attackSpeed = 500;

    this.#timer = 0;
    this.#isActive = false;

    this.#mesh = null;
  }

  effect() {
    if (this.#isActive) return false;

    this.#isActive = true;
    this.#timer = 0;

    const geometry = new THREE.CylinderGeometry(
      this.range * 3.2,
      this.range * 3.2,
      0.5,
      32,
    );
    const material = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });

    this.#mesh = new THREE.Mesh(geometry, material);

    const playerPosWorld = {
      x: this.#player.position.x * 3.2,
      y: this.#player.position.y * 3.2,
    };
    this.#mesh.position.set(playerPosWorld.x, 0.1, playerPosWorld.y);
    this.#scene.add(this.#mesh);

    this.#loopId = setInterval(() => {
      this.#enemies.container.forEach((enemy) => {
        const dist = Math.sqrt(
          (this.#mesh.position.x - enemy.mesh.position.x) ** 2 +
            (this.#mesh.position.z - enemy.mesh.position.z) ** 2,
        );

        if (dist <= this.range * 3.2 && !enemy.isBurning) {
          enemy.hp -= this.damage;
        }
      });
    }, this.#attackSpeed);

    return true;
  }

  /**
   *
   * @param {Number} deltaTime
   */
  update(deltaTime) {
    if (this.#isActive && this.#mesh) {
      this.#timer += deltaTime;

      const playerPosWorld = {
        x: this.#player.position.x * 3.2,
        y: this.#player.position.y * 3.2,
      };
      this.#mesh.position.set(playerPosWorld.x, 0.1, playerPosWorld.y);

      this.#mesh.material.opacity = 0.5 + Math.sin(this.#timer * 0.01) * 0.2;
      this.#mesh.material.color.setHSL(
        Math.sin(this.#timer * 0.005) * 0.1 + 0.08,
        1,
        0.6 + Math.sin(this.#timer * 0.003) * 0.1,
      );

      if (this.#timer >= this.#duration) {
        this.desactivate();
      }
    }
  }

  desactivate() {
    if (this.#mesh) {
      this.#scene.remove(this.#mesh);
      this.#mesh.geometry.dispose();
      this.#mesh.material.dispose();
      this.#mesh = null;
    }

    clearInterval(this.#loopId);
    this.#isActive = false;
  }
}
