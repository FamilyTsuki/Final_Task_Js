import "./style.css";
import Game from "./Game.js";
import Player from "./entities/Player.js";
import { KEYBOARD_LAYOUT } from "./backend/KEYBOARD.js";

const CONFIG = {
  player: {
    name: "Héros",
    imgSrc: "./assets/player.jpg",
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

  const playerImg = new Image();
  playerImg.src = CONFIG.player.imgSrc;

  player = new Player(
    CONFIG.player.name,
    100,
    100,
    CONFIG.player.startPos,
    CONFIG.player.size,
    playerImg,
  );
  const current_score = document.getElementById("current-score");
  let scord = 0;
  let actu_scord = (nombre) => {
    scord += nombre;
    current_score.textContent = scord;
  };
  const page_game = document.getElementById("game-screen");
  page_game?.classList.remove("hidden");
  const game_over_screen = document.getElementById("game-over-screen");
  //game_over_screen?.classList.remove("hidden");
  let time = 0;
  const timer_html = document.getElementById("timer");

  const listElement = document.getElementById("spell-list");

  const words = player.getWordList();

  for (let i = 0; i < words.length; i++) {
    const li = document.createElement("li");
    li.textContent = words[i];
    listElement.appendChild(li);
  }
  setInterval(() => {
    time += 1;
    let ms = time % 100;
    let totalSeconds = Math.floor(time / 100);
    let seconds = totalSeconds % 60;
    let minutes = Math.floor(totalSeconds / 60);

    if (timer_html) {
      timer_html.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        ":" +
        String(ms).padStart(2, "0");
    }
  }, 10);
  setInterval(() => {
    actu_scord(10);
  }, 1000);

  setupEventListeners();
};

const gameLoop = () => {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  myGame.keyboardDraw();

  if (player) {
    player.update();
    player.draw(ctx);
  }
  if (player.getHp() <= 0) {
    clearInterval(gameLoop);
    page_game?.classList.add("hidden");
    game_over_screen?.classList.remove("hidden");
    const final_time = document.getElementById("final-time");
    final_time.textContent = timer_html;
    const final_score = document.getElementById("final-score");
    final_score.textContent = scord;
  }
};

const setupEventListeners = () => {
  window.addEventListener("resize", () => {
    myGame.keyboardUpdateSize();
  });
  document.getElementById("restart-btn").addEventListener("click", function () {
    location.reload();
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
      if (player) {
        player.handleKeyPress(e.key);
        currentWord.textContent = player.getcurrentWord();
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    const keyTile = myGame.keyboard.find(e.key.toUpperCase());
    if (keyTile) keyTile.isPressed = false;
  });
};
setInterval(gameLoop, 10);
window.addEventListener("DOMContentLoaded", init);
