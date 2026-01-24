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

  window.addEventListener("keydown", (e) => {
    const keyName = e.key.toUpperCase();

    const keyTile = myGame.keyboard.find(keyName);
    if (keyTile) keyTile.isPressed = true;

    const target = KEYBOARD_LAYOUT.find((t) => t.key === keyName);

    if (target) {
      const keyboard = myGame.keyboard;
      const coords = keyboard.getTilePixels(target.x, target.y);
      console.log("Target coords:", coords);
      const currentTileSize = keyboard.tileSize || 60;
      const playerWidth = player.size?.width || 40;
      const playerHeight = player.size?.height || 40;

      const newPos = {
        x: coords.x + currentTileSize / 2 - playerWidth / 2,
        y: coords.y + currentTileSize / 2 - playerHeight / 2,
      };

      console.log("Coords:", coords, "TileSize:", currentTileSize);
      player.moveTo(newPos);
    }
  });

  window.addEventListener("keyup", (e) => {
    const keyTile = myGame.keyboard.find(e.key.toUpperCase());
    if (keyTile) keyTile.isPressed = false;
  });
};

window.addEventListener("DOMContentLoaded", init);
