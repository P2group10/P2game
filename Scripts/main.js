window.onload = function() {
  const config = {
    type: Phaser.WEBGL, // or Phaser.CANVAS
    width: 800,
    height: 600,
    parent: 'gameContainer', // Use parent instead of canvas
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
  };
  var game = new Phaser.Game(config);
};

let player;
let cursors;

function preload() {
  this.load.image("background", "assets/background.png");
  this.load.spritesheet("player", "assets/player.png", {
    frameWidth: 32, // Width of each frame
    frameHeight: 33 // Height of each frame
  });
}

function create() {
  // Background
  let background = this.add.image(400, 300, "background");
  background.setScale(3);

  // Player
  player = this.physics.add.sprite(400, 300, "player").setScale(1.5); // Create the player sprite
  player.setCollideWorldBounds(true); // Prevent the player from moving out of bounds

  // Set world bounds to match the map size
  this.physics.world.setBounds(60, 60, 1450, 970);

  // Define animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 10, end: 13 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('player', { start: 43, end: 45 }),
    frameRate: 20
  });
  this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('player', { start: 10, end: 13 }),
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 10, end: 13 }),
    frameRate: 20,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('player', { start: 41, end: 42 }),
    frameRate: 5,
  });

  // Controls
  cursors = this.input.keyboard.addKeys({
    w: Phaser.Input.Keyboard.KeyCodes.W,
    a: Phaser.Input.Keyboard.KeyCodes.A,
    s: Phaser.Input.Keyboard.KeyCodes.S,
    d: Phaser.Input.Keyboard.KeyCodes.D
  });
}

function update() {
  // Player Movement
  if (cursors.a.isDown) {
    player.setVelocityX(-160);
    player.flipX = true; // Flip the sprite for left movement
    player.anims.play('right', true); // Use the 'right' animation for left movement
  } else if (cursors.d.isDown) {
    player.setVelocityX(160);
    player.flipX = false; // Reset the flip for right movement
    player.anims.play('right', true); // Play the 'right' animation
  } else if (cursors.w.isDown) {
    player.setVelocityY(-160);
    player.anims.play('up', true);
  } else if (cursors.s.isDown) {
    player.setVelocityY(160);
    player.anims.play('down', true);
  } else {
    player.setVelocityX(0);
    player.setVelocityY(0);
    player.anims.play('idle', true); // Play idle animation
  }

// Camera setup
const camera = this.cameras.main;
  camera.startFollow(player); // Make the camera follow the player
  camera.setZoom(2); // Zoom in (2x zoom)
  camera.setBounds(0, 0, 2000, 2000); // Set camera bounds to match the map size
}
