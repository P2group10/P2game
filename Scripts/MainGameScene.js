// MainGameScene.js
import Player from './characters.js';
import Enemy from './enemies.js';

export default class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGameScene' });
    this.overlapTimer = null; // Initialize the overlap timer
    this.isMiniMapVisible = true; // Track mini-map visibility
    this.zombies = []; // Array to store active zombies
    this.maxZombies = 20; // Maximum number of zombies allowed
    this.spawnInterval = 500; // Spawn a new zombie every 2 seconds
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

    // Add key listener for the M key to toggle mini-map
    this.input.keyboard.on('keydown-M', () => {
      this.toggleMiniMap();
    });

    // Camera setup
    const camera = this.cameras.main;
    camera.startFollow(this.player); // Make the camera follow the player
    camera.setZoom(2); // Zoom in (2x zoom)
    camera.setBounds(0, 0, 2000, 2000); // Set camera bounds to match the map size

    // Initialize zombie spawner
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnZombie,
      callbackScope: this,
      loop: true
    });

    // Create mini-map
    this.createMiniMap();
  }

  spawnZombie() {
    // Only spawn a new zombie if the current number of zombies is below the limit
    if (this.zombies.length < this.maxZombies) {
      const x = Phaser.Math.Between(100, 700); // Random x position
      const y = Phaser.Math.Between(100, 500); // Random y position
      const zombie = new Enemy(this, x, y, 'enemy');
      zombie.setScale(0.2);

      // Add overlap check for the new zombie
      this.physics.add.overlap(this.player, zombie, this.handleOverlap, null, this);

      // Add the zombie to the array
      this.zombies.push(zombie);
    }
  }

  createMiniMap() {
    // Create a mini-map camera
    this.miniMapCamera = this.cameras.add(500, 300, 300, 300).setZoom(0.2).setBounds(0, 0, 2000, 2000);

    // Add a player marker to the mini-map
    this.playerMarker = this.add.rectangle(0, 0, 5, 5, 0xff0000).setScrollFactor(0);
  }

  toggleMiniMap() {
    // Toggle mini-map visibility
    this.isMiniMapVisible = !this.isMiniMapVisible;

    // Set visibility of mini-map camera, background, and player marker
    this.miniMapCamera.setVisible(this.isMiniMapVisible);
    this.miniMapBackground.setVisible(this.isMiniMapVisible);
    this.playerMarker.setVisible(this.isMiniMapVisible);
  }

  handleOverlap(player, zombie) {
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

    // Update all zombies
    this.zombies.forEach(zombie => {
      zombie.update(this.player);
    });

    // Update the player marker position on the mini-map (only if mini-map is visible)
    if (this.isMiniMapVisible) {
      const miniMapX = (this.player.x / 2000) * 300; // Scale player's X position to mini-map size
      const miniMapY = (this.player.y / 2000) * 300; // Scale player's Y position to mini-map size
      this.playerMarker.setPosition(600 + miniMapX, 400 + miniMapY); // Use mini-map camera position (600, 400)
    }

    // Reset the timer if the player is no longer overlapping with any zombie
    if (!this.zombies.some(zombie => this.physics.overlap(this.player, zombie))) {
      if (this.overlapTimer) {
        this.overlapTimer.remove();
        this.overlapTimer = null;
      }
    }
  }
}
