// MenuScene.js
export default class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }
  
    preload() {
      // Load any assets needed for the menu (e.g., background, button images)
      this.load.image('menuBackground', 'assets/menuBackground.jpg');
      this.load.image('startButton', 'assets/startButton.png');
    }
  
    create() {
      // Add background
      this.add.image(450, 800, 'menuBackground').setScale(0.5);
  
      // Add Start Game button
      const startButton = this.add.image(400, 400, 'startButton').setInteractive();
      startButton.setScale(0.25);
  
      // Add button click event
      startButton.on('pointerdown', () => {
        this.scene.start('MainGameScene'); // Switch to the main game scene
      });
  
      // Optional: Add hover effects
      startButton.on('pointerover', () => {
        startButton.setScale(0.3); // Slightly enlarge the button
      });
  
      startButton.on('pointerout', () => {
        startButton.setScale(0.25); // Reset the button size
      });
    }
  }