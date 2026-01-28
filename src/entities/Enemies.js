import { GLTFLoader } from "three/examples/jsm/Addons.js";
import NodeAStar from "../utilities/NodeAStar";
import Boss from "./Boss";

const loader = new GLTFLoader();

export default class Enemies {
  #aStarGrid;
  #container;
  #boss;

  constructor(keyboardLayout, boss) {
    this.#aStarGrid = new Map();
    this.#container = [];

    this.#boss = boss;
    this.#container.push(this.#boss);

    for (const key of keyboardLayout) {
      const position = { x: key.x, y: key.y };

      this.#aStarGrid.set(
        key.key,
        new NodeAStar(
          key.key,
          position,
          findNeighbours(key.key, key.rawPosition, keyboardLayout),
        ),
      );
    }

    for (const key of this.#aStarGrid.values()) {
      for (let i = 0; i < key.neighbours.length; i++) {
        key.neighbours[i] = this.#aStarGrid.get(key.neighbours[i]);
      }
    }
  }

  get grid() {
    return this.#aStarGrid;
  }
  get container() {
    return this.#container;
  }
  get boss() {
    return this.#boss;
  }

  //! TODO add/remove enemy
  add() {}
  remove() {}

  draw(ctx) {
    for (const enemy of this.#container) {
      enemy.draw(ctx);
    }
  }

  findClosestEnemy(playerPos) {
    if (this.#container.length > 0) {
      const first = this.#container[0];
      let closestEnemy = {
        instance: first,
        dist: Math.sqrt(
          (playerPos.x - first.x) ** 2 + (playerPos.y - first.y) ** 2,
        ),
      };

      for (let i = 1; i < this.#container.length; i++) {
        const enemy = this.#container[i];
        const dist = Math.sqrt(
          (playerPos.x - enemy.x) ** 2 + (playerPos.y - enemy.y) ** 2,
        );

        if (dist < closestEnemy.dist) {
          closestEnemy = { instance: enemy, dist };
        }
      }

      return closestEnemy;
    }

    return false;
  }

  static async init(keyboardLayout, scene, fireballModel) {
    //* boss start
    const bossRawPosition = { x: 5, y: -2 };

    const bossModel = await loader.loadAsync(
      "../public/assets/yameter.glb",
      (bossGltf) => bossGltf,
    );

    const spacing = 3.2;
    const boss = new Boss(
      "Octopus",
      500,
      bossRawPosition,
      {
        x: bossRawPosition.x,
        y: bossRawPosition.y,
        z: bossRawPosition.z,
      },
      { width: 2, height: 2 },
      scene,
      fireballModel,
      bossModel,
    );

    //? set the mesh position
    boss.mesh.position.set(boss.x, 0, boss.y);
    //* boss end

    return new Enemies(keyboardLayout, boss);
  }
}

function findNeighbours(keyTargetedName, position, keyboardLayout) {
  const neighbours = [];

  for (const key of keyboardLayout) {
    if (keyTargetedName !== key.key) {
      if (
        position.x - 1 <= key.rawPosition.x &&
        key.rawPosition.x <= position.x + 1
      ) {
        if (
          position.y - 1 <= key.rawPosition.y &&
          key.rawPosition.y <= position.y + 1
        ) {
          neighbours.push(key.key);
        }
      }
    }
  }

  return neighbours;
}
