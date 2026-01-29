import "./style.css";
import Game from "./Game.js";
import { KEYBOARD_LAYOUT } from "../backend/KEYBOARD.js";
import Storage from "./Storage.js";
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const CONFIG = {
  projectile: {
    imgSrc: "../public/assets/fireball.png",
    size: { width: 0.4, height: 0.4 },
    speed: 5,
  },
};

let myGame; //myStorage;
let canvas, ctx, renderer;
let score = 0,
  time = 0;
let projectiles = [],
  bonks = [];
let TLoop, SLoop;
let music;
let elScore, elTimer, elCurrentWord, elPlayerHp, elGameScreen, elGameOverScreen;
let isGameOver = false;
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
const init = async () => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;

  music = new Audio("../public/assets/sounds/music.mp3");
  music.volume = 0.5;
  music.loop = true;

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
  if (isGameOver) return;
  requestAnimationFrame(gameLoop);
  if (!renderer || !myGame.player) return;

  const deltaTime = 10;

  myGame.player.update();

  if (myGame.player.mesh) {
    const spacing = 3.2;

    const targetX = myGame.player.position.x;
    const targetY = myGame.player.position.y;

    myGame.player.mesh.position.set(targetX * spacing, 1.5, targetY * spacing);
  }
  if (myGame.enemies.boss && myGame.enemies.boss.hp > 0) {
    myGame.enemies.boss.update(deltaTime, myGame.player, projectiles, bonks);
  }

  bonks.forEach((b, index) => {
    b.update(deltaTime, myGame.player);
    if (b.isDead) bonks.splice(index, 1);
  });

  projectiles.forEach((p) => {
    p.update(myGame.player, deltaTime);

    if (!p.isDead) {
      if (
        p.team === "player" &&
        myGame.enemies.boss &&
        myGame.enemies.boss.hp > 0
      ) {
        if (myGame.enemies.boss.checkCollision(p)) {
          myGame.enemies.boss.hp -= p.damage;
          p.isDead = true;
          p.die();
          if (window.startShake) window.startShake(0.2);
        }
      } else if (p.team === "boss") {
        if (myGame.player.checkCollision(p)) {
          myGame.player.damage(p.damage);
          p.isDead = true;
          p.die();
          if (window.startShake) window.startShake(0.5);
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
  if (myGame && myGame.keyboard) {
    myGame.keyboard.update();
  }
  renderer.render(scene, camera);

  if (elPlayerHp) elPlayerHp.textContent = Math.max(0, myGame.player.hp);
  projectiles = projectiles.filter((p) => !p.isDead);

  if (myGame.player.hp <= 0) {
    isGameOver = true;
    clearInterval(TLoop);
    clearInterval(SLoop);
    elGameScreen?.classList.add("hidden");
    elGameOverScreen?.classList.remove("hidden");

    document.getElementById("final-time").textContent = formatTime(time);
    document.getElementById("final-score").textContent = score;
    music.pause();
    const deathSound = new Audio("../public/assets/sounds/game_over.wav");
    deathSound.play();
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
      const target = KEYBOARD_LAYOUT.find((t) => t.key === keyName);
      if (target) {
        myGame.player.moveTo({
          x: target.x,
          y: target.y,
        });
      }

      let word = myGame.player.handleKeyPress(e.key);
      if (e.key === "ArrowUp") {
        word = "sum";
      }
      if (word) {
        const closestEnemy = myGame.enemies.findClosestEnemy(
          myGame.player.position,
        );
        if (closestEnemy) {
          const newProj = myGame.player.attack(word, closestEnemy);
          if (newProj) {
            projectiles.push(newProj);
          }
        }
        elCurrentWord.textContent = word;
        setTimeout(() => {
          elCurrentWord.textContent = myGame.player.currentWord;
        }, 100);
      } else if (elCurrentWord)
        elCurrentWord.textContent = myGame.player.currentWord;
    }
  });

  /*window.addEventListener("keyup", (e) => {
    const keyTile = myGame.keyboard.find(e.key.toUpperCase());
    if (keyTile) keyTile.isPressed = false;
  });*/
};

window.addEventListener("DOMContentLoaded", init);
