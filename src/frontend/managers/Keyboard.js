import * as THREE from "three";
import Key from "../models/Key";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Keyboard {
  #keyboardLayout;
  #keyModel;
  tileSize;
  group;

  /**
   *
   * @param {Map} keyboardLayout
   * @param {Number} tileSize
   * @param {Scene} scene
   * @param {*} keyModel
   */
  constructor(keyboardLayout, tileSize, scene, keyModel) {
    this.#keyboardLayout = keyboardLayout;
    this.#keyModel = keyModel;
    this.tileSize = tileSize;
    this.group = new THREE.Group();
    scene.add(this.group);

    this.createKeys(scene, this.#keyModel);
  }

  get keyboardLayout() {
    return this.#keyboardLayout;
  }

  /**
   *
   * @param {Scene} scene
   * @param {*} model
   */
  createKeys(scene, model) {
    const loader = new GLTFLoader();

    this.#keyboardLayout.forEach((keyObj) => {
      const keyMesh = model.clone();

      keyMesh.position.set(keyObj.x, 0, keyObj.y);

      keyMesh.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            roughness: 0.5,
            metalness: 0.2,
          });
        }
      });

      const letterTexture = createTextTexture(keyObj.key.toUpperCase());

      const planeGeometry = new THREE.PlaneGeometry(1.2, 1.2);
      const planeMaterial = new THREE.MeshBasicMaterial({
        map: letterTexture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const letterPlane = new THREE.Mesh(planeGeometry, planeMaterial);

      letterPlane.position.set(0, 1, 0);
      letterPlane.rotation.x = -Math.PI / 2;

      keyMesh.add(letterPlane);

      keyObj.mesh = keyMesh;
      this.group.add(keyMesh);
    });
  }

  update() {
    this.#keyboardLayout.forEach((keyObj) => {
      if (keyObj.mesh) {
        if (keyObj.isPressed) {
          keyObj.mesh.position.y = -0.2;
        } else {
          keyObj.mesh.position.y = 0;
        }
      }
    });
  }

  /**
   *
   * @param {String} keyToFind
   * @returns {Key | undefined}
   */
  find(keyToFind) {
    return this.#keyboardLayout.find((key) => key.key === keyToFind);
  }

  /**
   *
   * @param {Scene} scene
   * @param {Array} keyboardLayout
   * @param {*} keyModel
   * @returns {Keyboard}
   */
  static init(scene, keyboardLayout, keyModel) {
    const initialSize = 1;
    const keys = keyboardLayout.map(
      (keyRaw) =>
        new Key(keyRaw.key, keyRaw.x, keyRaw.y, keyRaw.isPressed, initialSize),
    );
    return new Keyboard(keys, initialSize, scene, keyModel);
  }
}

/**
 *
 * @param {String} text
 * @param {String} color
 * @param {String} bgColor = rgba(Number, Number, Number, Number)
 * @param {Number} fontSize
 * @returns
 */
function createTextTexture(
  text,
  color = "black",
  bgColor = "rgba(0,0,0,0)",
  fontSize = 90,
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 256;
  canvas.height = 256;

  context.fillStyle = bgColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = `bold ${fontSize}px Arial`;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
