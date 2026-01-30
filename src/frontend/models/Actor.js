import GameObject from "./GameObject";
import * as THREE from "three";

export default class Actor extends GameObject {
  name;
  hp;
  hpMax;
  size;
  mesh; //? mesh 3d
  model; //? model 3d

  /**
   *
   * @param {String} name
   * @param {Number} hp
   * @param {Number} hpMax
   * @param {Object} rawPosition = {x: Number, y: Number}
   * @param {Object} position = {x: Number, y: Number}
   * @param {Object} size = {width: Number, height: Number}
   */
  constructor(name, hp, hpMax, rawPosition, position, size) {
    super(rawPosition, position);

    this.name = name;
    this.hp = hp;
    this.hpMax = hpMax;
    this.size = size;
    this.mesh = new THREE.Group();
  }

  isAlive() {
    return this.hp > 0;
  }

  attack(actor) {
    console.log(`${this.name} attacking ${actor.name}`);
  }

  move() {}

  checkCollision(other) {
    const collision =
      this.position.x < other.position.x + other.size.width &&
      this.position.x + this.size.width > other.position.x &&
      this.position.y < other.position.y + other.size.height &&
      this.position.y + this.size.height > other.position.y;

    return collision;
  }
}
