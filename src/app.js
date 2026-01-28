import "./style.css";
import Game from "./Game.js";
import Player from "./entities/Player.js";
import { KEYBOARD_LAYOUT } from "./backend/KEYBOARD.js";
import Stocage from "./Storage.js";
import Boss from "./entities/Boss.js";
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
const CONFIG = {
  player: {
    name: "Héros",
    imgSrc: "../public/assets/player.jpg",
    startPos: { x: 0, y: 0, z: 5 },
    size: { width: 0.8, height: 0.8 },
  },
  projectile: {
    imgSrc: "../public/assets/fireball.png",
    size: { width: 0.4, height: 0.4 },
    speed: 5,
  },
};

let myGame, player, boss; //myStorage;
let canvas, ctx, renderer;
let score = 0,
  time = 0;
let projectiles = [],
  bonks = [];
let TLoop, SLoop;
let elScore, elTimer, elCurrentWord, elPlayerHp, elGameScreen, elGameOverScreen;

let boss3d = null;

let fireballModel = null;

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
const init = () => {
  canvas = document.getElementById("game-canvas");
  if (!canvas) return;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  camera.position.set(16, 15, 10);
  camera.lookAt(16, 2, 2);

  elScore = document.getElementById("current-score");
  elTimer = document.getElementById("timer");
  elCurrentWord = document.getElementById("currentWord");
  elPlayerHp = document.getElementById("player-health");
  elGameScreen = document.getElementById("game-screen");
  elGameOverScreen = document.getElementById("game-over-screen");

  //myStorage = new Storage();
  //myStorage.init();

  myGame = new Game(scene, KEYBOARD_LAYOUT);

  player = new Player(
    CONFIG.player.name,
    100,
    100,
    CONFIG.player.startPos,
    CONFIG.player.size,
    scene,
    loader.load("../public/assets/fireball.glb", (gltf) => gltf),
  );
  const listElement = document.getElementById("spell-list");
  if (listElement) {
    listElement.textContent = "";
    player.wordSpells.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      listElement.appendChild(li);
    });
  }

  //! may be something to do here
  /*
  loader.load("../public/assets/yameter.glb", (bossGltf) => {
    const bossModel = bossGltf;

    loader.load("../public/assets/fireball.glb", (fireballGltf) => {
      const fireballModel = fireballGltf.scene;
      fireballModel.visible = false;

      boss = new Boss(
        "Octopus",
        500,
        { x: 5, y: -2 },
        { width: 2, height: 2 },
        scene,
        fireballModel,
        bossModel,
      );
      camera.position.set(16, 15, 12);
      camera.lookAt(16, 2, 0);
    });
  });*/
  TLoop = setInterval(() => {
    time += 1;
    if (elTimer) elTimer.textContent = formatTime(time);
  }, 10);

  SLoop = setInterval(() => {
    score += 10;
    if (elScore) elScore.textContent = score;
  }, 1000);
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
  gameLoop();
  elGameScreen?.classList.remove("hidden");
};

const gameLoop = () => {
  requestAnimationFrame(gameLoop);
  if (!renderer || !player) return;

  const deltaTime = 10;

  player.update();

  if (player.mesh) {
    const spacing = 3.2;

    const targetX = player.position.x;
    const targetY = player.position.y;

    player.mesh.position.set(targetX * spacing, 1.5, targetY * spacing);
  }
  if (boss && boss.hp > 0) {
    boss.update(deltaTime, player, projectiles, bonks);
  }

  bonks.forEach((b, index) => {
    b.update(deltaTime, player);
    if (b.isDead) bonks.splice(index, 1);
  });

  projectiles.forEach((p) => {
    p.update();
    if (!p.isDead) {
      p.update({ width: canvas.widht, height: canvas.height });
      p.draw(ctx);

      if (
        p.team === "player" &&
        myGame.enemies.boss &&
        myGame.enemies.boss.hp > 0
      ) {
        if (myGame.enemies.boss.checkCollision(p)) {
          myGame.enemies.boss.hp -= p.damage;
          p.isDead = true;
        }
      } else if (p.team === "myGame.enemies.boss") {
        if (player.checkCollision(p)) {
          player.hp -= p.damage;
          p.isDead = true;
        }
      }
    }
  });
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

  if (elPlayerHp) elPlayerHp.textContent = Math.max(0, player.hp);
  projectiles = projectiles.filter((p) => !p.isDead);
  //myStorage.actu(score, time, player);

  if (player.hp <= 0) {
    clearInterval(TLoop);
    clearInterval(SLoop);
    elGameScreen?.classList.add("hidden");
    elGameOverScreen?.classList.remove("hidden");

    document.getElementById("final-time").textContent = formatTime(time);
    document.getElementById("final-score").textContent = score;
    //myStorage.clear();
  }
};

const setupEventListeners = () => {
  window.addEventListener("resize", () => {
    // 1. Mise à jour classique du moteur
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // 2. LOGIQUE D'ADAPTATION (Zoom auto)
    // On définit une largeur de référence (ex: 1200px)
    const referenceWidth = 1200;
    const ratio = width / referenceWidth;

    if (ratio < 1) {
      // Si l'écran est plus petit que la référence, on recule la caméra
      // Plus le ratio est petit, plus on augmente le Z et le Y
      const zoomOut = 1 / ratio;
      camera.position.set(16, 15 * zoomOut, 10 * zoomOut);
    } else {
      // Position par défaut sur PC large
      camera.position.set(16, 15, 10);
    }

    camera.lookAt(16, 2, 2);
  });

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
        player.moveTo({
          x: target.x,
          y: target.y,
        });
      }

      let word = player.handleKeyPress(e.key);
      if (e.key === "ArrowUp") {
        word = "sum";
      }
      if (word) {
        const closestEnemy = myGame.enemies.findClosestEnemy(player.position);
        if (closestEnemy) {
          const newProj = player.attack(word, closestEnemy);
          if (newProj) {
            projectiles.push(newProj);
          }
        }
        elCurrentWord.textContent = word;
        setTimeout(() => {
          elCurrentWord.textContent = player.currentWord;
        }, 100);
      } else if (elCurrentWord) elCurrentWord.textContent = player.currentWord;
    }
  });

  window.addEventListener("keyup", (e) => {
    const keyTile = myGame.keyboard.find(e.key.toUpperCase());
    if (keyTile) keyTile.isPressed = false;
  });
};

window.addEventListener("DOMContentLoaded", init);
