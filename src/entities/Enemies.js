import NodeAStar from "../utilities/NodeAStar";

class Enemies {
  #aStarGrid;
  constructor(KEYBOARD) {
    this.#aStarGrid = new Map();

    for (let i = 0; i < KEYBOARD.length; i++) {
      const position = { x: KEYBOARD[i].x, y: KEYBOARD[i].y };
      this.#aStarGrid.set(
        KEYBOARD[i].key,
        new NodeAStar(
          KEYBOARD[i].key,
          position,
          findNeighbours(position, KEYBOARD),
        ),
      );
    }
  }
}
