import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import DamageObject from "./DamageObject.js";

export default class Projectile extends DamageObject {
  constructor(
    position,
    size,
    damage,
    velocity,
    scene,
    team = "player",
    spacing = 3.2,
    modelSource,
  ) {
    super(position, size, damage);
    this.velocity = velocity;
    this.team = team;
    this.spacing = spacing;

    this.mesh = new THREE.Group();
    scene.add(this.mesh);

    if (modelSource) {
      const model = modelSource.clone();
      model.visible = true;
      model.traverse((child) => {
        child.visible = true;
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0xff6600);
          child.material.emissiveIntensity = 5;
        }
      });
      model.scale.set(0.5, 0.5, 0.5);
      this.mesh.add(model);
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.emissive = new THREE.Color(0xff4400);
          child.material.emissiveIntensity = 2;
        }
      });
    } else console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  }

  update(deltaTime) {
    //if (!deltaTime) deltaTime = 16;
    //const dt = deltaTime && deltaTime > 0 ? deltaTime : 16.6;

    this.position.x += this.velocity.x * 1; //(dt / 16.6);
    this.position.y += this.velocity.y * 1; //(dt / 16.6);

    if (this.mesh) {
      this.mesh.position.set(
        this.position.x * this.spacing,
        1.5,
        this.position.y * this.spacing,
      );

      this.mesh.rotation.x += 0.1;
      this.mesh.rotation.z += 0.1;
    }

    if (Math.abs(this.position.x) > 50 || Math.abs(this.position.y) > 50) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    if (this.mesh && this.mesh.parent) {
      this.mesh.parent.remove(this.mesh);
    }
  }

  draw(ctx) {}
}
