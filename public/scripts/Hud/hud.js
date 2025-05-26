export default class HUD {
  constructor(scene) {
    this.scene = scene;
    let score = 0;

    this.healthBar = this.createHealthBar();

    this.inventory = this.createInventory();

this.scoreBoard = this.createScoreBoard(score).scoreBoard;

    //Listen for events about health changes.
    this.scene.events.on("playerHealthChanged", this.updateHealth, this);
    this.scene.events.on("scoreChanged", this.updateScore, this);
  }

  createHealthBar() {
    //Add a  container in the bottom right of the view.
    const hpContainer = this.scene.add.container(730, 470).setScrollFactor(0);

    const bg = this.scene.add.rectangle(0, 0, 102, 16, 0x000000);
    const border = this.scene.add.rectangle(0, 0, 98, 12, 0xffffff);
    const fill = this.scene.add.rectangle(0, 0, 98, 12, 0x00ff00);

    hpContainer.add([bg, border, fill]);
    // Makes sure that the HUD is alway rendered above everything else.
    hpContainer.setDepth(9999);

    return {
      hpContainer,
      fill,
      maxWidth: 98,
    };
  }
  createScoreBoard(score) {
    const scoreBoard = this.scene.add.container(460, 259).setScrollFactor(0);
   
    let text = this.scene.add.text(-45, -7.5, "Score: " + score, {
      fontSize: "1920px",
      color: "#ffffff",
      fontFamily: "ArcadeClassic",
    });
    text.setScale(0.0085);
    scoreBoard.add([text]);
    // Makes sure that the HUD is alway rendered above everything else.
    scoreBoard.setDepth(9998);

    return {
      scoreBoard,    
    };
  }
  createInventory() {
    // Create a function to display and configrue the inventory slots (maybe x5 item-slots)
  }

  updateHealth(currentHealth, maxHealth) {
    // Get the thealth percentage to calculate the fill of the healthbar.
    const healthPercentage = currentHealth / maxHealth;

    // Update the width of the health bar fill
    this.healthBar.fill.width = this.healthBar.maxWidth * healthPercentage;

    // Change the color of healthbar to red if under 25% health.
    if (healthPercentage < 0.25) {
      this.healthBar.fill.setFillStyle(0xff0000); // Red for low health
    } else {
      this.healthBar.fill.setFillStyle(0x00ff00); // Green for normal health
    }
  }

  updateScore(score) {
  const scoreText = this.scoreBoard.list.find(child => child instanceof Phaser.GameObjects.Text);
  if (scoreText) {
    scoreText.setText("Score: " + score);
  }
}


}
