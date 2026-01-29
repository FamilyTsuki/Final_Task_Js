import "./style.css";
import Game from "./Game.js";
import { KEYBOARD_LAYOUT } from "../backend/KEYBOARD.js";
import Storage from "./Storage.js";
import * as THREE from "three";
import Projectile from "./models/Projectile.js";
import findBestPath from "./utilities/aStar.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const CONFIG = {
  projectile: {
    imgSrc: "../public/assets/fireball.png",
    size: { width: 0.4, height: 0.4 },
    speed: 5,
  },
};

let boss_alive = 1;
let enemy_alive = 1;

let myGame;
let myStorage;
let canvas, renderer;
let score = 0,
  time = 0;
let TLoop, SLoop;
let spawnBosslopp;
let music;
let musicBoss;
let rire;
let spawnBossSound;
let quak;
let elScore, elTimer, elCurrentWord, elPlayerHp, elGameScreen, elGameOverScreen;
let isGameOver = false;
let gameTimer = 0;
let lastSpawnTime = 0;
let bossIsPresent = false;
const SPAWN_INTERVAL = 3000;
const BOSS_SPAWN_DELAY = 45000;
const loader = new GLTFLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
let shakeIntensity = 0;
const shakeDecay = 0.9;

window.startShake = function (intensity) {
  shakeIntensity = intensity;
};
const manageEnemiesLogic = (deltaTime) => {
  if (isGameOver) return;

  gameTimer += deltaTime;

  //TODO add random enemy
  // if (!bossIsPresent && gameTimer - lastSpawnTime > SPAWN_INTERVAL) {
  //   const randomKey = ;

  //   myGame.enemies.spawnAt(randomTile.x, randomTile.y, scene);

  //   lastSpawnTime = gameTimer;
  // }
};
const displayHistory = () => {
  const history = myStorage.getHistory();
  const container = document.getElementById("history-table-body");

  if (!container) return;

  container.innerHTML = "";

  history.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${game.date}</td>
            <td>${game.score}</td>
            <td>${formatTime(game.time)}</td>
        `;
    container.appendChild(row);
  });
};
const formatTime = (t) => {
  const ms = t % 100;
  const totalSeconds = Math.floor(t / 100);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(2, "0")}`;
};
const updateCamera = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  renderer.setSize(width, height);

  const targetWidth = 35;
  const distance = camera.position.distanceTo(new THREE.Vector3(16, 2, 2));

  const fov =
    2 *
    Math.atan(targetWidth / camera.aspect / (2 * distance)) *
    (180 / Math.PI);

  if (camera.aspect < 1.7) {
    camera.fov = Math.max(75, fov);
  } else {
    camera.fov = 75;
  }

  camera.updateProjectionMatrix();
  camera.lookAt(16, 2, 2);
};
const spawnBoss = async () => {
  boss_alive += 1;
  if (myGame) {
    rire.play();
    await myGame.spawnBoss();
    music.pause();
    music.currentTime = 0;
    quak.play();
    setTimeout(() => {
      spawnBossSound.play();
    }, 4000);
    setTimeout(() => {
      musicBoss.play();
    }, 8000);
  }
};
const init = async () => {
  myStorage = new Storage();
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;
  music = new Audio("../public/assets/sounds/music.mp3");
  music.volume = 0.5;
  music.loop = true;
  musicBoss = new Audio("../public/assets/sounds/bossMusic.wav");
  musicBoss.volume = 0.5;
  musicBoss.loop = true;
  rire = new Audio("../public/assets/sounds/rire.wav");
  rire.volume = 0.5;
  spawnBossSound = new Audio("../public/assets/sounds/spawnBoss.mp3");
  spawnBossSound.volume = 0.5;
  quak = new Audio("../public/assets/sounds/quak.wav");
  quak.volume = 0.5;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.set(16, 15, 15);
  camera.lookAt(16, 2, 2);

  elScore = document.getElementById("current-score");
  elTimer = document.getElementById("timer");
  elCurrentWord = document.getElementById("currentWord");
  elPlayerHp = document.getElementById("player-health");
  elGameScreen = document.getElementById("game-screen");
  elGameOverScreen = document.getElementById("game-over-screen");

  myGame = await Game.init(scene, KEYBOARD_LAYOUT);
  myGame.spawnAt("P");
  myGame.enemies.updatePath("P", myGame.keyboard);

  const listElement = document.getElementById("spell-list");
  if (listElement) {
    listElement.textContent = "";
    myGame.player.wordSpells.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      listElement.appendChild(li);
    });
  }

  const startBtn = document.getElementById("start-btn");
  const startScreen = document.getElementById("start-screen");

  startBtn.addEventListener("click", () => {
    music.play().catch((e) => console.log("Audio bloqué par le navigateur"));
    startScreen.classList.add("hidden");
    elGameScreen?.classList.remove("hidden");

    TLoop = setInterval(() => {
      time += 1;
      if (elTimer) elTimer.textContent = formatTime(time);
    }, 10);

    SLoop = setInterval(() => {
      score += 10;
      if (elScore) elScore.textContent = score;
    }, 1000);

    spawnBosslopp = setInterval(() => {
      if (!bossIsPresent) {
        rire.play();
        bossIsPresent = true;
        setTimeout(async () => {
          await spawnBoss();
        }, 4000);
      }
    }, BOSS_SPAWN_DELAY);

    // const WLoop = setInterval(() => {
    //   myGame.spawnWave(5);
    // }, 60000);

    const EMLoop = setInterval(() => {
      if (!myGame) throw new Error("No Game instance");
      myGame.moveEnemies();
    }, 1000);

    gameLoop();
  });

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
  sunLight.position.set(10, 20, 10);
  scene.add(sunLight);
  const fillLight = new THREE.PointLight(0x0088ff, 0.5);
  fillLight.position.set(-10, 10, -10);
  scene.add(fillLight);

  setupEventListeners();
  updateCamera();
};

const gameLoop = () => {
  myGame.update();

  if (isGameOver) return;
  requestAnimationFrame(gameLoop);
  if (!renderer || !myGame.player) return;

  const deltaTime = 10;
  manageEnemiesLogic(deltaTime);
  myGame.player.update();

  if (myGame.player.mesh) {
    const spacing = 3.2;

    const targetX = myGame.player.position.x;
    const targetY = myGame.player.position.y;

    myGame.player.mesh.position.set(targetX * spacing, 1.5, targetY * spacing);
  }
  if (myGame.player && myGame.player.wordSpellsInstances) {
    myGame.player.wordSpellsInstances.forEach((spell) => {
      if (spell.update) {
        spell.update(16.6);
      }
    });
  }
  myGame.bonks.forEach((b, index) => {
    b.update(deltaTime, myGame.player);
    if (b.isDead) myGame.bonks.splice(index, 1);
  });

  myGame.projectiles.forEach((p) => {
    p.update(myGame.player, deltaTime);

    if (!p.isDead) {
      if (p.team === "player") {
        if (myGame.enemies.boss && myGame.enemies.boss.hp > 0) {
          if (myGame.enemies.boss.checkCollision(p)) {
            myGame.enemies.boss.hp -= p.damage;
            myGame.enemies.boss.updateHpBar();
            p.isDead = true;
            p.die();
            if (window.startShake) window.startShake(0.2);
          }
        } else {
          myGame.enemies.container.forEach((enemi) => {
            if (enemi.checkCollision(p)) {
              enemi.takeDamage(p.damage);
              p.die;
            }
          });
        }
      } else if (p.team === "boss") {
        if (myGame.player.checkCollision(p)) {
          myGame.player.damage(p.damage);
          p.isDead = true;
          p.die();
          if (window.startShake) window.startShake(0.2);
        }
      }
    }
  });
  if (myGame && myGame.keyboard) {
    myGame.keyboard.keyboardLayout.forEach((tile) => {
      const isPlayerOnTile =
        Math.abs(myGame.player.position.x - tile.x) < 0.4 &&
        Math.abs(myGame.player.position.y - tile.y) < 0.4;

      tile.isPressed = isPlayerOnTile;
    });

    myGame.keyboard.update();
  }
  if (shakeIntensity > 0.05) {
    camera.position.x += (Math.random() - 0.5) * shakeIntensity;
    camera.position.y += (Math.random() - 0.5) * shakeIntensity;
    shakeIntensity *= shakeDecay;
  } else {
    updateCamera();
  }
  updateCamera();

  if (shakeIntensity > 0.0) {
    camera.position.x += (Math.random() - 0.5) * shakeIntensity;
    camera.position.y += (Math.random() - 0.5) * shakeIntensity;
    camera.position.z += (Math.random() - 0.5) * shakeIntensity;

    shakeIntensity *= shakeDecay;
  }
  if (myGame && myGame.keyboard) {
    myGame.keyboard.update();
  }
  renderer.render(scene, camera);

  if (elPlayerHp) elPlayerHp.textContent = Math.max(0, myGame.player.hp);
  myGame.projectiles = myGame.projectiles.filter((p) => !p.isDead);

  if (myGame.player.hp <= 0) {
    isGameOver = true;
    clearInterval(TLoop);
    clearInterval(SLoop);
    elGameScreen?.classList.add("hidden");
    elGameOverScreen?.classList.remove("hidden");
    myStorage.saveGame(score, time);
    document.getElementById("final-time").textContent = formatTime(time);
    document.getElementById("final-score").textContent = score;
    music.pause();
    displayHistory();
    const deathSound = new Audio("../public/assets/sounds/game_over.wav");
    deathSound.play();
    console.table(myStorage.getHistory());
  }
  if (myGame.enemies.boss) {
    if (myGame.enemies.boss.isDead && boss_alive > 0) {
      myGame.enemies.boss.die();
      score += 5000;
      boss_alive -= 1;
    }
  }
};

const setupEventListeners = () => {
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    const referenceWidth = 1200;
    const ratio = width / referenceWidth;

    if (ratio < 1) {
      const zoomOut = 1 / ratio;
      camera.position.set(16, 15 * zoomOut, 10 * zoomOut);
    } else {
      camera.position.set(16, 15, 10);
    }

    camera.lookAt(16, 2, 2);
  });

  document
    .getElementById("restart-btn")
    ?.addEventListener("click", () => location.reload());

  window.addEventListener("keydown", (e) => {
    if (isGameOver) return;
    const keyName = e.key.toUpperCase();
    const keyTile = myGame.keyboard.find(keyName);
    if (keyTile) keyTile.isPressed = true;

    if (myGame.player) {
      const target = myGame.keyboard.find(keyName);

      if (target) {
        myGame.enemies.updatePath(target.key, myGame.keyboard);

        myGame.player.move({
          x: target.rawPosition.x,
          y: target.rawPosition.y,
        });
      }

      let word = myGame.player.handleKeyPress(e.key);

      if (e.key === "ArrowUp") word = "sum";

      if (word) {
        const closestEnemy = myGame.enemies.findClosestEnemy(
          myGame.player.position,
        );

        const spellResult = myGame.player.attack(word, closestEnemy);

        if (spellResult instanceof Projectile) {
          myGame.projectiles.push(spellResult);
        }
        elCurrentWord.textContent = word;
        setTimeout(() => {
          elCurrentWord.textContent = myGame.player.currentWord;
        }, 100);
      } else if (elCurrentWord) {
        elCurrentWord.textContent = myGame.player.currentWord;
      }
    }
  });
};

window.addEventListener("DOMContentLoaded", init);
