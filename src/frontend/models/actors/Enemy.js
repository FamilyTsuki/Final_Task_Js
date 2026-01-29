import Actor from "../Actor";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default class Enemy extends Actor {
  #damage;
  #actualKey; //? String
  #targetedPosition; //? { x: Number, y: Number }
  #path; //? [Key, Key, ...]

  constructor(
    actualKey,
    scene,
    position,
    hp = 100,
    hpMax = 100,
    model = undefined,
    size = { width: 40, height: 40 },
    id = crypto.randomUUID(),
  ) {
    super(id, hp, hpMax, position, position, size, model);
    this.#actualKey = actualKey;
    this.#path = [];
    this.#targetedPosition = { x: position.x, y: position.y };
    this.speed = 0.05;
    this.startJumpPos = { x: position.x, y: position.y };
    this.totalJumpDist = 0;
    this.speed = 0.05;
    this.mesh = new THREE.Group();
    this.scene = scene;
    this.isJumping = false;
    scene.add(this.mesh);

    const textureLoader = new THREE.TextureLoader();
    const bugTexture = textureLoader.load("./assets/bug.png");
    bugTexture.flipY = false;
    bugTexture.colorSpace = THREE.SRGBColorSpace;
    const loader = new GLTFLoader();
    loader.load("./assets/bug.glb", (gltf) => {
      this.model = gltf.scene;
      this.model.scale.set(1.3, 1.3, 1.3);

      this.model.rotation.y = Math.PI / 2;
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshLambertMaterial({
            color: 0x00ff00,
          });

          child.material.needsUpdate = true;
        }
      });

      this.mesh.add(this.model);
    });
  }

  get isDead() {
    return this.hp <= 0 || this.hp === undefined;
  }
  get actualKey() {
    return this.#actualKey;
  }
  get path() {
    return this.#path;
  }
  set path(path) {
    this.#path = path;
  }

  attack(player) {
    if (!player) {
      throw new Error("No player !");
    }
    player.hp -= this.#damage;
  }

  move() {
    if (this.isJumping) return;

    if (this.#path.length > 0) {
      this.isJumping = true;
      this.startJumpPos = { x: this.position.x, y: this.position.y };

      this.#targetedPosition = this.#path[0].rawPosition;
      this.#actualKey = this.#path[0].key;
      this.#path.shift();

      const dx = this.#targetedPosition.x - this.startJumpPos.x;
      const dy = this.#targetedPosition.y - this.startJumpPos.y;
      this.totalJumpDist = Math.sqrt(dx * dx + dy * dy);
    }
  }

  update(player) {
    if (!this.#targetedPosition) return;

    const dx = this.#targetedPosition.x - this.position.x;
    const dy = this.#targetedPosition.y - this.position.y;
    const currentDist = Math.sqrt(dx * dx + dy * dy);

    this.position.x += dx * this.speed;
    this.position.y += dy * this.speed;

    if (this.mesh) {
      const spacing = 3.2;
      this.mesh.position.set(
        this.position.x * spacing,
        0,
        this.position.y * spacing,
      );

      if (currentDist > 0.05) {
        const targetWorldX = this.#targetedPosition.x * spacing;
        const targetWorldZ = this.#targetedPosition.y * spacing;
        this.mesh.lookAt(targetWorldX, 0, targetWorldZ);
      }

      if (this.isJumping) {
        let progression =
          this.totalJumpDist > 0 ? 1 - currentDist / this.totalJumpDist : 1;
        progression = Math.max(0, Math.min(1, progression));

        const jumpAmplitude = 1.5;

        if (this.model) {
          this.model.position.y =
            1.6 + Math.sin(progression * Math.PI) * jumpAmplitude;
        }

        if (currentDist < 0.05) {
          this.isJumping = false;
          if (this.model) this.model.position.y = 1.6;
          this.position.x = this.#targetedPosition.x;
          this.position.y = this.#targetedPosition.y;
          this.totalJumpDist = 0;
        }
      }
    }
    if (this.checkCollision(player)) {
      this.hp = -1;
      player.damage(50);
      this.die();
    }
  }
  die() {
    if (this.mesh && this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
      this.mesh.visible = false;
    }
  }
}
