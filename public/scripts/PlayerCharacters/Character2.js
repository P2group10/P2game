export default class character2 extends Phaser.Physics.Arcade.Sprite {
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
          key: "walkUpPlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
            start: 105,
            end: 112,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "walkDownPlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
            start: 131,
            end: 138,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "walkRightPlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
            start: 144,
            end: 151,
          }),
          frameRate: 20,
          repeat: -1,
        });

        scene.anims.create({
          key: "walkLeftPlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
            start: 118,
            end: 125,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "idlePlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
            start: 27,
            end: 29,
          }),
          frameRate: 5,
          repeat: -1,
        });

        scene.anims.create({
          key: "sprintLeftPlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
            start: 507,
            end: 514,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintRightPlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
            start: 533,
            end: 540,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintUpPlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
            start: 494,
            end: 500,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintDownPlayerM",
          frames: scene.anims.generateFrameNumbers("PlayerM", {
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
              this.anims.play("sprintUpPlayerM", true);
              this.animation = "sprintUpPlayerM";
            } else if (
              (cursors.a.isDown && cursors.s.isDown) ||
              (cursors.left.isDown && cursors.down.isDown)
            ) {
              this.setVelocity(-sprintVelocit, sprintVelocit);
              this.anims.play("sprintDownPlayerM", true);
              this.animation = "sprintDownPlayerM";
            } else if (
              (cursors.d.isDown && cursors.w.isDown) ||
              (cursors.right.isDown && cursors.up.isDown)
            ) {
              this.setVelocity(sprintVelocit, -sprintVelocit);
              this.anims.play("sprintUpPlayerM", true);
              this.animation = "sprintUpPlayerM";
            } else if (
              (cursors.d.isDown && cursors.s.isDown) ||
              (cursors.right.isDown && cursors.down.isDown)
            ) {
              this.setVelocity(sprintVelocit, sprintVelocit);
              this.anims.play("sprintDownPlayerM", true);
              this.animation = "sprintDownPlayerM";
            } else if (cursors.a.isDown || cursors.left.isDown) {
              this.setVelocityX(-sprintVelocit);
              this.anims.play("sprintLeftPlayerM", true);
              this.animation = "sprintLeftPlayerM";
            } else if (cursors.d.isDown || cursors.right.isDown) {
              this.setVelocityX(sprintVelocit);
              this.anims.play("sprintRightPlayerM", true);
              this.animation = "sprintRightPlayerM";
            } else if (cursors.w.isDown || cursors.up.isDown) {
              this.setVelocityY(-sprintVelocit);
              this.anims.play("sprintUpPlayerM", true);
              this.animation = "sprintUpPlayerM";
            } else if (cursors.s.isDown || cursors.down.isDown) {
              this.setVelocityY(sprintVelocit);
              this.anims.play("sprintDownPlayerM", true);
              this.animation = "sprintDownPlayerM";
            }
          }
          // Walk movement
          else if (
            (cursors.a.isDown && cursors.w.isDown) ||
            (cursors.left.isDown && cursors.up.isDown)
          ) {
            this.setVelocity(-velocity, -velocity);
            this.flipX = true;
            this.anims.play("walkUpPlayerM", true);
            this.animation = "walkUpPlayerM";
          } else if (
            (cursors.a.isDown && cursors.s.isDown) ||
            (cursors.left.isDown && cursors.down.isDown)
          ) {
            this.setVelocity(-velocity, velocity);
            this.flipX = true;
            this.anims.play("walkDownPlayerM", true);
            this.animation = "walkDownPlayerM";
          } else if (
            (cursors.d.isDown && cursors.w.isDown) ||
            (cursors.right.isDown && cursors.up.isDown)
          ) {
            this.setVelocity(velocity, -velocity);
            this.flipX = false;
            this.anims.play("walkUpPlayerM", true);
            this.animation = "walkUpPlayerM";
          } else if (
            (cursors.d.isDown && cursors.s.isDown) ||
            (cursors.right.isDown && cursors.down.isDown)
          ) {
            this.setVelocity(velocity, velocity);
            this.flipX = false;
            this.anims.play("walkDownPlayerM", true);
            this.animation = "walkDownPlayerM";
          }
          // Straight walk
          else if (cursors.a.isDown || cursors.left.isDown) {
            this.setVelocityX(-velocity);
            this.anims.play("walkLeftPlayerM", true);
            this.animation = "walkLeftPlayerM";
          } else if (cursors.d.isDown || cursors.right.isDown) {
            this.setVelocityX(velocity);
            this.flipX = false;
            this.anims.play("walkRightPlayerM", true);
            this.animation = "walkRightPlayerM";
          } else if (cursors.w.isDown || cursors.up.isDown) {
            this.setVelocityY(-velocity);
            this.anims.play("walkUpPlayerM", true);
            this.animation = "walkUpPlayerM";
          } else if (cursors.s.isDown || cursors.down.isDown) {
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
    }
    