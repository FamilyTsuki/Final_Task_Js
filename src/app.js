import "./style.css";
import Game from "./Game.js";
import Player from "./entities/Player.js";
import { KEYBOARD_LAYOUT } from "./backend/KEYBOARD.js";

const myGame = new Game(KEYBOARD_LAYOUT);
myGame.keyboardDraw();

let etat = "play";
const page_game = document.getElementById("game-screen");
if (etat == "play") {
  page_game.classList.remove("hidden");
}

window.addEventListener("resize", () => {
  myGame.keyboardUpdateSize();
  myGame.keyboardDraw();
});

window.addEventListener("keydown", (event) => {
  const keyPressed = event.key.toUpperCase();
  const key = myGame.keyboard.find(keyPressed);

  if (key) {
    key.isPressed = true;
    myGame.keyboardDraw();
  }
});

window.addEventListener("keyup", (event) => {
  const keyPressed = event.key.toUpperCase();
  const key = myGame.keyboard.find(keyPressed);

  if (key) {
    key.isPressed = false;
    myGame.keyboardDraw();
  }
});
