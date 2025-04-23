export default class characterAnims extends Phaser.Physics.Arcade.Sprite {
  // Made this a static method so it can be called without instantiating
  static createAnimations(scene) {
    // TestPlayer animations
    this.createTestPlayerAnimations(scene);
    // PlayerM animations
    this.createPlayerMAnimations(scene);
  }

  static createTestPlayerAnimations(scene) {
    //-----Define animations---------TestPlayer-----------------------------//
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
  //-----Define animations---------PlayerM-----------------------------//
  static createPlayerMAnimations(scene) {
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
}
