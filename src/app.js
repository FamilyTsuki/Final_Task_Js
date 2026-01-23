import "./style.css";
import Game from "./Game.js";
import Player from "./entities/Player.js";
import { KEYBOARD_LAYOUT } from "./Keyboard.js";

const myGame = new Game();
myGame.canvas.width = window.innerWidth;
myGame.canvas.height = window.innerHeight;
myGame.drawKeyboard();

let etat = "play";
const page_game = document.getElementById("game-screen");
console.log(page_game);
if (etat == "play") {
  page_game.classList.remove("hidden");
}

window.addEventListener("resize", () => {
  myGame.updateSize();
  myGame.drawKeyboard();
});

window.addEventListener("keydown", (event) => {
  const keyPressed = event.key.toUpperCase();

  const tile = KEYBOARD_LAYOUT.find((t) => t.key === keyPressed);

  if (tile) {
    tile.isPressed = true;
    myGame.drawKeyboard();
  }
});

window.addEventListener("keyup", (event) => {
  const keyPressed = event.key.toUpperCase();
  const tile = KEYBOARD_LAYOUT.find((t) => t.key === keyPressed);

  if (tile) {
    tile.isPressed = false;
    myGame.drawKeyboard();
  }
});
