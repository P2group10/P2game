// MainGameScene.js
import Player from "./characters.js";
import Enemy from "./enemies.js";
const socket = io();

export default class MainGameScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainGameScene" });
    this.players = {};
    this.overlapTimer = null;
    this.isMiniMapVisible = true;
    this.zombies = [];
    this.maxZombies = 5;
    this.spawnInterval = 2000;
    socket.on("playerPositionUpdate", (data) => {
      const tableData = [
        {
          Player: data.playerName, // Ensure this matches the key sent from the server
          ID: data.playerId,       // Ensure this matches the key sent from the server
          X: data.x,               // Ensure this matches the key sent from the server
          Y: data.y                // Ensure this matches the key sent from the server
        }
      ];
      console.table(tableData);
    });
  }
  preload() {
    this.load.image("open_tileset", "assets/Tilemap/open_tileset.png");
    this.load.tilemapTiledJSON("trialMap", "assets/Tilemap/city.json");
    this.load.spritesheet("player", "assets/TestPlayer.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("pplayer", "assets/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("enemy", "assets/zombies.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    socket.emit("sceneLoaded", "MaingameScene");
    // Create the tilemap
    const map = this.make.tilemap({ key: "trialMap" });

    // Add the tileset image to the tilemap
    const tileset = map.addTilesetImage("open_tileset", "open_tileset");

    // Create the layers from the tilemap
    const groundLayer = map.createLayer("ground", tileset, 0, 0);
    const treea01Layer = map.createLayer("trees 01", tileset, 0, 0);
    const streetsLayer = map.createLayer("streets", tileset, 0, 0);
    const sidewalksLayer = map.createLayer("sidewalks", tileset, 0, 0);
    const buildingLayer = map.createLayer("building", tileset, 0, 0);
    const walkthrough = map.createLayer("walk through", tileset, 0, 0);
    const boxLayer = map.createLayer("boxes", tileset, 0, 0);
    const fencesLayer = map.createLayer("fences", tileset, 0, 0);

    this.walkthrough = walkthrough;

    fencesLayer.setCollisionByExclusion([-1]);
    buildingLayer.setCollisionByExclusion([-1]);
    boxLayer.setCollisionByExclusion([-1]);
    treea01Layer.setCollisionByExclusion([-1]);

    // Create the player
    this.player = new Player(this, 800, 700, "player");
    socket.emit("playerPosition", { x: this.player.x, y: this.player.y });
    this.physics.add.collider(this.player, fencesLayer);
    this.physics.add.collider(this.player, buildingLayer);
    this.physics.add.collider(this.player, boxLayer);
    this.physics.add.collider(this.player, treea01Layer);
    this.physics.add.collider(this.zombies, fencesLayer);
    this.physics.add.collider(this.zombies, buildingLayer);
    this.physics.add.collider(this.zombies, boxLayer);
    this.physics.add.collider(this.zombies, treea01Layer);

    // Adds collidition between the zombies and the player
    this.physics.add.collider(this.player, this.zombies);

    // Adds collidition between zombies, IDK why some zombies can still overlap, happens when player pushes one zombie into another
    this.physics.add.collider(this.zombies, this.zombies);

    // Set world bounds to match the tilemap size
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Set camera bounds to match the tilemap size
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Controls
    this.cursors = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });

    // Toggle mini-map with M key
    this.input.keyboard.on("keydown-M", () => {
      this.toggleMiniMap();
    });

    // Camera setup
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setZoom(3);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Initialize zombie spawner
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnZombie,
      callbackScope: this,
      loop: true,
    });

    // Create mini-map
    this.createMiniMap();
  }

  spawnZombie() {
    if (this.zombies.length < this.maxZombies) {
      const x = Phaser.Math.Between(500, 600);
      const y = Phaser.Math.Between(100, 450);
      const zombie = new Enemy(this, x, y, "enemy");
      zombie.setScale(0.5);

      this.physics.add.overlap(
        this.player,
        zombie,
        this.handleOverlap,
        null,
        this
      );
      this.zombies.push(zombie);
    }
  }

  createMiniMap() {
    this.miniMapCamera = this.cameras
      .add(500, 300, 300, 300)
      .setZoom(0.5)
      .setBounds(0, 0, 2000, 2000);
    this.miniMapCamera.startFollow(this.player);
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
        callbackScope: this,
      });
    }
  }

  gameOver() {
    this.scene.start("GameOverScene");
  }

  update() {

    this.player.update(this.cursors);
    socket.emit("playerPosition", { x: this.player.x, y: this.player.y });

    // Update remote players
    for (const id in this.players) {
      if (id !== socket.id) {
        // Remote players don't need to handle input, just update their positions
        this.players[id].update(); // Ensure the Player class has an update method for remote players
      }
    }

    this.zombies.forEach((zombie) => {
      zombie.update(this.player);
    });

    if (
      !this.zombies.some((zombie) => this.physics.overlap(this.player, zombie))
    ) {
      if (this.overlapTimer) {
        this.overlapTimer.remove();
        this.overlapTimer = null;
      }
    }
    const playerTile = this.walkthrough.worldToTileXY(
      this.player.x,
      this.player.y
    );
    const tile = this.walkthrough.getTileAt(playerTile.x, playerTile.y);

    if (tile) {
      this.walkthrough.setAlpha(0.5);
    } else {
      this.walkthrough.setAlpha(1);
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
