import { KEYBOARD_LAYOUT } from "../Keyboard.js";

export default class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.tileSize = 60;
  }

  drawKeyboard() {
    console.log("Dessin du clavier...");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    KEYBOARD_LAYOUT.forEach((tile) => {
      const posX = tile.x * this.tileSize;
      const posY = tile.y * this.tileSize;
      this.ctx.strokeStyle = "white";
      this.ctx.strokeRect(posX, posY, this.tileSize, this.tileSize);
      this.ctx.fillStyle = "white";
      this.ctx.font = "20px Arial";
      this.ctx.fillText(tile.key, posX + 20, posY + 35);
    });
  }
}
