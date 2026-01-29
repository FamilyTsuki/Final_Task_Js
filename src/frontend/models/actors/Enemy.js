import Actor from "../Actor";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default class Enemy extends Actor {
  #damage;
  #actualKey; //? String
  #targetedPosition; //? { x: Number, y: Number }
  #path; //? [Key, Key, ...]

  constructor(
    scene,
    position,
    hp = 100,
    hpMax = 100,
    model = undefined,
    size = { width: 40, height: 40 },
    id = crypto.randomUUID(),
  ) {
    super(id, hp, hpMax, position, position, size, model);
    this.#actualKey = "M";
    this.#path = [];
    this.#targetedPosition = { x: position.x, y: position.y };
    this.speed = 0.05;

    this.bonkSound = new Audio("../../public/assets/sounds/bonk.wav");
    this.bonkSound.volume = 0.5;

    this.#damage = 5;

    this.mesh = new THREE.Group();
    this.scene = scene;
    scene.add(this.mesh);
    this.model = null;
    const loader = new GLTFLoader();
    loader.load("./assets/bug.glb", (gltf) => {
      this.model = gltf.scene;
      this.model.scale.set(1.3, 1.3, 1.3);

      this.model.position.y = 0.6;

      this.mesh.add(this.model);
    });
    this.elVignette = document.getElementById("damage-vignette");
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
    if (this.#path.length > 0) {
      this.#targetedPosition = this.#path[0].rawPosition;
      this.#actualKey = this.#path.keys;
      this.#path.shift();
    }
  }

  update() {
    if (!this.#targetedPosition) return;

    const dx = this.#targetedPosition.x - this.position.x;
    const dy = this.#targetedPosition.y - this.position.y;

    this.position.x += dx * this.speed;
    this.position.y += dy * this.speed;

    if (this.mesh && this.model) {
      this.mesh.position.set(this.x * 3.3, 0, this.y * 3.3);
    }
  }
}
