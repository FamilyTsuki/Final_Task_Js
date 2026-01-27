import NodeAStar from "../utilities/NodeAStar";
import Boss from "./Boss";

const bossImg = new Image();
bossImg.src = "../../assets/boss.jpg";

export default class Enemies {
  #aStarGrid;
  #container;
  #boss;

  constructor(keyboardLayout) {
    this.#aStarGrid = new Map();
    this.#container = [];
    this.#boss = new Boss(
      "Kraken",
      1000,
      { x: 200, y: 0 },
      { width: 150, height: 150 },
      bossImg,
    );
    this.#container.push(this.#boss);

    for (const key of keyboardLayout) {
      const position = { x: key.x, y: key.y };

      this.#aStarGrid.set(
        key.key,
        new NodeAStar(
          key.key,
          position,
          findNeighbours(key.key, key.rawPos, keyboardLayout),
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
      const posFirst = this.#container[0].position;
      let closestEnemy = {
        pos: posFirst,
        dist: Math.sqrt(
          (playerPos.x - posFirst.x) ** 2 + (playerPos.y - posFirst.y) ** 2,
        ),
      };

      for (let i = 1; i < this.#container.length; i++) {
        const posTemp = this.#container[i].position;
        const dist = Math.sqrt(
          (playerPos.x - posTemp.x) ** 2 + (playerPos.y - posTemp.y) ** 2,
        );

        if (dist < closestEnemy.dist) {
          closestEnemy = { pos: posTemp, dist };
        }
      }

      return closestEnemy;
    }

    return false;
  }
}

function findNeighbours(keyTargetedName, position, keyboardLayout) {
  const neighbours = [];

  for (const key of keyboardLayout) {
    if (keyTargetedName !== key.key) {
      if (position.x - 1 <= key.rawPos.x && key.rawPos.x <= position.x + 1) {
        if (position.y - 1 <= key.rawPos.y && key.rawPos.y <= position.y + 1) {
          neighbours.push(key.key);
        }
      }
    }
  }

  return neighbours;
}
