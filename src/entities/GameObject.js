export default class GameObject {
  position; //? {x: Number, y: Number}

  constructor(position) {
    this.position = position;
  }

  draw(ctx) {
    if (!ctx) {
      throw new Error("No ctx on draw !");
    }

    console.log("Drawing");
  }
}
