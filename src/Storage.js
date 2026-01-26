export default class Stocage {
  #monStockage = localStorage;
  init = () => {
    this.#monStockage.setItem("scord", 0);
    this.#monStockage.setItem("time", 0);
    this.#monStockage.setItem("player", "Tom");
  };
  actu = (scord, time, player) => {
    this.#monStockage.setItem("scord", scord);
    this.#monStockage.setItem("time", time);
    this.#monStockage.setItem("player", player);
  };
  clear = () => {
    this.#monStockage.clear();
  };
}
