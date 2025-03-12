// MainGameScene.js
import Player from './characters.js';
import Enemy from './enemies.js';

export default class MainGameScene extends Phaser.Scene {
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
    this.miniMapCamera = this.cameras.add(500, 350, 300, 300).setZoom(0.2).setBounds(0, 0, 2000, 2000);
    //this.miniMapCamera.ignore(this.player); // Ignore the player sprite in the mini-map

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
    const miniMapX = (this.player.x / 2000) * 300; // Scale player's X position to mini-map size
    const miniMapY = (this.player.y / 2000) * 300; // Scale player's Y position to mini-map size
    this.playerMarker.setPosition(600 + miniMapX, 400 + miniMapY); // Use mini-map camera position (600, 400)
  
    // Reset the timer if the enemy is no longer overlapping with the player
    if (!this.physics.overlap(this.player, this.enemy)) {
      if (this.overlapTimer) {
        this.overlapTimer.remove();
        this.overlapTimer = null;
      }
    }
  }
}