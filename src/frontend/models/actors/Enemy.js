import Actor from "../Actor";
import * as THREE from "three";

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
    const geoWidth = 1 * 3.2 * 0.9;
    const geoHeight = 1 * 3.2 * 0.9;
    this.bonkSound = new Audio("../../public/assets/sounds/bonk.wav");
    this.bonkSound.volume = 0.5;
    const geometry = new THREE.PlaneGeometry(geoWidth, geoHeight);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(position.x * 3.2, 1.2, position.y * 3.2);
    this.mesh.rotation.x = -Math.PI / 2;

    scene.add(this.mesh);

    this.#damage = 5;
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
      this.#path.shift();
    }
  }

  update() {
    // Si on n'a pas de cible, on ne fait rien
    console.log(this.#targetedPosition);
    if (!this.#targetedPosition) return;

    const dx = this.#targetedPosition.x - this.position.x;
    const dy = this.#targetedPosition.y - this.position.y;

    // Utilise une valeur par défaut pour speed si elle est undefined
    const moveSpeed = this.speed || 0.05;

    this.position.x += dx * moveSpeed;
    this.position.y += dy * moveSpeed;

    // Mise à jour de la position du Mesh Three.js pour qu'il suive
    if (this.mesh) {
      this.mesh.position.x = this.position.x * 3.2;
      this.mesh.position.z = this.position.y * 3.2; // Rappel: Y au sol = Z dans Three.js
    }

    // On snap la position si on est très proche pour éviter les tremblements
    if (Math.abs(dx) < 0.1) this.position.x = this.#targetedPosition.x;
    if (Math.abs(dy) < 0.1) this.position.y = this.#targetedPosition.y;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      this.model = this.modelIdle;
    } else {
      this.model = this.modelMove;
    }
  }
}
