import Player from './characters.js'; // Import the Player class

window.onload = function () {
  const config = {
    type: Phaser.WEBGL, // or Phaser.CANVAS
    width: 800,
    height: 600,
    parent: 'gameContainer', // Use parent instead of canvas
    scene: [MenuScene, MainGameScene], // Add both scenes
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
  };
  var game = new Phaser.Game(config);
};

// Menu Scene
class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Load any assets needed for the menu (e.g., background, button images)
    this.load.image('menuBackground', 'assets/menuBackground.jpg');
    this.load.image('startButton', 'assets/startButton.webp');
  }

  create() {
    // Add background
    this.add.image(450, 800, 'menuBackground').setScale(0.5);

    // Add Start Game button
    const startButton = this.add.image(400, 400, 'startButton').setInteractive();
    startButton.setScale(0.1);

    // Add button click event
    startButton.on('pointerdown', () => {
      this.scene.start('MainGameScene'); // Switch to the main game scene
    });

    // Optional: Add hover effects
    startButton.on('pointerover', () => {
      startButton.setScale(0.3); // Slightly enlarge the button
    });

    startButton.on('pointerout', () => {
      startButton.setScale(0.1); // Reset the button size
    });
  }
}

// Main Game Scene
class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGameScene' });
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 32, // Width of each frame
      frameHeight: 32.5 // Height of each frame
    });
  }

  create() {
    // Background
    let background = this.add.image(400, 300, "background");
    background.setScale(3);

    // Create the player
    this.player = new Player(this, 400, 300, "player");

    // Set world bounds to match the map size
    this.physics.world.setBounds(60, 60, 1400, 970);

    // Controls
    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      control: Phaser.Input.Keyboard.KeyCodes.CTRL
    });

    // Camera setup
    const camera = this.cameras.main;
    camera.startFollow(this.player); // Make the camera follow the player
    camera.setZoom(2); // Zoom in (2x zoom)
    camera.setBounds(0, 0, 2000, 2000); // Set camera bounds to match the map size
  }

  update() {
    this.player.update(this.cursors); // Use 'this.player' instead of 'player'
}
}