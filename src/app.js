import "./style.css";
import Game from "./Game.js";
import Player from "./entities/Player.js";
import { KEYBOARD_LAYOUT } from "./backend/KEYBOARD.js";
import Stocage from "./Storage.js";
import Boss from "./entities/Boss.js";

const CONFIG = {
  player: {
    name: "Héros",
    imgSrc: "./assets/player.jpg",
    startPos: { x: 50, y: 50 },
    size: { width: 40, height: 40 },
  },
  projectile: {
    imgSrc: "./assets/fireball.png",
    size: { width: 20, height: 20 },
    speed: 5,
  },
};

let myGame, player, boss, myStocage;
let canvas, ctx;
let score = 0,
  time = 0;
let projectiles = [],
  bonks = [];
let GLoop, TLoop, SLoop;

let elScore, elTimer, elCurrentWord, elPlayerHp, elGameScreen, elGameOverScreen;

const formatTime = (t) => {
  const ms = t % 100;
  const totalSeconds = Math.floor(t / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(2, "0")}`;
};

const init = () => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");

  elScore = document.getElementById("current-score");
  elTimer = document.getElementById("timer");
  elCurrentWord = document.getElementById("currentWord");
  elPlayerHp = document.getElementById("player-health");
  elGameScreen = document.getElementById("game-screen");
  elGameOverScreen = document.getElementById("game-over-screen");

  myStocage = new Stocage();
  myStocage.init();
  myGame = new Game(KEYBOARD_LAYOUT);

  const playerImg = new Image();
  playerImg.src = CONFIG.player.imgSrc;

  const bossImg = new Image();
  bossImg.src = "./assets/boss.jpg";

  player = new Player(
    CONFIG.player.name,
    100,
    100,
    CONFIG.player.startPos,
    CONFIG.player.size,
    playerImg,
  );

  boss = new Boss(
    "Kraken",
    1000,
    { x: 200, y: 0 },
    { width: 150, height: 150 },
    bossImg,
  );

  const listElement = document.getElementById("spell-list");
  if (listElement) {
    listElement.innerHTML = "";
    player.getWordList().forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      listElement.appendChild(li);
    });
  }

  TLoop = setInterval(() => {
    time += 1;
    if (elTimer) elTimer.textContent = formatTime(time);
  }, 10);

  SLoop = setInterval(() => {
    score += 10;
    if (elScore) elScore.textContent = score;
  }, 1000);

  setupEventListeners();

  GLoop = setInterval(gameLoop, 10);
  elGameScreen?.classList.remove("hidden");
};

const gameLoop = () => {
  if (!ctx || !canvas || !player) return;
  const deltaTime = 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  myGame.keyboardDraw();
  player.update();
  player.draw(ctx);

  if (boss && boss.hp > 0) {
    boss.update(deltaTime, player, projectiles, bonks);
    boss.draw(ctx);
  }

  bonks.forEach((b, index) => {
    b.update(deltaTime, player);
    b.draw(ctx);
    if (b.isDead) bonks.splice(index, 1);
  });

  projectiles.forEach((p) => {
    p.update();
    p.draw(ctx);

    if (!p.isDead) {
      if (p.team === "player" && boss && boss.hp > 0) {
        if (boss.checkCollision(p)) {
          boss.hp -= p.damage;
          p.isDead = true;
        }
      } else if (p.team === "boss") {
        if (player.checkCollision(p)) {
          player.hp -= p.damage;
          p.isDead = true;
        }
      }
    }
  });

  if (elPlayerHp) elPlayerHp.textContent = Math.max(0, player.hp);
  projectiles = projectiles.filter((p) => !p.isDead);
  myStocage.actu(score, time, player);

  if (player.getHp() <= 0) {
    clearInterval(GLoop);
    clearInterval(TLoop);
    clearInterval(SLoop);

    elGameScreen?.classList.add("hidden");
    elGameOverScreen?.classList.remove("hidden");

    document.getElementById("final-time").textContent = formatTime(time);
    document.getElementById("final-score").textContent = score;
    myStocage.clear();
  }
};

const setupEventListeners = () => {
  window.addEventListener("resize", () => myGame.keyboardUpdateSize());

  document
    .getElementById("restart-btn")
    ?.addEventListener("click", () => location.reload());

  window.addEventListener("keydown", (e) => {
    const keyName = e.key.toUpperCase();
    const keyTile = myGame.keyboard.find(keyName);
    if (keyTile) keyTile.isPressed = true;

    if (player) {
      const target = KEYBOARD_LAYOUT.find((t) => t.key === keyName);
      if (target) {
        const coords = myGame.keyboard.getTilePixels(target.x, target.y);
        const currentTileSize = myGame.keyboard.tileSize || 60;
        player.moveTo({
          x: coords.x + currentTileSize / 2 - player.size.width / 2,
          y: coords.y + currentTileSize / 2 - player.size.height / 2,
        });
      }

      const newProj = player.handleKeyPress(e.key);
      if (newProj) projectiles.push(newProj);

      if (elCurrentWord) elCurrentWord.textContent = player.getCurrentWord();
    }
  });

  window.addEventListener("keyup", (e) => {
    const keyTile = myGame.keyboard.find(e.key.toUpperCase());
    if (keyTile) keyTile.isPressed = false;
  });
};

window.addEventListener("DOMContentLoaded", init);
