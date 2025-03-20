export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    // Add the player to the scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Set player properties
    this.setScale(0.5);
    this.setCollideWorldBounds(true);

    //Physics body
    this.body.setCircle(16, 16, 16);

    // Define animations
    this.createAnimations(scene);

    // Store the scene for later use
    this.scene = scene;
  }

  createAnimations(scene) {
    // Define animations
    scene.anims.create({
      key: 'up',
      frames: scene.anims.generateFrameNumbers('player', { start: 105, end: 112 }),
      frameRate: 20
    });

    scene.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers('player', { start: 131, end: 138 }),
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('player', { start: 144, end: 151 }),
      frameRate: 20,
    });

    scene.anims.create({
      key: 'idle',
      frames: scene.anims.generateFrameNumbers('player', { start: 442, end: 444 }),
      frameRate: 5,
    });

    scene.anims.create({
        key: 'cute',
        frames: scene.anims.generateFrameNumbers('player', { start: 50, end: 51 }),
        frameRate: 5,
        repeat: -1
    });

    scene.anims.create({
        key:'sprint',
        frames: scene.anims.generateFrameNumbers('player', { start: 533, end: 540 }),
        frameRate: 20,
        repeat: -1
    });

    scene.anims.create({
      key: 'sprintUp',
      frames: scene.anims.generateFrameNumbers('player', { start: 494, end: 500 }),
      frameRate: 20,
      repeat: -1
    });

    scene.anims.create({
      key:'sprintDown',
      frames: scene.anims.generateFrameNumbers('player', { start: 520, end: 527 }),
      frameRate: 20,
      repeat: -1
    });
  }

  update(cursors) {
    let velocity = 160;
    let crawlVelocity = 300;

    // Movement logic
    if (cursors.shift.isDown) {
      if ((cursors.a.isDown && cursors.w.isDown) || (cursors.left.isDown && cursors.up.isDown)) {
        this.setVelocity(-crawlVelocity, -crawlVelocity);
        this.flipX = true;
        this.anims.play('sprint', true);
      } else if ((cursors.a.isDown && cursors.s.isDown) || (cursors.left.isDown && cursors.down.isDown)) {
        this.setVelocity(-crawlVelocity, crawlVelocity);
        this.flipX = true;
        this.anims.play('sprint', true);
      } else if ((cursors.d.isDown && cursors.w.isDown) || (cursors.right.isDown && cursors.up.isDown)) {
        this.setVelocity(crawlVelocity, -crawlVelocity);
        this.flipX = false;
        this.anims.play('sprint', true);
      } else if ((cursors.d.isDown && cursors.s.isDown) || (cursors.right.isDown && cursors.down.isDown)) {
        this.setVelocity(crawlVelocity, crawlVelocity);
        this.flipX = false;
        this.anims.play('sprint', true);
      } else if (cursors.a.isDown || cursors.left.isDown) {
        this.setVelocityX(-crawlVelocity);
        this.flipX = true;
        this.anims.play('sprint', true);
      } else if (cursors.d.isDown || cursors.right.isDown) {
        this.setVelocityX(crawlVelocity);
        this.flipX = false;
        this.anims.play('sprint', true);
      } else if (cursors.w.isDown || cursors.up.isDown) {
        this.setVelocityY(-crawlVelocity);
        this.anims.play('sprintUp', true);
      } else if (cursors.s.isDown || cursors.down.isDown) {
        this.setVelocityY(crawlVelocity);
        this.anims.play('sprintDown', true);
      }
    } 
    // Walk movement
    else if ((cursors.a.isDown && cursors.w.isDown) || (cursors.left.isDown && cursors.up.isDown)) {
      this.setVelocity(-velocity, -velocity);
      this.flipX = true;
      this.anims.play('up', true);
    } else if ((cursors.a.isDown && cursors.s.isDown) || (cursors.left.isDown && cursors.down.isDown)) {
      this.setVelocity(-velocity, velocity);
      this.flipX = true;
      this.anims.play('down', true);
    } else if ((cursors.d.isDown && cursors.w.isDown) || (cursors.right.isDown && cursors.up.isDown)) {
      this.setVelocity(velocity, -velocity);
      this.flipX = false;
      this.anims.play('up', true);
    } else if ((cursors.d.isDown && cursors.s.isDown) || (cursors.right.isDown && cursors.down.isDown)) {
      this.setVelocity(velocity, velocity);
      this.flipX = false;
      this.anims.play('down', true);
    } 
    // Straight walk
    else if (cursors.a.isDown || cursors.left.isDown) {
      this.setVelocityX(-velocity);
      this.flipX = true;
      this.anims.play('right', true);
    } else if (cursors.d.isDown || cursors.right.isDown) {
      this.setVelocityX(velocity);
      this.flipX = false;
      this.anims.play('right', true);
    } else if (cursors.w.isDown || cursors.up.isDown) {
      this.setVelocityY(-velocity);
      this.anims.play('up', true);
    } else if (cursors.s.isDown || cursors.down.isDown) {
      this.setVelocityY(velocity);
      this.anims.play('down', true);
    } 
    // Extra animations
    else if (cursors.space.isDown) {
      this.setVelocity(0, 0);
      this.anims.play('cute', true);
    } 
    // Idle animation
    else {
      this.setVelocity(0, 0);
      this.anims.play('idle', true);
    }

    // **Fix: Explicitly stop movement when keys are released**
    if (!cursors.left.isDown && !cursors.right.isDown) {
      this.setVelocityX(0);
    }

    if (!cursors.up.isDown && !cursors.down.isDown) {
      this.setVelocityY(0);
    }
  }
}
