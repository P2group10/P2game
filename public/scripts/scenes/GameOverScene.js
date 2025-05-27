export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });

  }

  // Preload assets for the scene
  preload() {
    this.load.image("BackGroundImageStart", "assets/images/backgroundStart.jpeg");
  }

  // Create the scene and set up the UI elements
  create(data) {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Add the background image
    this.background = this.add.tileSprite(centerX, centerY, 1200, 750, "BackGroundImageStart");

    // Display the player's score
    const score = data.score;
    const scoreText = this.add.text(centerX, centerY, `Your score was: ${score}`, {
      fontSize: "64px",
      fill: "#000000",
      fontFamily: "zombie",
    });

    // Center the text origin
    scoreText.setOrigin(0.5);

    // Reload the game after 3 seconds
    this.time.delayedCall(3000, () => {
      window.location.reload();
    });
  }

  // Update the background's position for a scrolling effect
  update() {
    this.background.tilePositionX += 1;
  }
}