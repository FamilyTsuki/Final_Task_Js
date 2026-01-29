export default class Storage {
  static getHistory() {
    const data = localStorage.getItem("MON_JEU_TYPING");
    return data ? JSON.parse(data) : [];
  }

  static saveGame(score, time) {
    const history = this.getHistory();

    history.unshift({
      date: new Date().toLocaleString(),
      score: score,
      time: time,
      id: Date.now(),
    });

    localStorage.setItem("MON_JEU_TYPING", JSON.stringify(history));
  }

  static clearHistory() {
    localStorage.removeItem("MON_JEU_TYPING");
  }
}
