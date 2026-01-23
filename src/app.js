import "./style.css";

let etat = "play";
const page_game = document.getElementById("game-screen");
console.log(page_game);
if (etat == "play") {
  page_game.classList.remove("screen_hidden");
}
