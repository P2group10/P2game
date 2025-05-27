export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  preload() {
    this.load.image(
      "BackGroundImageStart",
      "assets/images/backgroundStart.jpeg"
    );
  }

  create(data) {
    let centerX = this.cameras.main.centerX;
    let centerY = this.cameras.main.centerY;

    this.background = this.add.tileSprite(
      centerX,
      centerY,
      1200,
      750,
      "BackGroundImageStart"
    );

    const score = data.score;

    const text = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "Your score was: " + score,
      {
        fontSize: "64px",
        fill: "#000000",
        fontFamily: "zombie",
      }
    );

    text.setOrigin(0.5); // center the origin

    this.time.delayedCall(3000, () => {
      window.location.reload();
    });
  }

  update() {
    this.background.tilePositionX += 1;
  }
}
