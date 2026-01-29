import Spell from "../Spell";
import * as THREE from "three";

export default class FireCircle extends Spell {
  #duration;
  #scene;
  #playerRef;
  #enemiesRef;

  #mesh;
  #timer;
  #isActive;

  /**
   *
   * @param {String} word
   * @param {Number} damage
   * @param {Number} duration
   * @param {Scene} scene
   * @param {Player} playerRef
   * @param {Enemy} enemiesRef
   */
  constructor(word, damage, range, duration, scene, playerRef, enemiesRef) {
    super(word, damage, range);

    this.#duration = duration;
    this.#scene = scene;
    this.#playerRef = playerRef;
    this.#enemiesRef = enemiesRef;

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
      x: this.#playerRef.position.x * 3.2,
      y: this.#playerRef.position.y * 3.2,
    };
    this.#mesh.position.set(playerPosWorld.x, 0.1, playerPosWorld.y);
    this.#scene.add(this.#mesh);

    console.log(`Cercle de Feu activé autour du joueur !`);
    return true;
  }

  /**
   *
   * @param {Number} deltaTime
   */
  update(deltaTime) {
    if (!this.#isActive || !this.#mesh) return;

    this.#timer += deltaTime;

    const playerPosWorld = {
      x: this.#playerRef.position.x * 3.2,
      y: this.#playerRef.position.y * 3.2,
    };
    this.#mesh.position.set(playerPosWorld.x, 0.1, playerPosWorld.y);

    this.#mesh.material.opacity = 0.5 + Math.sin(this.#timer * 0.01) * 0.2;
    this.#mesh.material.color.setHSL(
      Math.sin(this.#timer * 0.005) * 0.1 + 0.08,
      1,
      0.6 + Math.sin(this.#timer * 0.003) * 0.1,
    );

    this.enemiesRef.container.forEach((enemy) => {
      const dist = Math.sqrt(
        (this.#mesh.position.x - enemy.mesh.position.x) ** 2 +
          (this.#mesh.position.z - enemy.mesh.position.z) ** 2,
      );

      if (dist <= this.range * 3.2 && !enemy.isBurning) {
        enemy.damage(this.damage);
        enemy.isBurning = true;
        setTimeout(() => (enemy.isBurning = false), 200);
        console.log(`Ennemi ${enemy.name} brûlé par le Cercle de Feu !`);
      }
    });

    if (this.#timer >= this.#duration) {
      this.deactivate();
    }
  }

  deactivate() {
    if (this.#mesh) {
      this.#scene.remove(this.#mesh);
      this.#mesh.geometry.dispose();
      this.#mesh.material.dispose();
      this.#mesh = null;
    }
    this.#isActive = false;
    console.log("Cercle de Feu désactivé.");
  }
}
