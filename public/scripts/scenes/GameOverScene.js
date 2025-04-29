export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create() {
    // Display "You are dead!" message
    this.add
      .text(650, 450, "MANCHESTER UNITED SUCKS!!", { fontSize: "64px", fill: "#ff0000" })
      .setOrigin(0.5);

      this.time.delayedCall(
        3000,
        () => {
          window.location.reload();
        },
        [],
        this
      );
    }
  }