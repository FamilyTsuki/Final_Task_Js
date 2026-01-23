import "./style.css";
import Game from "./Game.js";
import Player from "./entities/Player.js";

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
