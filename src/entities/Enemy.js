import Actor from "./Actor.js";

export default class Player extends Actor {
  constructor(
    playerName = "Unknow",
    hp = 100,
    hpMax = 100,
    position,
    size,
    img,
  ) {
    super(playerName, hp, hpMax, position, size, img);
  }
}
