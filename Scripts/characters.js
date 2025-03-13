export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Add the player to the scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set player properties
    this.setScale(1.5);
    this.setCollideWorldBounds(true);

    // Define animations
    this.createAnimations(scene);

    // Store the scene for later use
    this.scene = scene;
  }

  createAnimations(scene) {
    // Define animations
    scene.anims.create({
      key: 'up',
      frames: scene.anims.generateFrameNumbers('player', { start: 43, end: 45 }),
      frameRate: 20
    });

    scene.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers('player', { start: 43, end: 46 }),
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('player', { start: 17, end: 23 }),
      frameRate: 20,
    });

    scene.anims.create({
      key: 'idle',
      frames: scene.anims.generateFrameNumbers('player', { start: 41, end: 42 }),
      frameRate: 5,
    });
    scene.anims.create({
        key: 'cute',
        frames: scene.anims.generateFrameNumbers('player', { start: 50, end: 51 }),
        frameRate: 5,
        repeat: -1
      });
    scene.anims.create({
        key:'crawling',
        frames: scene.anims.generateFrameNumbers('player', { start: 73, end: 75 }),
        frameRate: 20,
        repeat: -1
    });
  }

  update(cursors) {
    // Player Movement
    if (cursors.shift.isDown){
      if (cursors.a.isDown) {
          this.setVelocityX(-300);
          this.flipX = true; // Flip the sprite for left movement
          this.anims.play('crawling', true); // Use the 'right' animation for left movement
        } else if (cursors.d.isDown) {
          this.setVelocityX(300);
          this.flipX = false; // Reset the flip for right movement
          this.anims.play('crawling', true); // Play the 'right' animation
        }
    } else if (cursors.a.isDown) {
        this.setVelocityX(-160);
        this.flipX = true; // Flip the sprite for left movement
        this.anims.play('right', true); // Use the 'right' animation for left movement
    } else if (cursors.d.isDown) {
        this.setVelocityX(160);
        this.flipX = false; // Reset the flip for right movement
        this.anims.play('right', true); // Play the 'right' animation
    } else if (cursors.w.isDown) {
        this.setVelocityY(-160);
        this.anims.play('up', true);
    } else if (cursors.s.isDown) {
        this.setVelocityY(160);
        this.anims.play('down', true);
    } else if (cursors.space.isDown){
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.anims.play('cute', true);
    } else {
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.anims.play('idle', true); // Play idle animation
    }
  }
}


