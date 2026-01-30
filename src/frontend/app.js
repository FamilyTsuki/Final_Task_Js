import "./style.css";
import Game from "./Game.js";
import { KEYBOARD_LAYOUT } from "../backend/KEYBOARD.js";
import Storage from "./Storage.js";
import * as THREE from "three";

let boss_alive = 1;
let enemy_alive = 1;

let SPAWN_INTERVAL = 4000;
let lastSpawnTime = 0;
let myGame;
let myStorage;
let canvas, renderer;
let TLoop, SLoop;
let spawnBosslopp;
let elScore, elCurrentWord, elPlayerHp, elGameScreen, elGameOverScreen;
let isGameOver = false;
let gameTimer = 0;
let bossIsPresent = false;
const WAVE_INTERVAL = 3000;
const BOSS_SPAWN_DELAY = 45000;
const initialCameraPos = { x: 16, y: 15, z: 15 };
const initialLookAt = { x: 16, y: 2, z: 2 };
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
let shakeIntensity = 0;
const shakeDecay = 0.9;
const resetCamera = () => {
  // On remet les coordonnées de départ
  camera.position.set(
    initialCameraPos.x,
    initialCameraPos.y,
    initialCameraPos.z,
  );
  camera.lookAt(initialLookAt.x, initialLookAt.y, initialLookAt.z);

  // On force la mise à jour des matrices
  camera.updateProjectionMatrix();

  // Optionnel : on remet l'intensité du shake à 0 au cas où
  shakeIntensity = 0;
};
window.startShake = function (intensity) {
  shakeIntensity = intensity;
};
const manageEnemiesLogic = (deltaTime) => {
  if (isGameOver) return;

  gameTimer += deltaTime;

  // 1. SPAWN DES ENNEMIS RÉGULIERS
  if (!bossIsPresent && gameTimer - lastSpawnTime >= SPAWN_INTERVAL) {
    // On récupère toutes les touches du clavier sauf celle du joueur
    const difficulty = Math.min(gameTimer / 50000, 1);
    const availableTiles = myGame.keyboard.keyboardLayout.filter((tile) => {
      // 1. Calcul de la distance avec le joueur
      const distSq =
        (tile.x - myGame.player.x) ** 2 + (tile.y - myGame.player.y) ** 2;
      const isFarFromPlayer = distSq > 1;

      const isTileOccupied = myGame.enemies.container.some((enemy) => {
        // On compare les positions logiques (x et y)
        return enemy.x === tile.x && enemy.y === tile.y;
      });

      // On garde la touche seulement si elle est loin du joueur ET vide
      return isFarFromPlayer && !isTileOccupied;
    });

    if (availableTiles.length > 0) {
      // On choisit une touche au hasard
      const randomTile =
        availableTiles[Math.floor(Math.random() * availableTiles.length)];

      let type = "basic";
      const roll = Math.random(); // Génère un nombre entre 0 et 1

      if (roll < difficulty * 0.4) {
        type = "tank";
      } else if (roll < difficulty * 0.8) {
        type = "speedy";
      } else {
        type = "basic";
      }
      myGame.enemies.spawnAt(randomTile, scene, type);
    }

    lastSpawnTime = gameTimer;
  }
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
            <td>${myGame.formatTime(game.time)}</td>
        `;
    container.appendChild(row);
  });
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
const init = async () => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) throw new Error("No canvas !");

  myStorage = new Storage();

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.set(16, 15, 15);
  camera.lookAt(16, 2, 2);

  elScore = document.getElementById("current-score");
  const elTimer = document.getElementById("timer");
  elCurrentWord = document.getElementById("currentWord");
  elPlayerHp = document.getElementById("player-health");
  elGameScreen = document.getElementById("game-screen");
  elGameOverScreen = document.getElementById("game-over-screen");

  myGame = await Game.init(scene, KEYBOARD_LAYOUT, BOSS_SPAWN_DELAY);

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

  myGame.startBtn(
    startBtn,
    gameLoop,
    elTimer,
    elScore,
    startScreen,
    elGameScreen,
  );

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
  sunLight.position.set(10, 20, 10);
  scene.add(sunLight);
  const fillLight = new THREE.PointLight(0x0088ff, 0.5);
  fillLight.position.set(-10, 10, -10);
  scene.add(fillLight);

  myGame.setupEventListeners(camera, renderer, elCurrentWord);
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
              p.die();
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
      tile.isPressed = tile.key === myGame.player.actualKey;
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
    myStorage.saveGame(myGame.score, myGame.time);
    document.getElementById("final-time").textContent = myGame.formatTime(
      myGame.time,
    );
    document.getElementById("final-score").textContent = myGame.score;
    myGame.sounds.music.pause();
    displayHistory();
    myGame.sounds.bossMusic.stop();
    myGame.sounds.music.stop();
    const deathSound = new Audio("../public/assets/sounds/game_over.wav");
    deathSound.play();
    console.table(myStorage.getHistory());
  }
  if (myGame.enemies.boss) {
    if (myGame.enemies.boss.isDead && bossIsPresent) {
      myGame.enemies.boss.die();
      myGame.score += 5000;
      bossIsPresent = false;
      gameTimer = 0;
      lastSpawnTime = 0;
      SPAWN_INTERVAL -= 1000;
      resetCamera();

      setTimeout(() => {
        myGame.sounds.laugth.play();
        bossIsPresent = true;
        setTimeout(() => {
          spawnBoss();
        }, 4000);
      }, BOSS_SPAWN_DELAY);
    }
  }
  if (myGame.enemies.bonus > 0) {
    myGame.score += myGame.enemies.bonus;
    myGame.enemies.bonus = 0;
    console.log("score enemie atribué");
  }
};

window.addEventListener("DOMContentLoaded", init);
