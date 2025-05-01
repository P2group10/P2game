import CharacterAnims from "../PlayerCharacters/CharacterAnims.js";
export default class character2 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, playerHP, socket, hud) {
    super(scene, x, y, texture);
    // Store the scene and socket for later use
    this.scene = scene;
    this.socket = socket;
    this.animation = "idlePlayerM";
    this.isLocalPlayer = false;
    this.hud = hud || null; // Store HUD reference

    // Add the player to the scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    //Add health for healthbar logic
    this.health = playerHP || 100; // Default value if not provided
    this.maxHealth = this.health;

    // Set player properties
    this.setScale(0.5);
    this.setCollideWorldBounds(true);

    //Physics body
    this.body.setCircle(16, 16, 16);

    // Ensure animations are created (only needed once)
    CharacterAnims.createAnimations(scene);
  }

  update(cursors) {
    let velocity = 160;
    let sprintVelocit = 300;

    const previousAnimation = this.animation;
    if (this.isLocalPlayer) {
      // Movement logic
      if (cursors.shift.isDown) {
        if (
          (cursors.a.isDown && cursors.w.isDown) 
        ) {
          this.setVelocity(-sprintVelocit, -sprintVelocit);
          this.anims.play("sprintUpPlayerM", true);
          this.animation = "sprintUpPlayerM";
        } else if (
          (cursors.a.isDown && cursors.s.isDown) 
        ) {
          this.setVelocity(-sprintVelocit, sprintVelocit);
          this.anims.play("sprintDownPlayerM", true);
          this.animation = "sprintDownPlayerM";
        } else if (
          (cursors.d.isDown && cursors.w.isDown) 
        ) {
          this.setVelocity(sprintVelocit, -sprintVelocit);
          this.anims.play("sprintUpPlayerM", true);
          this.animation = "sprintUpPlayerM";
        } else if (
          (cursors.d.isDown && cursors.s.isDown)
        ) {
          this.setVelocity(sprintVelocit, sprintVelocit);
          this.anims.play("sprintDownPlayerM", true);
          this.animation = "sprintDownPlayerM";
        } else if (cursors.a.isDown ) {
          this.setVelocityX(-sprintVelocit);
          this.anims.play("sprintLeftPlayerM", true);
          this.animation = "sprintLeftPlayerM";
        } else if (cursors.d.isDown) {
          this.setVelocityX(sprintVelocit);
          this.anims.play("sprintRightPlayerM", true);
          this.animation = "sprintRightPlayerM";
        } else if (cursors.w.isDown ) {
          this.setVelocityY(-sprintVelocit);
          this.anims.play("sprintUpPlayerM", true);
          this.animation = "sprintUpPlayerM";
        } else if (cursors.s.isDown ) {
          this.setVelocityY(sprintVelocit);
          this.anims.play("sprintDownPlayerM", true);
          this.animation = "sprintDownPlayerM";
        }
      }
      // Walk movement
      else if (
        (cursors.a.isDown && cursors.w.isDown)
      ) {
        this.setVelocity(-velocity, -velocity);
        this.anims.play("walkUpPlayerM", true);
        this.animation = "walkUpPlayerM";
      } else if (
        (cursors.a.isDown && cursors.s.isDown) 
      ) {
        this.setVelocity(-velocity, velocity);
        this.anims.play("walkDownPlayerM", true);
        this.animation = "walkDownPlayerM";
      } else if (
        (cursors.d.isDown && cursors.w.isDown)
      ) {
        this.setVelocity(velocity, -velocity);
        this.anims.play("walkUpPlayerM", true);
        this.animation = "walkUpPlayerM";
      } else if (
        (cursors.d.isDown && cursors.s.isDown) 
      ) {
        this.setVelocity(velocity, velocity);
        this.anims.play("walkDownPlayerM", true);
        this.animation = "walkDownPlayerM";
      }
      // Straight walk
      else if (cursors.a.isDown) {
        this.setVelocityX(-velocity);
        this.anims.play("walkLeftPlayerM", true);
        this.animation = "walkLeftPlayerM";
      } else if (cursors.d.isDown ) {
        this.setVelocityX(velocity);
        this.flipX = false;
        this.anims.play("walkRightPlayerM", true);
        this.animation = "walkRightPlayerM";
      } else if (cursors.w.isDown ) {
        this.setVelocityY(-velocity);
        this.anims.play("walkUpPlayerM", true);
        this.animation = "walkUpPlayerM";
      } else if (cursors.s.isDown ) {
        this.setVelocityY(velocity);
        this.anims.play("walkDownPlayerM", true);
        this.animation = "walkDownPlayerM";
      }
      // Idle animation
      else {
        this.setVelocity(0, 0);
        this.anims.play("idlePlayerM", true);
        this.animation = "idlePlayerM";
      }

      // **Fix: Explicitly stop movement when keys are released**
      if (
        !cursors.a.isDown &&
        !cursors.d.isDown
      ) {
        this.setVelocityX(0);
      }

      if (
        !cursors.w.isDown &&
        !cursors.s.isDown
      ) {
        this.setVelocityY(0);
      }

      // Emit the animation state to the server if it has changed
      if (this.animation !== previousAnimation) {
        console.log("Animation state:", this.animation);
        this.socket.emit("setPlayerAnimation", this.animation);
      }
    }
  }
  takeDamage(amount) {
    // Safety check for scene
    if (!this.scene || !this.scene.scene) {
      console.error("Scene or scene manager is undefined in takeDamage!");
      return;
    }

    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }

    // Update HUD if available
    if (this.hud && typeof this.hud.updateHealth === "function") {
      this.hud.updateHealth(this.health);
    } else if (this.scene.hud) {
      this.scene.hud.updateHealth(this.health);
    }

    // Flash effect
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });

    // Emit health update
    if (this.scene.socket) {
      this.scene.socket.emit("playerPosition", {
        roomCode: this.scene.roomCode,
        playerId: this.scene.socket.id,
        playerName: this.scene.playerName,
        x: this.x,
        y: this.y,
        animation: this.anims?.currentAnim?.key,
        spriteModel: this.scene.character,
        playerHP: this.health,
      });
    }

    // Emit health changed event
    if (this.scene.events) {
      this.scene.events.emit(
        "playerHealthChanged",
        this.health,
        this.maxHealth
      );
    }

    // Check for death
    if (this.health <= 0) {
      if (this.scene.socket) {
        this.scene.socket.emit("player-death", {
          roomCode: this.scene.roomCode,
          playerId: this.scene.socket.id,
        });
      }

      // Store scene reference before destroying the player
      const scene = this.scene;

      // Destroy player
      this.destroy();
      if (this.nameText) {
        this.nameText.destroy();
      }

      // Use a delayed call to ensure clean transition
      scene.time.delayedCall(100, () => {
        if (scene.scene) {
          // Check if scene manager still exists
          scene.scene.start("GameOverScene", {
            playerName: scene.playerName,
            score: scene.score || 0,
            isWinner: false,
          });
        }
      });
    }
  }
  heal(amount) {
    this.health += amount;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }

    //Emit an event to notify about the heal
    this.scene.events.emit("playerHealthChanged", this.health, this.maxHealth);
  }
}
