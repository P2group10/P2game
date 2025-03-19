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
      frames: scene.anims.generateFrameNumbers('player', { start: 105, end: 112, }),
      frameRate: 20
    });

    scene.anims.create({
      key: 'down',
      frames: scene.anims.generateFrameNumbers('player', { start: 131, end: 138, }),
      frameRate: 20
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('player', { start: 144, end: 151, }),
      frameRate: 20,
    });

    scene.anims.create({
      key: 'idle',
      frames: scene.anims.generateFrameNumbers('player', { start: 442, end: 444, }),
      frameRate: 5,
    });

    scene.anims.create({
        key: 'cute',
        frames: scene.anims.generateFrameNumbers('pplayer', { start: 50, end: 51 }),
        frameRate: 5,
        repeat: -1
      });

    scene.anims.create({
        key:'sprint',
        frames: scene.anims.generateFrameNumbers('player', { start: 533, end: 540 }),
        frameRate: 20,
        repeat: -1
    });
  }

  update(cursors) {
  let velocity = 160;
  let crawlVelocity = 300;


switch (true) {
    case cursors.shift.isDown && cursors.a.isDown:
        this.setVelocityX(-crawlVelocity);
        this.flipX = true;
        this.anims.play('sprint', true);
        break;
    case cursors.shift.isDown && cursors.d.isDown:
        this.setVelocityX(crawlVelocity);
        this.flipX = false;
        this.anims.play('sprint', true);
        break;
    case cursors.a.isDown && cursors.w.isDown:
        this.setVelocity(-velocity, -velocity);
        this.flipX = true;
        this.anims.play('right', true);
        break;
    case cursors.a.isDown && cursors.s.isDown:
        this.setVelocity(-velocity, velocity);
        this.flipX = true;
        this.anims.play('down', true);
        break;
    case cursors.d.isDown && cursors.w.isDown:
        this.setVelocity(velocity, -velocity);
        this.flipX = false;
        this.anims.play('up', true);
        break;
    case cursors.d.isDown && cursors.s.isDown:
        this.setVelocity(velocity, velocity);
        this.flipX = false;
        this.anims.play('down', true);
        break;
    case cursors.a.isDown:
        this.setVelocityX(-velocity);
        this.flipX = true;
        this.anims.play('right', true);
        break;
    case cursors.d.isDown:
        this.setVelocityX(velocity);
        this.flipX = false;
        this.anims.play('right', true);
        break;
    case cursors.w.isDown:
        this.setVelocityY(-velocity);
        this.anims.play('up', true);
        break;
    case cursors.s.isDown:
        this.setVelocityY(velocity);
        this.anims.play('down', true);
        break;
    case cursors.space.isDown:
        this.setVelocity(0, 0);
        this.anims.play('cute', true);
        break;
    default:
        this.setVelocity(0, 0);
        this.anims.play('idle', true);
        break;
    }
    
  }
}


