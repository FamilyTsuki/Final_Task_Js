import "./style.css";
import Game from "./Game.js";
import Player from "./entities/Player.js";
import { KEYBOARD_LAYOUT } from "./backend/KEYBOARD.js";
import Stocage from "./Storage.js";
import Bonk from "./entities/Bonk.js";
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

let myGame;
let player;
let canvas, ctx;
let myStocage;
let scord = 0;
let time = 0;
let projectiles = [];
let bonks = [];
let TLoop;
let SLoop;
let boss;
const init = () => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  ctx = canvas.getContext("2d");
  boss = new Boss(
    "Kraken",
    1000,
    { x: 400, y: 50 },
    { width: 150, height: 150 },
    bossImg,
  );
  myStocage = new Stocage();
  myGame = new Game(KEYBOARD_LAYOUT);
  myStocage.init();
  const playerImg = new Image();
  playerImg.src = CONFIG.player.imgSrc;
  let projectileImg = new Image();
  projectileImg.src = CONFIG.projectile.imgSrc;
  player = new Player(
    CONFIG.player.name,
    100,
    100,
    CONFIG.player.startPos,
    CONFIG.player.size,
    playerImg,
  );
  const current_score = document.getElementById("current-score");

  let actu_scord = (nombre) => {
    scord += nombre;
    current_score.textContent = scord;
  };
  const page_game = document.getElementById("game-screen");
  page_game?.classList.remove("hidden");
  const game_over_screen = document.getElementById("game-over-screen");
  //game_over_screen?.classList.remove("hidden");

  const timer_html = document.getElementById("timer");

  const listElement = document.getElementById("spell-list");

  const words = player.getWordList();

  for (let i = 0; i < words.length; i++) {
    const li = document.createElement("li");
    li.textContent = words[i];
    listElement.appendChild(li);
  }
  TLoop = setInterval(() => {
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
  let SLoop = setInterval(() => {
    actu_scord(10);
  }, 1000);

  setupEventListeners();
};

const gameLoop = () => {
  if (!ctx || !canvas) return;
  const deltaTime = 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  myGame.keyboardDraw();

  if (player) {
    player.update();
    player.draw(ctx);
  }
  projectiles.forEach((p, index) => {
    p.update();
    p.draw(ctx);
  });
  bonks.forEach((b, index) => {
    b.update(deltaTime, player);
    b.draw(ctx);
    if (b.isDead) bonks.splice(index, 1);
  });

  projectiles = projectiles.filter((p) => !p.isDead);
  myStocage.actu(scord, time, player);
  if (boss) {
    boss.update(deltaTime, player, projectiles, bonks);
    boss.draw(ctx);
    projectiles.forEach((p) => {
      if (!p.isDead && boss.checkCollision(p)) {
        boss.hp -= p.damage;
        p.isDead = true;
        console.log("Boss HP:", boss.hp);
      }
    });
  }
  if (player.getHp() <= 0) {
    clearInterval(GLoop);
    clearInterval(TLoop);
    clearInterval(SLoop);
    const page_game = document.getElementById("game-screen");
    page_game?.classList.add("hidden");
    const game_over_screen = document.getElementById("game-over-screen");
    game_over_screen?.classList.remove("hidden");
    const final_time = document.getElementById("final-time");

    final_time.textContent = time;
    const final_score = document.getElementById("final-score");
    final_score.textContent = scord;
    myStocage.clear();
  }
};
setInterval(() => {
  if (player) {
    bonks.push(
      new Bonk(
        { x: 200, y: player.position.y - 20 },
        { width: 180, height: 600 },
        20,
      ),
    );
  }
}, 3000);
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

    if (player) {
      if (target) {
        const coords = myGame.keyboard.getTilePixels(target.x, target.y);
        const currentTileSize = myGame.keyboard.tileSize || 60;
        const newPos = {
          x: coords.x + currentTileSize / 2 - player.size.width / 2,
          y: coords.y + currentTileSize / 2 - player.size.height / 2,
        };
        player.moveTo(newPos);
      }

      const potentialProjectile = player.handleKeyPress(e.key);

      if (potentialProjectile) {
        projectiles.push(potentialProjectile);
      }

      const currentWordDisplay = document.getElementById("currentWord");
      if (currentWordDisplay) {
        currentWordDisplay.textContent = player.getCurrentWord();
      }
    }
  });

  window.addEventListener("keyup", (e) => {
    const keyTile = myGame.keyboard.find(e.key.toUpperCase());
    if (keyTile) keyTile.isPressed = false;
  });
};
let GLoop = setInterval(gameLoop, 10);
window.addEventListener("DOMContentLoaded", init);
