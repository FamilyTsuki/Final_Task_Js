import { KEYBOARD_LAYOUT } from "./Keyboard.js";

export default class Game {
  constructor() {
    this.canvas = document.getElementById("game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.updateSize();
  }

  updateSize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.tileSize = this.canvas.width / 15;

    if (this.tileSize > 80) {
      this.tileSize = 80;
    }
    if (this.tileSize < 30) {
      this.tileSize = 30;
    }
  }
  drawKeyboard() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    KEYBOARD_LAYOUT.forEach((tile) => {
      const posX = tile.x * (this.tileSize + 10) + 50;
      const posY = tile.y * (this.tileSize + 5) + 50;
      const depth = 6;

      const offset = tile.isPressed ? 3 : 0;

      this.ctx.fillStyle = tile.isPressed ? "#b56500" : "#555";
      this.ctx.fillRect(posX, posY, this.tileSize, this.tileSize + depth);

      this.ctx.fillStyle = tile.isPressed ? "#FF9800" : "#eee";
      this.ctx.fillRect(posX, posY + offset, this.tileSize, this.tileSize);

      this.ctx.strokeStyle = tile.isPressed ? "#e68a00" : "#999";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(posX, posY + offset, this.tileSize, this.tileSize);

      this.ctx.fillStyle = tile.isPressed ? "white" : "#333";
      this.ctx.font = "bold 20px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        tile.key,
        posX + this.tileSize / 2,
        posY + this.tileSize / 2 + 7 + offset,
      );
    });
  }
}
