export default class character1 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, playerHP, socket) {
        super(scene, x, y, texture);
        // Store the scene and socket for later use
        this.scene = scene;
        this.socket = socket; // Store the socket instance
        this.animation = "idle";
        this.isLocalPlayer = false; // Default to false, set to true for the local player
        // Add the player to the scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this); // Corrected line
        //Add health for healtbar logic
        this.health = playerHP;
        this.maxHealth = playerHP;
    
        // Set player properties
        this.setScale(0.5);
        this.setCollideWorldBounds(true);
    
        //Physics body
        this.body.setCircle(16, 16, 16);
    
        // Define animations
        this.createAnimations(scene);
      }

      createAnimations(scene) {
        // Define animations
        scene.anims.create({
          key: "walkUpTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 105,
            end: 112,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "walkDownTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 131,
            end: 138,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "walkRightTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 144,
            end: 151,
          }),
          frameRate: 20,
          repeat: -1,
        });

        scene.anims.create({
          key: "walkLeftTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 118,
            end: 125,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "idleTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 27,
            end: 29,
          }),
          frameRate: 5,
          repeat: -1,
        });

        scene.anims.create({
          key: "sprintLeftTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 507,
            end: 514,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintRightTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 533,
            end: 540,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintUpTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 494,
            end: 500,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintDownTestPlayer",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 520,
            end: 527,
          }),
          frameRate: 20,
          repeat: -1,
        });
      }
    
      update(cursors) {
        let velocity = 160;
        let sprintVelocit = 300;
    
        const previousAnimation = this.animation;
        if (this.isLocalPlayer) {
          // Movement logic
          if (cursors.shift.isDown) {
            if (
              (cursors.a.isDown && cursors.w.isDown) ||
              (cursors.left.isDown && cursors.up.isDown)
            ) {
              this.setVelocity(-sprintVelocit, -sprintVelocit);
              this.anims.play("sprintUpTestPlayer", true);
              this.animation = "sprintUpTestPlayer";
            } else if (
              (cursors.a.isDown && cursors.s.isDown) ||
              (cursors.left.isDown && cursors.down.isDown)
            ) {
              this.setVelocity(-sprintVelocit, sprintVelocit);
              this.anims.play("sprintDownTestPlayer", true);
              this.animation = "sprintDownTestPlayer";
            } else if (
              (cursors.d.isDown && cursors.w.isDown) ||
              (cursors.right.isDown && cursors.up.isDown)
            ) {
              this.setVelocity(sprintVelocit, -sprintVelocit);
              this.anims.play("sprintUpTestPlayer", true);
              this.animation = "sprintUpTestPlayer";
            } else if (
              (cursors.d.isDown && cursors.s.isDown) ||
              (cursors.right.isDown && cursors.down.isDown)
            ) {
              this.setVelocity(sprintVelocit, sprintVelocit);
              this.anims.play("sprintDownTestPlayer", true);
              this.animation = "sprintDownTestPlayer";
            } else if (cursors.a.isDown || cursors.left.isDown) {
              this.setVelocityX(-sprintVelocit);
              this.anims.play("sprintLeftTestPlayer", true);
              this.animation = "sprintLeftTestPlayer";
            } else if (cursors.d.isDown || cursors.right.isDown) {
              this.setVelocityX(sprintVelocit);
              this.anims.play("sprintRightTestPlayer", true);
              this.animation = "sprintRightTestPlayer";
            } else if (cursors.w.isDown || cursors.up.isDown) {
              this.setVelocityY(-sprintVelocit);
              this.anims.play("sprintUpTestPlayer", true);
              this.animation = "sprintUpTestPlayer";
            } else if (cursors.s.isDown || cursors.down.isDown) {
              this.setVelocityY(sprintVelocit);
              this.anims.play("sprintDownTestPlayer", true);
              this.animation = "sprintDownTestPlayer";
            }
          }
          // Walk movement
          else if (
            (cursors.a.isDown && cursors.w.isDown) ||
            (cursors.left.isDown && cursors.up.isDown)
          ) {
            this.setVelocity(-velocity, -velocity);
            this.flipX = true;
            this.anims.play("walkUpTestPlayer", true);
            this.animation = "walkUpTestPlayer";
          } else if (
            (cursors.a.isDown && cursors.s.isDown) ||
            (cursors.left.isDown && cursors.down.isDown)
          ) {
            this.setVelocity(-velocity, velocity);
            this.flipX = true;
            this.anims.play("walkDownTestPlayer", true);
            this.animation = "walkDownTestPlayer";
          } else if (
            (cursors.d.isDown && cursors.w.isDown) ||
            (cursors.right.isDown && cursors.up.isDown)
          ) {
            this.setVelocity(velocity, -velocity);
            this.flipX = false;
            this.anims.play("walkUpTestPlayer", true);
            this.animation = "walkUpTestPlayer";
          } else if (
            (cursors.d.isDown && cursors.s.isDown) ||
            (cursors.right.isDown && cursors.down.isDown)
          ) {
            this.setVelocity(velocity, velocity);
            this.flipX = false;
            this.anims.play("walkDownTestPlayer", true);
            this.animation = "walkDownTestPlayer";
          }
          // Straight walk
          else if (cursors.a.isDown || cursors.left.isDown) {
            this.setVelocityX(-velocity);
            this.anims.play("walkLeftTestPlayer", true);
            this.animation = "walkLeftTestPlayer";
          } else if (cursors.d.isDown || cursors.right.isDown) {
            this.setVelocityX(velocity);
            this.flipX = false;
            this.anims.play("walkRightTestPlayer", true);
            this.animation = "walkRightTestPlayer";
          } else if (cursors.w.isDown || cursors.up.isDown) {
            this.setVelocityY(-velocity);
            this.anims.play("walkUpTestPlayer", true);
            this.animation = "walkUpTestPlayer";
          } else if (cursors.s.isDown || cursors.down.isDown) {
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
          if (
            !cursors.left.isDown &&
            !cursors.right.isDown &&
            !cursors.a.isDown &&
            !cursors.d.isDown
          ) {
            this.setVelocityX(0);
          }
    
          if (
            !cursors.up.isDown &&
            !cursors.down.isDown &&
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
      takeDamage(amount){
        this.health -= amount;
        if (this.health < 0){
          this.health = 0;
        }

        //Emit an event to notify about the damage
        this.scene.events.emit("playerHealthChanged", this.health, this.maxHealth);
      }
      heal(amount){
        this.health += amount;
        if (this.health > this.maxHealth){
          this.health = this.maxHealth;
        }
        
        //Emit an event to notify about the heal
        this.scene.events.emit("playerHealthChanged", this.health, this.maxHealth);
      }
    }
    