import CharacterAnims from "../PlayerCharacters/CharacterAnims.js";

export default class character1 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, playerHP, socket, hud) {
    super(scene, x, y, texture);
    // Store the scene and socket for later use
    this.scene = scene;
    this.socket = socket;
    this.animation = "idleTestPlayer";
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
        if (cursors.a.isDown && cursors.w.isDown) {
          this.setVelocity(-sprintVelocit, -sprintVelocit);
          this.anims.play("sprintUpTestPlayer", true);
          this.animation = "sprintUpTestPlayer";
        } else if (cursors.a.isDown && cursors.s.isDown) {
          this.setVelocity(-sprintVelocit, sprintVelocit);
          this.anims.play("sprintDownTestPlayer", true);
          this.animation = "sprintDownTestPlayer";
        } else if (cursors.d.isDown && cursors.w.isDown) {
          this.setVelocity(sprintVelocit, -sprintVelocit);
          this.anims.play("sprintUpTestPlayer", true);
          this.animation = "sprintUpTestPlayer";
        } else if (cursors.d.isDown && cursors.s.isDown) {
          this.setVelocity(sprintVelocit, sprintVelocit);
          this.anims.play("sprintDownTestPlayer", true);
          this.animation = "sprintDownTestPlayer";
        } else if (cursors.a.isDown) {
          this.setVelocityX(-sprintVelocit);
          this.anims.play("sprintLeftTestPlayer", true);
          this.animation = "sprintLeftTestPlayer";
        } else if (cursors.d.isDown) {
          this.setVelocityX(sprintVelocit);
          this.anims.play("sprintRightTestPlayer", true);
          this.animation = "sprintRightTestPlayer";
        } else if (cursors.w.isDown) {
          this.setVelocityY(-sprintVelocit);
          this.anims.play("sprintUpTestPlayer", true);
          this.animation = "sprintUpTestPlayer";
        } else if (cursors.s.isDown) {
          this.setVelocityY(sprintVelocit);
          this.anims.play("sprintDownTestPlayer", true);
          this.animation = "sprintDownTestPlayer";
        }
      }
      // Walk movement
      else if (cursors.a.isDown && cursors.w.isDown) {
        this.setVelocity(-velocity, -velocity);
        this.anims.play("walkUpTestPlayer", true);
        this.animation = "walkUpTestPlayer";
      } else if (cursors.a.isDown && cursors.s.isDown) {
        this.setVelocity(-velocity, velocity);
        this.anims.play("walkDownTestPlayer", true);
        this.animation = "walkDownTestPlayer";
      } else if (cursors.d.isDown && cursors.w.isDown) {
        this.setVelocity(velocity, -velocity);
        this.anims.play("walkUpTestPlayer", true);
        this.animation = "walkUpTestPlayer";
      } else if (cursors.d.isDown && cursors.s.isDown) {
        this.setVelocity(velocity, velocity);
        this.anims.play("walkDownTestPlayer", true);
        this.animation = "walkDownTestPlayer";
      }
      // Straight walk
      else if (cursors.a.isDown) {
        this.setVelocityX(-velocity);
        this.anims.play("walkLeftTestPlayer", true);
        this.animation = "walkLeftTestPlayer";
      } else if (cursors.d.isDown) {
        this.setVelocityX(velocity);
        this.anims.play("walkRightTestPlayer", true);
        this.animation = "walkRightTestPlayer";
      } else if (cursors.w.isDown) {
        this.setVelocityY(-velocity);
        this.anims.play("walkUpTestPlayer", true);
        this.animation = "walkUpTestPlayer";
      } else if (cursors.s.isDown) {
        this.setVelocityY(velocity);
        this.anims.play("walkDownTestPlayer", true);
        this.animation = "walkDownTestPlayer";
      }
      // Idle animation
      else {
        this.setVelocity(0, 0);
        this.anims.play("idleTestPlayer", true);
        this.animation = "idleTestPlayer";
      }

      // **Fix: Explicitly stop movement when keys are released**
      if (!cursors.a.isDown && !cursors.d.isDown) {
        this.setVelocityX(0);
      }

      if (!cursors.w.isDown && !cursors.s.isDown) {
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
      this.isDead = true;
      this.scene.socket.emit("player-death", {
        roomCode: this.scene.roomCode,
        playerId: this.scene.socket.id,
      });
      // Disconnect immediately
      this.socket.disconnect();

      // Transition to GameOver scene
      const scene = this.scene;
      scene.time.delayedCall(100, () => {
        scene.scene.start("GameOverScene", {
          playerName: scene.playerName,
          score: scene.score || 0,
        });
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
