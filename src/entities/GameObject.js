export default class GameObject {
  position; //? {x: Number, y: Number, z: Number}

  constructor(position) {
    this.position = position;
  }

  get position() {
    return this.position;
  }
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  get z() {
    return this.position.z;
  }

  draw(ctx) {
    if (!ctx) {
      throw new Error("No ctx on draw !");
    }

    console.log("Drawing");
  }
}
