import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import Enemies from "./managers/Enemies";
import Keyboard from "./managers/Keyboard";
import Player from "./models/actors/Player";
import Sounds from "./managers/sounds";
import Projectile from "./models/Projectile";

export default class Game {
  #canvas;

  #keyboard;
  #enemies;
  #sounds;

  #player;

  #projectiles;
  #bonks;

  #isGameOver;
  #bossIsPresent;

  #bossSpawnDelay;

  #time;
  #score;

  #TLoop;
  #SLoop;
  #EMLoop;

  /**
   *
   * @param {Scene} scene
   * @param {Player} player
   * @param {Enemies} enemies
   * @param {Keyboard} keyboard
   */
  constructor(scene, player, enemies, keyboard, sounds, bossSpawnDelay) {
    this.#canvas = document.getElementById("game-canvas");
    this.scene = scene;
    if (!this.#canvas) {
      throw new Error("No canvas found !");
    }

    this.#keyboard = keyboard;
    this.#enemies = enemies;
    this.#sounds = sounds;

    this.#player = player;

    this.#projectiles = [];
    this.#bonks = [];

    this.#isGameOver = false;
    this.#bossIsPresent = false;

    this.#time = 0;
    this.#score = 0;
    this.#bossSpawnDelay = bossSpawnDelay;
  }

  get keyboard() {
    return this.#keyboard;
  }
  get enemies() {
    return this.#enemies;
  }
  get sounds() {
    return this.#sounds;
  }
  get player() {
    return this.#player;
  }
  get time() {
    return this.#time;
  }
  get score() {
    return this.#score;
  }
  get projectiles() {
    return this.#projectiles;
  }
  set projectiles(projectiles) {
    this.#projectiles = projectiles;
  }
  get bonks() {
    return this.#bonks;
  }
  set bonks(bonks) {
    this.#bonks = bonks;
  }

  keyboardUpdate() {
    this.#keyboard.update();
  }

  keyboardUpdateSize() {
    if (this.#keyboard.updateSize) {
      this.#keyboard.updateSize(this.#canvas);
    }
  }

  update() {
    this.#enemies.clearDead();
    this.#enemies.update(
      this.#player.position,
      this.#projectiles,
      this.#bonks,
      this.#player,
    );
  }

  /**
   *
   * @param {Number} enemyNumber
   */
  spawnWave(enemyNumber) {
    for (let x = 0; x < enemyNumber; x++) {
      this.#enemies.add(x, 3 + x);
    }
  }

  /**
   *
   * @param {String} key
   */
  spawnAt(key) {
    const result = this.#enemies.spawnAt(this.#keyboard.find(key), this.scene);
    this.#enemies.updatePath("P", this.#keyboard);
    return result;
  }

  /**
   *
   * @param {Number} t
   * @returns {String} = `MM:SS:MS`
   */
  formatTime(t) {
    const ms = t % 100;
    const totalSeconds = Math.floor(t / 100);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(ms).padStart(2, "0")}`;
  }

  /**
   *
   * @param {*} camera
   * @param {*} renderer
   */
  setupEventListeners(camera, renderer, elCurrentWord) {
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
      if (!this.#isGameOver) {
        const keyName = e.key.toUpperCase();
        const keyTile = this.#keyboard.find(keyName);

        if (keyTile) {
          keyTile.isPressed = true;

          this.#enemies.updatePath(keyTile.key, this.#keyboard);

          this.#player.move({
            x: keyTile.rawPosition.x,
            y: keyTile.rawPosition.y,
          });
        }

        let word = this.#player.handleKeyPress(e.key);

        if (e.key === "ArrowUp") word = "fire";

        if (word) {
          const closestEnemy = this.#enemies.findClosestEnemy(
            this.#player.position,
          );

          const spellResult = this.#player.attack(word, closestEnemy);

          if (spellResult instanceof Projectile) {
            this.#projectiles.push(spellResult);
          }
          elCurrentWord.textContent = word;
          setTimeout(() => {
            elCurrentWord.textContent = this.#player.currentWord;
          }, 100);
        } else {
          elCurrentWord.textContent = this.#player.currentWord;
        }
      }
    });
  }

  startBtn(startBtn, gameLoop, elTimer, elScore, startScreen, elGameScreen) {
    startBtn.addEventListener("click", () => {
      this.#sounds.music
        .play()
        .catch((e) => console.log("Audio bloqué par le navigateur"));
      startScreen.classList.add("hidden");
      elGameScreen?.classList.remove("hidden");

      this.#TLoop = setInterval(() => {
        this.#time += 1;
        if (elTimer) elTimer.textContent = this.formatTime(this.#time);
      }, 10);

      this.#SLoop = setInterval(() => {
        this.#score += 10;
        if (elScore) elScore.textContent = this.#score;
      }, 1000);

      setTimeout(() => {
        if (!this.#bossIsPresent) {
          this.#sounds.laugth.play();
          this.#bossIsPresent = true;
          setTimeout(() => {
            this.#enemies.spawnBoss(this.scene);
          }, 4000);
        }
      }, this.#bossSpawnDelay);

      // const WLoop = setInterval(() => {
      //   this.#spawnWave(5);
      // }, 60000);

      this.#EMLoop = setInterval(() => {
        this.#enemies.move();
      }, 1000);

      gameLoop();
    });
  }
  /**
   *
   * @param {Scene} scene
   * @param {Array} keyboardLayout
   * @returns {Game}
   */
  static async init(scene, keyboardLayout, bossSpawnDelay) {
    const sounds = new Sounds(
      new Audio("../public/assets/sounds/music.mp3"),
      new Audio("../public/assets/sounds/bossMusic.wav"),
      new Audio("../public/assets/sounds/rire.wav"),
      new Audio("../public/assets/sounds/spawnBoss.mp3"),
      new Audio("../public/assets/sounds/quak.wav"),
    );

    const models = await modelsLoad();

    const keyboard = Keyboard.init(scene, keyboardLayout, models.key.scene);

    const enemies = new Enemies(
      keyboard.keyboardLayout,
      models.enemy.texture,
      models.boss.scene,
      models.fireBall.scene,
    );

    const player = new Player(
      models.player.scene,
      { x: 0, y: 0, z: 5 },
      { width: 0.4, height: 0.4 },
      scene,
      models.fireBall.scene,
      enemies,
    );

    return new Game(scene, player, enemies, keyboard, sounds, bossSpawnDelay);
  }
}

async function modelsLoad() {
  const loader = new GLTFLoader();
  const textureLoader = new TextureLoader();

  return {
    key: await loader.loadAsync("../../public/assets/models/key.glb"),
    enemy: {
      texture: await textureLoader.loadAsync(
        "../../public/assets/textures/bug.png",
      ),
    },
    player: await loader.loadAsync("../../public/assets/models/player.glb"),
    boss: await loader.loadAsync("../../public/assets/models/yameter.glb"),
    fireBall: await loader.loadAsync("../../public/assets/models/fireball.glb"),
  };
}
