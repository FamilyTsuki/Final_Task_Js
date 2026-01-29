import Spell from "../Spell";
import * as THREE from "three";

export default class HealSpell extends Spell {
  #healAmount;

  constructor(word, healAmount, range = Infinity) {
    super(word, healAmount, range);
    this.#healAmount = healAmount;
  }

  effect(closestEnemy, player, scene) {
    if (player) {
      if (player.hp < 100) {
        player.hp += this.#healAmount;
        if (player.hp > 100) {
          player.hp = 100;
        }
        const heal = new Audio("../../../../public/assets/sounds/heal.wav");
        heal.volume = 0.5;
        heal.play();
        this.triggerVisualEffect(player, scene);
      }
      return true;
    }
    return false;
  }

  triggerVisualEffect(player, scene) {
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
      wireframe: true,
    });

    const sphere = new THREE.Mesh(geometry, material);

    const spacing = 3.2;
    sphere.position.set(
      player.position.x * spacing,
      1.5,
      player.position.y * spacing,
    );

    scene.add(sphere);

    let scale = 1;
    let opacity = 0.5;

    const animateHeal = () => {
      scale += 0.05;
      opacity -= 0.02;

      sphere.scale.set(scale, scale, scale);
      material.opacity = opacity;

      if (opacity > 0) {
        requestAnimationFrame(animateHeal);
      } else {
        scene.remove(sphere);
        geometry.dispose();
        material.dispose();
      }
    };

    animateHeal();
  }
}
