import character1 from "/scripts/PlayerCharacters/Character1.js";
import character2 from "/scripts/PlayerCharacters/Character2.js";
import character3 from "/scripts/PlayerCharacters/Character3.js";
import character4 from "/scripts/PlayerCharacters/Character4.js";
import characterAnims from "../PlayerCharacters/CharacterAnims.js";
import HUD from "/scripts/Hud/hud.js";
import MultiplayerEnemiesManager from "/scripts/Enemies/enemyManager.js";
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

    this.load.spritesheet("Character3", "assets/Characters/Character3.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    
    this.load.spritesheet("Player4", "assets/Characters/Player4.png", {
      frameWidth: 64,
      frameHeight: 64,
    });




    this.load.spritesheet("zombieB", "assets/zombies/zombieB.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.hud = new HUD(this);
    this.score = 0;
    this.lastFired = 0; // Initialize the cooldown timer
  
    // Create map layers
    const map = this.make.tilemap({ key: "trialMap" });
    const tileset = map.addTilesetImage("open_tileset", "open_tileset");
    const groundLayer = map.createLayer("ground", tileset, 0, 0);
    const treea01Layer = map.createLayer("trees 01", tileset, 0, 0);
    const streetsLayer = map.createLayer("streets", tileset, 0, 0);
    const buildingLayer = map.createLayer("building", tileset, 0, 0);
    const boxLayer = map.createLayer("Boxes", tileset, 0, 0);
    const ParkLayer = map.createLayer("Park", tileset, 0, 0);
    const VandLayer = map.createLayer("Vand", tileset, 0, 0);

    // Group for projectiles and other players. Group is used so we can use physics such as overlaps
    this.projectiles = this.physics.add.group();
    this.otherPlayersGroup = this.physics.add.group();

    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    buildingLayer.setCollisionByExclusion([-1]);
    boxLayer.setCollisionByExclusion([-1]);
    treea01Layer.setCollisionByExclusion([-1]);
    VandLayer.setCollisionByExclusion([-1]);

    // Create local player based on selected character
    this.createLocalPlayer();
    // Set up socket listeners for other players
    this.setupSocketListeners();
    characterAnims.createAnimations(this);

    this.setupEnemies();

    this.player.facing = { x: 1, y: 0 }; // default: højre

    const walkthrough = map.createLayer("walk through", tileset, 0, 0);
    this.walkthrough = walkthrough;

    this.socket.emit("playerPosition", {
      roomCode: this.roomCode,
      playerId: this.socket.id,
      playerName: this.player.name,
      x: this.player.x,
      y: this.player.y,
      animation: this.player.anims.currentAnim?.key,
      spriteModel: this.character,
      playerHP: this.player.playerHP,
    });

    // Set initial position
    this.previousX = this.player.x;
    this.previousY = this.player.y;

    this.physics.add.collider(this.player, buildingLayer);
    this.physics.add.collider(this.player, boxLayer);
    this.physics.add.collider(this.player, treea01Layer);
    this.physics.add.collider(this.player, VandLayer);

    // bullet collisions for buildings and trees
    this.physics.add.collider(this.projectiles, buildingLayer, (bullet) => {
      bullet.destroy();
    });
    this.physics.add.collider(this.projectiles, treea01Layer, (bullet) => {
      bullet.destroy();
    });
    this.physics.add.collider(this.projectiles, boxLayer, (bullet) => {
      bullet.destroy();
    });

    this.physics.add.collider(this.enemiesManager.enemiesGroup, buildingLayer);
    this.physics.add.collider(this.enemiesManager.enemiesGroup, boxLayer);
    this.physics.add.collider(this.enemiesManager.enemiesGroup, treea01Layer);
    this.physics.add.collider(this.enemiesManager.enemiesGroup, VandLayer);

    this.physics.add.overlap(
  this.projectiles,
  this.enemiesManager.enemiesGroup,
  (bullet, enemy) => {
    bullet.destroy();

    // Tjek om fjenden dør
    const wasAlive = enemy.hp > 0;
    enemy.takeDamage(20);
    if (wasAlive && enemy.hp <= 0) {
      this.score += 1;
      this.events.emit("scoreChanged", this.score);
    }
  }
);


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
      shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,

      one: Phaser.Input.Keyboard.KeyCodes.ONE,
      two: Phaser.Input.Keyboard.KeyCodes.TWO,
    });
  }

  // shoot function
  shootProjectile() {
  // Sætter standard retning til den retning spilleren kigger
  let facingX = this.player.facing.x;
  let facingY = this.player.facing.y;

  // Overskirver retningen hvis der er trykket på en af piletasterne
  if (this.cursors.up.isDown) {
    facingX = 0;
    facingY = -1;
  } else if (this.cursors.down.isDown) {
    facingX = 0;
    facingY = 1;
  } else if (this.cursors.left.isDown) {
    facingX = -1;
    facingY = 0;
  } else if (this.cursors.right.isDown) {
    facingX = 1;
    facingY = 0;
  }
  if (this.cursors.up.isDown && this.cursors.left.isDown) {
    facingX = -1;
    facingY = -1;
  } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
    facingX = 1;
    facingY = -1;
  } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
    facingX = -1;
    facingY = 1;
  } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
    facingX = 1;
    facingY = 1;
  }


  // normaliser retningen for at sikre at hastigheden er ens uanset retning
  const direction = new Phaser.Math.Vector2(facingX, facingY).normalize();
  const defaultFacing = new Phaser.Math.Vector2(this.player.facing.x, this.player.facing.y).normalize();

  // Opretter en ny bullet og sætter bulletens position til spillerens position
  const bullet = this.projectiles.create(this.player.x, this.player.y, "bullet");
  bullet.setScale(0.1);
  bullet.setCollideWorldBounds(true);
  bullet.body.onWorldBounds = true;

  bullet.shooterId = this.socket.id;

// Sætter bulletens hastighed

    const speed = 400;
    const velocityX = direction.x * speed;
    const velocityY = direction.y * speed;
  
    bullet.setVelocity(velocityX, velocityY);

  // Udregner bulletens retning og vinkel
  const angleRad = Math.atan2(direction.y, direction.x); // radians
  const angleDeg = Phaser.Math.RadToDeg(angleRad); // convert to degrees
  bullet.setAngle(angleDeg);

  // Ødelægger bulleten efter 1 sekund
  this.time.delayedCall(1000, () => {
    bullet.destroy();
  });

  // Sender bulletens data til serveren
  this.socket.emit("shoot", {
    roomCode: this.roomCode,
    x: this.player.x,
    y: this.player.y,
    velocityX: velocityX,
    velocityY: velocityY,
    angle: angleDeg,
    speed: speed,
    facingX: direction.x,
    facingY: direction.y,
    playerId: this.socket.id,
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
        texture = "PlayerM";
        startX = 400;
        startY = 240;
        playerHP = 200;
        break;
      case "character3":
        texture = "Character3";
        startX = 400;
        startY = 240;
        playerHP = 200;
        break;
      case "character4":
        texture = "Player4";
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
        this, // scene
        startX, // x
        startY, // y
        texture, // texture
        playerHP, // playerHP
        this.socket, // socket
        this.hud // hud reference
      );
    } else if (this.character === "character2") {
      this.player = new character2(
        this, // scene
        startX, // x
        startY, // y
        texture, // texture
        playerHP, // playerHP
        this.socket, // socket
        this.hud // hud reference
      );
    } else if (this.character === "character3") {
      this.player = new character3(
        this, // scene
        startX, // x
        startY, // y
        texture, // texture
        playerHP, // playerHP
        this.socket, // socket
        this.hud // hud reference
      );
    } else {
      this.player = new character4(
        this, // scene
        startX, // x
        startY, // y
        texture, // texture
        playerHP, // playerHP
        this.socket, // socket
        this.hud // hud reference
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
      if (otherPlayer && otherPlayer.active) {
        // Move player to new position
        otherPlayer.x = data.x;
        otherPlayer.y = data.y;
        otherPlayer.playerHP = data.playerHP;
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
              console.log(
                "Creating remote player with character1:",
                data.animation
              );
              otherPlayer.play(data.animation);
            } else if (data.spriteModel === "character2") {
              console.log(
                "Creating remote player with character2:",
                data.animation
              );
              otherPlayer.play(data.animation);
            } else if (data.spriteModel === "character3") {
              console.log(
                "Creating remote player with character3:",
                data.animation
              );
              otherPlayer.play(data.animation);
            } else if (data.spriteModel === "character4") {
              console.log(
                "Creating remote player with character4:",
                data.animation
              );
              otherPlayer.play(data.animation);
            }
          }
          this.socket.on("player-death", (data) => {
            const playerId = data.playerId;
            // If it's our own player, transition to game over
            if (playerId === this.socket.id) {
              this.scene.start("GameOverScene", {
                playerName: this.playerName,
                roomCode: this.roomCode,
              });
              return;
            }
            // If it's another player, remove their sprite
            if (this.otherPlayers[playerId]) {
              this.otherPlayers[playerId].destroy();
              if (this.otherPlayers[playerId].nameText) {
                this.otherPlayers[playerId].nameText.destroy();
              }
              delete this.otherPlayers[playerId];
            }
          });
        }
      }
    });

    // Shooting
    this.socket.on("player-shoot", (data) => {
      const bullet = this.projectiles.create(data.x, data.y, "bullet");
      bullet.setScale(0.1);

      // Make sure we use the same speed for remote bullets
      bullet.setVelocity(data.velocityX, data.velocityY);

      // Set the bullet angle
      if (data.angle !== undefined) {
        bullet.setAngle(data.angle);
      } else {
        // Calculate angle from velocity components as fallback
        const angleRad = Math.atan2(data.velocityY, data.velocityX);
        const angleDeg = Phaser.Math.RadToDeg(angleRad);
        bullet.setAngle(angleDeg);
      }

      bullet.shooterId = data.playerId;

      this.time.delayedCall(1000, () => bullet.destroy());
      console.log(
        "Remote bullet fired with velocity:",
        data.velocityX,
        data.velocityY
      );
    });

    this.socket.on("player-died", (data) => {
      const playerId = data.playerId;

      // For local player
      if (data.playerId === this.socket.id) {
        // Clean up before scene transition
        this.cleanupBeforeSceneChange();
        this.scene.start("GameOverScene", {
          playerName: this.playerName,
          roomCode: this.roomCode,
        });
        return;
      }

      // For remote players
      if (this.otherPlayers[data.playerId]) {
        const player = this.otherPlayers[data.playerId];
        // Safe cleanup
        if (player.nameText) player.nameText.destroy();
        player.destroy();
        delete this.otherPlayers[data.playerId];
      }
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

  // Add cleanup method
  cleanupBeforeSceneChange() {
    // Clean up player
    if (this.player) {
      if (this.player.nameText) this.player.nameText.destroy();
      this.player.destroy();
      this.player = null;
    }

    // Clean up other players
    Object.values(this.otherPlayers).forEach((player) => {
      if (player.nameText) player.nameText.destroy();
      player.destroy();
    });
    this.otherPlayers = {};

    // Remove all socket listeners
    this.socket.off("player-died");
    this.socket.off("playerPositionUpdate");
    this.socket.off("player-shoot");
    // Add other event listeners you need to remove
  }

  createRemotePlayer(data) {
    if (!this.scene || !this.scene.isActive()) return null;
    let remotePlayer;

    // Create the appropriate character based on their selected model
    if (data.spriteModel === "character1") {
      remotePlayer = new character1(this, data.x, data.y, "PlayerM");
    } else if (data.spriteModel === "character2") {
      remotePlayer = new character2(this, data.x, data.y, "TestPlayer");
      startAnimation = "idlePlayerM";
    } else if (data.spriteModel === "character3") {
      remotePlayer = new character3(this, data.x, data.y, "Character3");
      startAnimation = "idleCharacter3";
    } else if (data.spriteModel === "character4") {
      remotePlayer = new character4(this, data.x, data.y, "Player4");
      startAnimation = "idlePlayer4";
    } else {
      // Default case
      remotePlayer = new character3(this, data.x, data.y, "Character3");
    }

    remotePlayer.isLocalPlayer = false;
    remotePlayer.name = data.playerName;

    remotePlayer.playerId = data.playerId;
    remotePlayer.playerHP = data.playerHP;

    // Create a name label above the player
    const nameText = this.add.text(data.x, data.y - 25, data.playerName, {
      fontSize: "5px",
      fill: "#ffffff",
      backgroundColor: "#00000080",
      padding: { x: 3, y: 1 },
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
      } else if (data.spriteModel === "character3") {
        remotePlayer.character3.play(data.animation);
      } else if (data.spriteModel === "character4") {
        remotePlayer.character4.play(data.animation);
      }
    }

    // add remote player to group for collisions with projectile
    this.otherPlayersGroup.add(remotePlayer);

    // Add to allPlayers group
    if (this.allPlayers) {
      this.allPlayers.add(remotePlayer);
    }

    return remotePlayer;
  }

  setupEnemies() {
    // Create the enemies manager
    this.enemiesManager = new MultiplayerEnemiesManager(
      this,
      this.socket,
      this.roomCode
    );

    // If this client is the host, spawn some initial enemies
    if (this.isHost) {
      // Set up a timer to spawn new enemies periodically
      this.time.addEvent({
        delay: 1000, // 20 seconds
        callback: this.spawnPeriodicEnemy,
        callbackScope: this,
        loop: true,
      });
    }
    // Create a group for all players (local and remote)
    this.allPlayers = this.add.group();
    this.allPlayers.add(this.player);

    // Add remote players to the group
    Object.values(this.otherPlayers).forEach((player) => {
      this.allPlayers.add(player);
    });

    // Set up collisions between players and enemies
    this.enemiesManager.setupCollisions(this.allPlayers);
  }


  spawnPeriodicEnemy() {
    if (!this.isHost) return;

    // Choose a random spawn point at the edge of the current camera view
    const camera = this.cameras.main;
    const spawnSide = Phaser.Math.Between(0, 3); // 0: top, 1: right, 2: bottom, 3: left

    let x, y;
    const padding = 50; // Distance outside the view
    const cameraWidth = camera.width;
    const cameraHeight = camera.height;

    switch (spawnSide) {
      case 0: // top
        x = camera.scrollX + Phaser.Math.Between(0, cameraWidth);
        y = camera.scrollY - padding;
        break;
      case 1: // right
        x = camera.scrollX + cameraWidth + padding;
        y = camera.scrollY + Phaser.Math.Between(0, cameraHeight);
        break;
      case 2: // bottom
        x = camera.scrollX + Phaser.Math.Between(0, cameraWidth);
        y = camera.scrollY + cameraHeight + padding;
        break;
      case 3: // left
        x = camera.scrollX - padding;
        y = camera.scrollY + Phaser.Math.Between(0, cameraHeight);
        break;
    }

    // Spawn the enemy
    this.enemiesManager.spawnEnemy(x, y, "enemy");
  }

  update(time, delta) {
    if (!this.player || !this.player.active || !this.player.body) {
      return;
    }
    const fireRate = 250; // Cooldown in milliseconds (e.g., 500ms = 0.5 seconds)


    if (time > this.lastFired + fireRate) {
      if (this.cursors.up.isDown && this.cursors.left.isDown) {
        this.shootProjectile(-1, -1); // Fire diagonally upward-left
        this.lastFired = time; // Update the cooldown timer
      } else if (this.cursors.up.isDown && this.cursors.right.isDown) {
        this.shootProjectile(1, -1); // Fire diagonally upward-right
        this.lastFired = time;
      } else if (this.cursors.down.isDown && this.cursors.left.isDown) {
        this.shootProjectile(-1, 1); // Fire diagonally downward-left
        this.lastFired = time;
      } else if (this.cursors.down.isDown && this.cursors.right.isDown) {
        this.shootProjectile(1, 1); // Fire diagonally downward-right
        this.lastFired = time;
      } else if (this.cursors.up.isDown) {
        this.shootProjectile(0, -1); // Fire upward
        this.lastFired = time;
      } else if (this.cursors.down.isDown) {
        this.shootProjectile(0, 1); // Fire downward
        this.lastFired = time;
      } else if (this.cursors.left.isDown) {
        this.shootProjectile(-1, 0); // Fire left
        this.lastFired = time;
      } else if (this.cursors.right.isDown) {
        this.shootProjectile(1, 0); // Fire right
        this.lastFired = time;
      }
    }
    

    if (this.player) {
      this.player.update(this.cursors);

      let x = 0;
      let y = 0;
      
      if (this.cursors.w.isDown) y = -1;
      if (this.cursors.s.isDown) y = 1;
      if (this.cursors.a.isDown) x = -1;
      if (this.cursors.d.isDown) x = 1;
      
      // Kun opdater facing, hvis der er input
      if (x !== 0 || y !== 0) {
        this.player.facing = { x, y };
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

      // Update other players' name text positions
      for (const playerId in this.otherPlayers) {
        const player = this.otherPlayers[playerId];
        if (player.nameText) {
          player.nameText.x = player.x;
          player.nameText.y = player.y - 25; // Adjust Y offset as needed
        }
      }

      // Always update the enemies manager, regardless of host status
      if (this.enemiesManager) {
        this.enemiesManager.update(time, delta);
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
        if (this.player && this.player.anims && this.player.active) {
          const currentAnim =
            this.player.anims.currentAnim?.key || "idlePlayerM"; // Default fallback
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
        }

        // Update the previous position
        this.previousX = this.player.x;
        this.previousY = this.player.y;
      }
    }
  }
}