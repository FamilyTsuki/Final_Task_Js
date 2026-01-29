import { GLTFLoader } from "three/examples/jsm/Addons.js";
import NodeAStar from "../utilities/NodeAStar";
import Boss from "../models/Boss";
import Enemy from "../models/actors/Enemy";
import findBestPath from "../utilities/aStar";

const loader = new GLTFLoader();

export default class Enemies {
  #aStarGrid;
  #container;
  #boss;
  #enemyModel;
  #fireBallModel;

  constructor(keyboardLayout, enemyModel, fireballModel) {
    this.#aStarGrid = new Map();
    this.#container = [];
    this.#enemyModel = enemyModel;
    this.#fireBallModel = fireballModel;

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
      this.boss;
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

  add(position) {
    console.error("here");
    this.#container.push(new Enemy(position, 50, 50, this.#enemyModel));
    enemy_alive += 1;
  }
  clearDead() {
    this.#container = this.#container.filter((enemy) => !enemy.isDead);
  }

  die() {
    if (this.mesh && this.mesh.parent) {
        this.mesh.parent.remove(this.mesh);
        this.mesh.visible = false;
      }
  } 
  /**
   *
   * @param {Object} playerPos = {x: Number, y: Number}
   * @param {Array} projectiles
   * @param {Array} bonks
   */
  update(playerPos, projectiles, bonks) {
    for (const enemy of this.#container) {
      if (enemy !== this.#boss) {
        enemy.update();
      }
    }
    if (this.#boss) {
      this.#boss.update(10, playerPos, projectiles, bonks);
    }
  }

  move() {
    for (const enemy of this.#container) {
      enemy.move();
    }
  }

  /**
   *
   * @param {String} playerKey
   */
  updatePath(playerKey, keyboard) {
    for (const enemy of this.#container) {
      if (enemy !== this.#boss) {
        const path = findBestPath(
          enemy.actualKey,
          playerKey,
          this.#aStarGrid,
        ).map((keyStr) => keyboard.find(keyStr));
        enemy.path = path;
        enemy.move();
      }
    }
  }

  /**
   *
   * @param {Object} playerPos = {x: Number, y: Number}
   */
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

  spawnAt(x, y, scene) {
    //TODO ajouter la mecanique de creation de l'enemi
    const enemy = new Enemy(scene, { x, y }, 50, 50, this.#enemyModel.clone());

    this.#container.push(enemy);

    return enemy;
  }

  async spawnBoss(scene) {
    const bossRawPosition = { x: 5, y: -2 };

    const bossModel = await loader.loadAsync(
      "../public/assets/yameter.glb",
      (bossGltf) => bossGltf,
    );

    this.#boss = new Boss(
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
      this.#fireBallModel,
      bossModel,
    );
    this.#container.push(this.#boss);

    //? set the mesh position
    this.boss.mesh.position.set(this.boss.x, 0, this.boss.y);
  }
  updatePath(playerKey, keyboard) {
    for (const enemy of this.#container) {
      if (enemy !== this.#boss && !enemy.isDead) {
        // 1. Calculer le chemin de l'ennemi vers le joueur
        const pathKeys = findBestPath(
          enemy.actualKey, // Départ (ex: 'M')
          playerKey, // Arrivée (ex: 'Q')
          this.#aStarGrid, // La grille de noeuds
        );

        if (pathKeys) {
          // 2. Transformer les clés ('Q', 'S') en données de touches réelles
          // On récupère l'objet touche complet du clavier pour avoir .rawPosition
          enemy.path = pathKeys.map((keyStr) => keyboard.find(keyStr));

          // 3. Dire à l'ennemi de commencer à se diriger vers la première étape
          enemy.move();
        }
      }
    }
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
