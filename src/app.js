import "./style.css";
import Game from "./Game.js";
import Player from "./entities/Player.js";
import { KEYBOARD_LAYOUT } from "./backend/KEYBOARD.js";

const CONFIG = {
  player: {
    name: "Héros",
    color: "#00FF00",
    startPos: { x: 50, y: 50 },
    size: { width: 40, height: 40 },
  },
};

let myGame, player, canvas, ctx;
let gameStatus = "play";

const init = () => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) {
    console.error("Canvas introuvable !");
    return;
  }
  ctx = canvas.getContext("2d");

  myGame = new Game(KEYBOARD_LAYOUT);

  player = new Player(
    CONFIG.player.name,
    100,
    100,
    CONFIG.player.startPos,
    CONFIG.player.size,
    CONFIG.player.color,
  );

  handleScreens();
  setupEventListeners();
  requestAnimationFrame(gameLoop);
};

const gameLoop = () => {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  myGame.keyboardDraw();

  if (player) {
    player.draw(ctx);
  }

  requestAnimationFrame(gameLoop);
};

const handleScreens = () => {
  const pageGame = document.getElementById("game-screen");
  if (gameStatus === "play") {
    pageGame?.classList.remove("hidden");
  }
};

const setupEventListeners = () => {
  window.addEventListener("resize", () => {
    myGame.keyboardUpdateSize();
  });

  window.addEventListener("keydown", (e) => {
    const keyName = e.key.toUpperCase();

    const keyTile = myGame.keyboard.find(keyName);
    if (keyTile) keyTile.isPressed = true;

    const target = KEYBOARD_LAYOUT.find((t) => t.key === keyName);

    if (target) {
      const keyboard = myGame.keyboard;
      const coords = keyboard.getTilePixels(target.x, target.y);

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
