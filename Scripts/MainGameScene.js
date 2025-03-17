// MainGameScene.js
import Player from './characters.js';
import Enemy from './enemies.js';

export default class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainGameScene' });
    this.overlapTimer = null;
    this.isMiniMapVisible = true;
    this.zombies = [];
    this.maxZombies = 5;
    this.spawnInterval = 2000;
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.spritesheet("player", "assets/player.png", {
      frameWidth: 32,
      frameHeight: 32.5
    });
    this.load.spritesheet("enemy", "assets/zombie.png", {
      frameWidth: 318,
      frameHeight: 294
    });
  }

  create() {
    // Background
    let background = this.add.image(400, 300, "background");
    background.setScale(3);

    // Create the player
    this.player = new Player(this, 800, 700, "player");

    // Set world bounds
    this.physics.world.setBounds(60, 60, 1400, 970);

    // Controls
    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });

    // Toggle mini-map with M key
    this.input.keyboard.on('keydown-M', () => {
      this.toggleMiniMap();
    });

    // Camera setup
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setZoom(1.5);
    camera.setBounds(0, 0, 2000, 2000);

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
    if (this.zombies.length < this.maxZombies) {
      const x = Phaser.Math.Between(500, 600);
      const y = Phaser.Math.Between(100, 450);
      const zombie = new Enemy(this, x, y, 'enemy');
      zombie.setScale(0.2);

      this.physics.add.overlap(this.player, zombie, this.handleOverlap, null, this);
      this.zombies.push(zombie);
    }
  }

  createMiniMap() {
    this.miniMapCamera = this.cameras.add(500, 300, 300, 300).setZoom(0.2).setBounds(0, 0, 2000, 2000);
    this.playerMarker = this.add.rectangle(0, 0, 5, 5, 0xff0000).setScrollFactor(0);
  }

  toggleMiniMap() {
    this.isMiniMapVisible = !this.isMiniMapVisible;
    this.miniMapCamera.setVisible(this.isMiniMapVisible);
    this.miniMapBackground.setVisible(this.isMiniMapVisible);
    this.playerMarker.setVisible(this.isMiniMapVisible);
  }

  handleOverlap(player, zombie) {
    if (!this.overlapTimer) {
      this.overlapTimer = this.time.addEvent({
        delay: 3000,
        callback: this.gameOver,
        callbackScope: this
      });
    }
  }

  gameOver() {
    this.scene.start('GameOverScene');
  }

  update() {
    this.player.update(this.cursors);

    this.zombies.forEach(zombie => {
      zombie.update(this.player);
    });

    if (this.isMiniMapVisible) {
      const miniMapX = (this.player.x / 2000) * 300;
      const miniMapY = (this.player.y / 2000) * 300;
      this.playerMarker.setPosition(600 + miniMapX, 400 + miniMapY);
    }

    if (!this.zombies.some(zombie => this.physics.overlap(this.player, zombie))) {
      if (this.overlapTimer) {
        this.overlapTimer.remove();
        this.overlapTimer = null;
      }
    }
  }

  shutdown() {
    if (this.spawnTimer) {
      this.spawnTimer.remove();
    }
    this.zombies = [];
    this.overlapTimer = null;
  }
}