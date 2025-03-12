import Player from './characters.js'; // Import the Player class
import Enemy from './enemies.js';
import GameOverScene from './GameOverScene.js'; // Import the Game Over scene

window.onload = function () {
  const config = {
    type: Phaser.WEBGL, // or Phaser.CANVAS
    width: 800,
    height: 600,
    parent: 'gameContainer', // Use parent instead of canvas
    scene: [MenuScene, MainGameScene, GameOverScene], // Add both scenes
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

// Main Game Scene
class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGameScene' });
    this.overlapTimer = null; // Initialize the overlap timer
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 32, // Width of each frame
      frameHeight: 32.5 // Height of each frame
    });
    this.load.spritesheet("enemy", "assets/zombie.png", {
      frameWidth: 318, // Width of each frame
      frameHeight: 294 // Height of each frame
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

    // Create an enemy
    this.enemy = new Enemy(this, 500, 300, 'enemy');
    this.enemy.setScale(0.2); // Adjust the scale as needed (e.g., 0.5 for half size)

    // Add overlap check
    this.physics.add.overlap(this.player, this.enemy, this.handleOverlap, null, this);

    // Create mini-map
    this.createMiniMap();
  }

  createMiniMap() {
    // Create a mini-map camera
    this.miniMapCamera = this.cameras.add(650, 450, 150, 150).setZoom(0.1).setBounds(0, 0, 2000, 2000);
    //this.miniMapCamera.ignore(this.player); // Ignore the player sprite in the mini-map

    // Create a mini-map background (optional, for better visualization)
    this.miniMapBackground = this.add.rectangle(650, 450, 150, 150, 0x000000, 0.5).setScrollFactor(0);
    this.miniMapCamera.ignore(this.miniMapBackground);

    // Add a player marker to the mini-map
    this.playerMarker = this.add.rectangle(0, 0, 5, 5, 0xff0000).setScrollFactor(0);
    this.miniMapCamera.ignore(this.playerMarker); // Ensure the marker is only visible in the mini-map
  }

  handleOverlap(player, enemy) {
    if (!this.overlapTimer) {
      this.overlapTimer = this.time.addEvent({
        delay: 3000, // 3 seconds
        callback: this.gameOver,
        callbackScope: this
      });
    }
  }

  gameOver() {
    this.scene.start('GameOverScene'); // Switch to the Game Over scene
  }

  update() {
    this.player.update(this.cursors);
    this.enemy.update(this.player);

    // Update the player marker position on the mini-map
    const miniMapX = (this.player.x / 2000) * 150; // Scale player's X position to mini-map size
    const miniMapY = (this.player.y / 2000) * 150; // Scale player's Y position to mini-map size
    this.playerMarker.setPosition(650 + miniMapX, 450 + miniMapY);

    // Reset the timer if the enemy is no longer overlapping with the player
    if (!this.physics.overlap(this.player, this.enemy)) {
      if (this.overlapTimer) {
        this.overlapTimer.remove();
        this.overlapTimer = null;
      }
    }
  }
}