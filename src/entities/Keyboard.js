import Key from "./Key";

export default class Keyboard {
  #keyboardLayout;

  constructor(keyboardLayout) {
    this.#keyboardLayout = keyboardLayout;
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
    let tileSize = canvas.width / 15;

    if (tileSize > 80) {
      tileSize = 80;
    } else if (tileSize < 30) {
      tileSize = 30;
    }

    this.#keyboardLayout.forEach((key) => {
      key.tileSize = tileSize;
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
    let tileSize = Math.round(canvas.width / 15);

    if (tileSize > 80) {
      tileSize = 80;
    } else if (tileSize < 30) {
      tileSize = 30;
    }

    return new Keyboard(
      keyboardLayout.map(
        (tile) => new Key(tile.key, tile.x, tile.y, tile.isPressed, tileSize),
      ),
    );
  }
  getTilePixels(tileX, tileY) {
    const size = this.tileSize || 60;
    const spacing = 10;
    const margin = 50;

    return {
      x: tileX * (size + spacing) + margin,
      y: tileY * (size + 8) + margin,
    };
  }
}
