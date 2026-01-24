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

let myGame;
let player;
let canvas, ctx;

const init = () => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
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

  const page_game = document.getElementById("game-screen");
  page_game?.classList.remove("hidden");

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

const setupEventListeners = () => {
  window.addEventListener("resize", () => {
    myGame.keyboardUpdateSize();
  });

  window.addEventListener("keydown", (e) => {
    const keyName = e.key.toUpperCase();

    const keyTile = myGame.keyboard.find(keyName);
    if (keyTile) keyTile.isPressed = true;

    const target = KEYBOARD_LAYOUT.find((t) => t.key === keyName);
    if (target && player) {
      const keyboard = myGame.keyboard;
      const coords = keyboard.getTilePixels(target.x, target.y);

      const currentTileSize = keyboard.tileSize || 60;

      const newPos = {
        x: coords.x + currentTileSize / 2 - player.size.width / 2,
        y: coords.y + currentTileSize / 2 - player.size.height / 2,
      };

      player.moveTo(newPos);
    }
  });

  window.addEventListener("keyup", (e) => {
    const keyTile = myGame.keyboard.find(e.key.toUpperCase());
    if (keyTile) keyTile.isPressed = false;
  });
};

window.addEventListener("DOMContentLoaded", init);
