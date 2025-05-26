export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create(data) {
    const score = data.score;
  
    this.add
      .text(650, 450, "Your score was: " + score, {
        fontSize: "64px",
        fill: "#ff0000",
      })
      .setOrigin(0.5);
  
    this.time.delayedCall(3000, () => {
      window.location.reload();
    });
  }
}  