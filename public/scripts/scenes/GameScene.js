import character1 from "/scripts/PlayerCharacters/Character1.js";
import character2 from "/scripts/PlayerCharacters/Character2.js";
import HUD from "/scripts/Hud/hud.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.otherPlayers = {}; // Store other players by their ID
  }

  init(data) {
    this.playerName = data.player.name;
    this.roomCode = data.roomCode;
    this.socket = data.socket;
    this.isHost = data.isHost;
    this.character = data.character; // The selected character from CharacterSelectScene
  }

  preload() {
    this.load.image("bullet", "assets/images/bullet.png");
    this.load.image("open_tileset", "assets/map/open_tileset.png");
    this.load.tilemapTiledJSON("trialMap", "assets/map/city.json");

    this.load.spritesheet("TestPlayer", "assets/Characters/TestPlayer.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("PlayerM", "assets/Characters/PlayerM.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    // Create map layers (unchanged from your original code)
    const map = this.make.tilemap({ key: "trialMap" });
    const tileset = map.addTilesetImage("open_tileset", "open_tileset");
    const groundLayer = map.createLayer("ground", tileset, 0, 0);
    const treea01Layer = map.createLayer("trees 01", tileset, 0, 0);
    const streetsLayer = map.createLayer("streets", tileset, 0, 0);
    const sidewalksLayer = map.createLayer("sidewalks", tileset, 0, 0);
    const buildingLayer = map.createLayer("building", tileset, 0, 0);
    const boxLayer = map.createLayer("boxes", tileset, 0, 0);
    const fencesLayer = map.createLayer("fences", tileset, 0, 0);

    // Group for projectiles
    this.projectiles = this.physics.add.group();

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    fencesLayer.setCollisionByExclusion([-1]);
    buildingLayer.setCollisionByExclusion([-1]);
    boxLayer.setCollisionByExclusion([-1]);
    treea01Layer.setCollisionByExclusion([-1]);

    // Create local player based on selected character
    this.createLocalPlayer();
    // Set up socket listeners for other players
    this.setupSocketListeners();


    this.player.facing = { x: 1, y: 0 }; // default: højre

    this.hud = new HUD(this);


    const walkthrough = map.createLayer("walk through", tileset, 0, 0);
    this.walkthrough = walkthrough;

    this.socket.emit("playerPosition", {
      roomCode: this.roomCode,
      playerId: this.socket.id,
      playerName: this.player.name,
      x: this.player.x,
      y: this.player.y,
      animation: this.player.anims.currentAnim?.key || "idle",
      spriteModel: this.character,
      playerHP: this.player.playerHP,
    });

    // Set initial position
    this.previousX = this.player.x;
    this.previousY = this.player.y;

    this.physics.add.collider(this.player, fencesLayer);
    this.physics.add.collider(this.player, buildingLayer);
    this.physics.add.collider(this.player, boxLayer);
    this.physics.add.collider(this.player, treea01Layer);

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

      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
      shoot: Phaser.Input.Keyboard.KeyCodes.K
    });
  }

  shootProjectile() {
    const bullet = this.projectiles.create(this.player.x, this.player.y, "bullet");
    bullet.setScale(0.1);
    bullet.setCollideWorldBounds(true);
    bullet.body.onWorldBounds = true;
  
    const speed = 400;
    const { x: facingX, y: facingY } = this.player.facing;
  
    const velocityX = facingX * speed;
    const velocityY = facingY * speed;
  
    bullet.setVelocity(velocityX, velocityY);
  
    // Beregn vinkel (i grader) og sæt rotation
    if (facingX !== 0 || facingY !== 0) {
      const angleRad = Math.atan2(facingY, facingX); // radians
      const angleDeg = Phaser.Math.RadToDeg(angleRad); // konverter til grader
      bullet.setAngle(angleDeg);
    }
  
    this.time.delayedCall(1000, () => {
      bullet.destroy();
    });
  
    this.socket.emit("shoot", {
      roomCode: this.roomCode,
      x: this.player.x,
      y: this.player.y,
      velocityX: velocityX,
      velocityY: velocityY,
    });
  }
  

  createLocalPlayer() {
    let startX = 400;
    let startY = 250;
    let playerHP = 100;
    let texture;

    console.log("Creating local player with character:", this.character);

    switch (this.character) {
      case "character1":
        texture = "PlayerM";
        break;
      case "character2":
        texture = "TestPlayer";
        startX = 400;
        startY = 240;
        playerHP = 200;
        break;
      default:
        texture = "TestPlayer";
        break;
    }

    if (this.character === "character1") {
      this.player = new character1(
        this,
        startX,
        startY,
        texture,
        playerHP,
        this.socket
      );
    } else {
      this.player = new character2(
        this,
        startX,
        startY,
        texture,
        playerHP,
        this.socket
      );
    }
    this.player.playerHP = playerHP;
    this.player.isLocalPlayer = true;
    this.player.name = this.playerName;

    const camera = this.cameras.main;
    camera.startFollow(this.player);
    camera.setZoom(3);
  }

  setupSocketListeners() {
    // Listen for other players' position updates
    this.socket.on("playerPositionUpdate", (data) => {
      // Skip if this is our own player
      if (data.playerId === this.socket.id) return;

      // Create player if it doesn't exist yet
      if (!this.otherPlayers[data.playerId]) {
        this.createRemotePlayer(data);
      }

      // Update existing player
      const otherPlayer = this.otherPlayers[data.playerId];
      if (otherPlayer) {
        // Move player to new position
        otherPlayer.x = data.x;
        otherPlayer.y = data.y;
        otherPlayer.playerHp = data.playerHp;
        otherPlayer.spriteModel = data.spriteModel;
        // Play the correct animation
        if (
          data.animation &&
          otherPlayer.anims.currentAnim?.key !== data.animation
        ) {
          otherPlayer.play(data.animation);
          if (data.animation) {
            otherPlayer.play(data.animation);
            if (data.spriteModel === "character1") {
              console.log("Creating remote player with character1:", data.animation);
              otherPlayer.play(data.animation);
            } else if (data.spriteModel === "character2") {
              console.log("Creating remote player with character2:", data.animation);
              otherPlayer.play(data.animation);
            }
          }
        }
      }
    });

    // Shooting
    this.socket.on("player-shoot", (data) => {
      const bullet = this.projectiles.create(data.x, data.y, "bullet");
      bullet.setScale(0.1);
      bullet.setVelocity(data.velocityX, data.velocityY);
      this.time.delayedCall(2000, () => bullet.destroy());
    });

    // Handle player disconnection
    this.socket.on("player-left", (playerId) => {
      // Remove the player sprite if they exist
      if (this.otherPlayers[playerId]) {
        this.otherPlayers[playerId].destroy();
        delete this.otherPlayers[playerId];
      }
    });
  }

  createRemotePlayer(data) {
    let remotePlayer;

    // Create the appropriate character based on their selected model
    if (data.spriteModel === "character1") {
      remotePlayer = new character1(this, data.x, data.y, 'PlayerM');
    } else if (data.spriteModel === "character2") {
      remotePlayer = new character2(this, data.x, data.y, 'TestPlayer');
      startAnimation = "idlePlayerM";
    } else {
      // Default case
      remotePlayer = new character2(this, data.x, data.y, "TestPlayer");
    }

    remotePlayer.isLocalPlayer = false;
    remotePlayer.name = data.playerName;

    // Create a name label above the player
    const nameText = this.add.text(data.x, data.y - 25, data.playerName, { 
      fontSize: '5px', 
      fill: '#ffffff',
      backgroundColor: '#00000080', 
      padding: { x: 3, y: 1 }
    });
    nameText.setOrigin(0.5, 0.5);

    // Store the text reference with the player
    remotePlayer.nameText = nameText;

    // Store the remote player
    this.otherPlayers[data.playerId] = remotePlayer;

    // Play initial animation if available
    if (data.animation) {

      if (data.spriteModel === "character1") {
        remotePlayer.character1.play(data.animation);
      } else if (data.spriteModel === "character2") {
        remotePlayer.character2.play(data.animation);
      }
    }

    return remotePlayer;
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.shoot)) {
      this.shootProjectile();
    }

    if (this.player) {
      this.player.update(this.cursors);

 
      let x = 0;
      let y = 0;
      
      if (this.cursors.w.isDown) y = -1;
      if (this.cursors.s.isDown) y = 1;
      if (this.cursors.a.isDown) x = -1;
      if (this.cursors.d.isDown) x = 1;
      
      this.player.facing = { x, y };
      
      // Flip sprite hvis man går til venstre
      if (x < 0) {
        this.player.setFlipX(true);
      } else if (x > 0) {
        this.player.setFlipX(false);
      }
      


      // Testing damage when "1" is pressed
    if (Phaser.Input.Keyboard.JustDown(this.cursors.one)) {
      // Take damage
      this.player.takeDamage(10); // Reduce health by 10
    }
      // Testing healing when "2" is pressed.
    if (Phaser.Input.Keyboard.JustDown(this.cursors.two)) {
      // Heal
      this.player.heal(10); // Increase health by 10
    }


      for (const playerId in this.otherPlayers) {
        const player = this.otherPlayers[playerId];
        if (player.nameText) {
          player.nameText.x = player.x;
          player.nameText.y = player.y - 25; // Adjust Y offset as needed
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
      
      if (
        this.player.x !== this.previousX ||
        this.player.y !== this.previousY
      ) {
        this.socket.emit("playerPosition", {
          roomCode: this.roomCode,
          playerId: this.socket.id,
          playerName: this.playerName,
          x: this.player.x,
          y: this.player.y,
          animation: this.player.anims.currentAnim?.key || startAnimation,
          spriteModel: this.character,
          playerHP: this.player.playerHP,
        });

        // Update the previous position
        this.previousX = this.player.x;
        this.previousY = this.player.y;      

      }
    }
  }
}
