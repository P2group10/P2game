export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create(data) {
    const score = data.score;

    this.add
      .text(center, center, "Your score was: " + score, {
        fontSize: "64px",
        fill: "#ff0000",
        fontFamily: "zombie",
      })
      .setOrigin(0.0);

    this.time.delayedCall(3000, () => {
      window.location.reload();
    });
  }
}
