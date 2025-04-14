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
          key: "walkUp",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 105,
            end: 112,
          }),
          frameRate: 20,
          repea: -1,
        });
    
        scene.anims.create({
          key: "walkDown",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 131,
            end: 138,
          }),
          frameRate: 20,
          repea: -1,
        });
    
        scene.anims.create({
          key: "walkRight",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 144,
            end: 151,
          }),
          frameRate: 20,
          repea: -1,
        });

        scene.anims.create({
          key: "walkLeft",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 118,
            end: 165,
          }),
          frameRate: 20,
          repea: -1,
        });
    
        scene.anims.create({
          key: "idle",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 27,
            end: 29,
          }),
          frameRate: 5,
          repea: -1,
        });

        scene.anims.create({
          key: "sprintLeft",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 507,
            end: 514,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintRight",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 533,
            end: 540,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintUp",
          frames: scene.anims.generateFrameNumbers("TestPlayer", {
            start: 494,
            end: 500,
          }),
          frameRate: 20,
          repeat: -1,
        });
    
        scene.anims.create({
          key: "sprintDown",
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
              this.anims.play("sprintUp", true);
              this.animation = "sprintUp";
            } else if (
              (cursors.a.isDown && cursors.s.isDown) ||
              (cursors.left.isDown && cursors.down.isDown)
            ) {
              this.setVelocity(-sprintVelocit, sprintVelocit);
              this.anims.play("sprintDown", true);
              this.animation = "sprintDown";
            } else if (
              (cursors.d.isDown && cursors.w.isDown) ||
              (cursors.right.isDown && cursors.up.isDown)
            ) {
              this.setVelocity(sprintVelocit, -sprintVelocit);
              this.anims.play("sprintUp", true);
              this.animation = "sprintUp";
            } else if (
              (cursors.d.isDown && cursors.s.isDown) ||
              (cursors.right.isDown && cursors.down.isDown)
            ) {
              this.setVelocity(sprintVelocit, sprintVelocit);
              this.anims.play("sprintDown", true);
              this.animation = "sprintDown";
            } else if (cursors.a.isDown || cursors.left.isDown) {
              this.setVelocityX(-sprintVelocit);
              this.anims.play("sprintLeft", true);
              this.animation = "sprintLeft";
            } else if (cursors.d.isDown || cursors.right.isDown) {
              this.setVelocityX(sprintVelocit);
              this.anims.play("sprintRight", true);
              this.animation = "sprintRight";
            } else if (cursors.w.isDown || cursors.up.isDown) {
              this.setVelocityY(-sprintVelocit);
              this.anims.play("sprintUp", true);
              this.animation = "sprintUp";
            } else if (cursors.s.isDown || cursors.down.isDown) {
              this.setVelocityY(sprintVelocit);
              this.anims.play("sprintDown", true);
              this.animation = "sprintDown";
            }
          }
          // Walk movement
          else if (
            (cursors.a.isDown && cursors.w.isDown) ||
            (cursors.left.isDown && cursors.up.isDown)
          ) {
            this.setVelocity(-velocity, -velocity);
            this.flipX = true;
            this.anims.play("walkUp", true);
            this.animation = "walkUpup";
          } else if (
            (cursors.a.isDown && cursors.s.isDown) ||
            (cursors.left.isDown && cursors.down.isDown)
          ) {
            this.setVelocity(-velocity, velocity);
            this.flipX = true;
            this.anims.play("walkDown", true);
            this.animation = "walkDown";
          } else if (
            (cursors.d.isDown && cursors.w.isDown) ||
            (cursors.right.isDown && cursors.up.isDown)
          ) {
            this.setVelocity(velocity, -velocity);
            this.flipX = false;
            this.anims.play("walkUp", true);
            this.animation = "walkUp";
          } else if (
            (cursors.d.isDown && cursors.s.isDown) ||
            (cursors.right.isDown && cursors.down.isDown)
          ) {
            this.setVelocity(velocity, velocity);
            this.flipX = false;
            this.anims.play("walkDown", true);
            this.animation = "walkDown";
          }
          // Straight walk
          else if (cursors.a.isDown || cursors.left.isDown) {
            this.setVelocityX(-velocity);
            this.anims.play("walkLeft", true);
            this.animation = "walkLeft";
          } else if (cursors.d.isDown || cursors.right.isDown) {
            this.setVelocityX(velocity);
            this.flipX = false;
            this.anims.play("walkRight", true);
            this.animation = "walkRight";
          } else if (cursors.w.isDown || cursors.up.isDown) {
            this.setVelocityY(-velocity);
            this.anims.play("walkUp", true);
            this.animation = "walkUp";
          } else if (cursors.s.isDown || cursors.down.isDown) {
            this.setVelocityY(velocity);
            this.anims.play("walkDown", true);
            this.animation = "walkDown";
          }
          // Idle animation
          else {
            this.setVelocity(0, 0);
            this.anims.play("idle", true);
            this.animation = "idle";
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
    