import Key from "./Key";

export default class Keyboard {
  #keyboardLayout;
  tileSize;

  constructor(keyboardLayout, tileSize) {
    this.#keyboardLayout = keyboardLayout;
    this.tileSize = tileSize;
  }

  get keyboardLayout() {
    return this.#keyboardLayout;
  }

  draw(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.#keyboardLayout.forEach((key) => {
      key.draw(ctx);
    });
  }

  updateSize(canvas) {
    let newTileSize = canvas.width / 15;
    if (newTileSize > 80) newTileSize = 80;
    if (newTileSize < 30) newTileSize = 30;

    this.tileSize = newTileSize; // On met à jour la valeur de la classe

    this.#keyboardLayout.forEach((key) => {
      key.tileSize = newTileSize;
    });
  }

  find(keyToFind) {
    const keyFind = this.#keyboardLayout.find((key) => key.key === keyToFind);

    if (!keyFind) {
      return false;
    }

    return keyFind;
  }

  //? canvas: HTMLCanvasElement
  //? keyboardLayout: "raw KEYBOARD_LAYOUT"

  static init(canvas, keyboardLayout) {
    let initialSize = Math.round(canvas.width / 15);
    if (initialSize > 80) initialSize = 80;
    if (initialSize < 30) initialSize = 30;

    return new Keyboard(
      keyboardLayout.map(
        (tile) =>
          new Key(tile.key, tile.x, tile.y, tile.isPressed, initialSize),
      ),
      initialSize,
    );
  }
  getTilePixels(tileX, tileY) {
    const spacing = 10;
    const margin = 50;

    return {
      x: tileX * (this.tileSize + spacing) + margin,
      y: tileY * (this.tileSize + 5) + margin,
    };
  }
}
