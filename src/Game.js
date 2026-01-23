import { KEYBOARD_LAYOUT } from "../Keyboard.js";

export default class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.tileSize = 60;
  }

  drawKeyboard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    KEYBOARD_LAYOUT.forEach((tile) => {
      const posX = tile.x * (this.tileSize + 10) + 50;
      const posY = tile.y * (this.tileSize + 5) + 50;
      const depth = 6;

      this.ctx.fillStyle = "#555";
      this.ctx.fillRect(posX, posY, this.tileSize, this.tileSize + depth);

      this.ctx.fillStyle = "#eee";
      this.ctx.fillRect(posX, posY, this.tileSize, this.tileSize);

      this.ctx.strokeStyle = "#999";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(posX, posY, this.tileSize, this.tileSize);

      this.ctx.fillStyle = "#333";
      this.ctx.font = "bold 20px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        tile.key,
        posX + this.tileSize / 2,
        posY + this.tileSize / 2 + 7,
      );
    });
  }
}
