import CharacterAnims from "../PlayerCharacters/CharacterAnims.js";
export default class character2 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, playerHP, socket) {
    super(scene, x, y, texture);
    // Store the scene and socket for later use
    this.scene = scene;
    this.socket = socket; 
    this.animation = "idlePlayerM";
    this.isLocalPlayer = false; 
    
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
    