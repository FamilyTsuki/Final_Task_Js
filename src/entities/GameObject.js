export default class GameObject {
  position; //? {x: Number, y: Number}

  constructor(position) {
    this.position = position;
  }

  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }

  draw(ctx) {
    if (!ctx) {
      throw new Error("No ctx on draw !");
    }

    console.log("Drawing");
  }
}
