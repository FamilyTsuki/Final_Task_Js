import findBestPath from "../utilities/aStar";
import NodeAStar from "../utilities/NodeAStar";

export default class Enemies {
  #aStarGrid;
  #container;

  constructor(keyboardLayout) {
    this.#aStarGrid = new Map();
    this.#container = [];

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

  //! TODO add/remove enemy
  add() {}
  remove() {}

  testAStar() {
    console.log(findBestPath("C", "U", this.#aStarGrid));
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
