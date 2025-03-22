// StartScene.js
export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("backgroundStart", "assets/backgroundStart.jpeg");
    this.load.image("logo", "assets/logo.png");
    this.load.image("button", "assets/gamestartbutton.png");
  }

  create() {
    let centerX = this.cameras.main.centerX;
    let centerY = this.cameras.main.centerY;

    this.background = this.add.tileSprite(
      centerX,
      centerY,
      800,
      600,
      "backgroundStart"
    );
    const logo = this.add.image(centerX, centerY - 150, "logo");

    let startButton = this.add
      .image(centerX, centerY + 50, "button")
      .setInteractive();

    startButton.on("pointerover", () => {
      startButton.setScale(1.1);
    });

    startButton.on("pointerout", () => {
      startButton.setScale(1);
    });

    startButton.on("pointerdown", () => {
      this.scene.start("PickCharacter");
    });
  }

  update() {
    this.background.tilePositionX += 2;
  }
}
