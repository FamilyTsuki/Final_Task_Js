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

    // Mise à jour visuelle (Three.js)
    if (this.mesh) {
      this.mesh.position.x = this.position.x * 3.2;
      this.mesh.position.z = this.position.y * 3.2;
    }

    // SI L'ENNEMI ARRIVE À SA CIBLE (proche de 0)
    if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
      this.position.x = this.#targetedPosition.x;
      this.position.y = this.#targetedPosition.y;

      // IMPORTANT : Trouver sur quelle touche il vient d'arriver
      // On met à jour son #actualKey pour le prochain calcul de chemin
      // Tu peux ajouter une petite fonction pour trouver la clé selon la position
    }
  }
}
