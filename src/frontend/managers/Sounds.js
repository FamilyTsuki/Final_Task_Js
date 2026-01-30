export default class Sounds {
  #music;
  #bossMusic;
  #laugth;
  #spawnBossSound;
  #quak;
  #volume;

  /**
   *
   * @param {Audio} music
   * @param {Audio} bossMusic
   * @param {Audio} laugth
   * @param {Audio} spawnBossSound
   * @param {Audio} quak
   * @param {Number | undefined} volume
   */
  constructor(music, bossMusic, laugth, spawnBossSound, quak, volume = 0.5) {
    this.#volume = volume;

    this.#music = music;
    this.#music.volume = this.#volume;
    this.#music.loop = true;

    this.#bossMusic = bossMusic;
    this.#bossMusic.volume = this.#volume;
    this.#bossMusic.loop = true;

    this.#laugth = laugth;
    this.#laugth.volume = this.#volume;

    this.#spawnBossSound = spawnBossSound;
    this.#spawnBossSound.volume = this.#volume;

    this.#quak = quak;
    this.#quak.volume = this.#volume;
  }

  get music() {
    return this.#music;
  }
  get bossMusic() {
    return this.#bossMusic;
  }
  get laugth() {
    return this.#laugth;
  }
  get spawnBossSound() {
    return this.#spawnBossSound;
  }
  get quak() {
    return this.#quak;
  }
}
