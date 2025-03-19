// enemies.js
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scene = scene;
    this.setCollideWorldBounds(true);
    this.wanderSpeed = 50;
    this.wanderTimer = 0;
    this.wanderInterval = 3000;
    this.spawnPoint = new Phaser.Math.Vector2(x, y);
    this.roamRadius = 50;
    this.currentTarget = this.getRandomPointInRadius();
    this.createAnimations(scene);
  }

  getRandomPointInRadius() {
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
    const distance = Phaser.Math.FloatBetween(0, this.roamRadius);
    const targetX = this.spawnPoint.x + Math.cos(angle) * distance;
    const targetY = this.spawnPoint.y + Math.sin(angle) * distance;
    return new Phaser.Math.Vector2(targetX, targetY);
  }

  createAnimations(scene) {
    scene.anims.create({
      key: "zIdle",
      frames: scene.anims.generateFrameNumbers("enemy", {
        start: 143,
        end: 151,
      }),
      frameRate: 10,
    });
    scene.anims.create({
      key: "zRunRight",
      frames: scene.anims.generateFrameNumbers("enemy", {
        start: 144,
        end: 151,
      }),
      frameRate: 20,
    });
    scene.anims.create({
      key: "zRunUp",
      frames: scene.anims.generateFrameNumbers("enemy", {
        start: 105,
        end: 112,
      }),
      frameRate: 20,
    });
    scene.anims.create({
      key: "zRunDown",
      frames: scene.anims.generateFrameNumbers("enemy", {
        start: 131,
        end: 138,
      }),
      frameRate: 20,
    });
    scene.anims.create({
      key: "zRunLeft",
      frames: scene.anims.generateFrameNumbers("enemy", {
        start: 118,
        end: 125,
      }),
      frameRate: 20,
    });
  }

  update(player, time) {
    const distanceToPlayer = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      player.x,
      player.y
    );
    const chaseDistance = 200;

    if (!this.scene || !this.scene.physics) {
      console.error("Scene or physics is undefined in Enemy update!");
      return;
    }

    if (distanceToPlayer < chaseDistance) {
      this.scene.physics.moveToObject(this, player, 150);
      const angle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        player.x,
        player.y
      );
      if (angle >= -0.8 && angle <= 0.8) {
        this.anims.play("zRunRight", true);
      } else if (angle < 2.2 && angle > 0.8) {
        this.anims.play("zRunDown", true);
      } else if (angle < 3.2 && angle >= 2.2) {
        this.anims.play("zRunLeft", true);
      } else if (angle < -2.2 && angle > -3.2) {
        this.anims.play("zRunLeft", true);
      } else if (angle < -0.8 && angle > -2.2) {
        this.anims.play("zRunUp", true);
      }
    } else {
      this.anims.play("zIdle", true);
      if (this.wanderTimer <= 0) {
        this.currentTarget = this.getRandomPointInRadius();
        this.wanderTimer = this.wanderInterval;
      } else {
        this.scene.physics.moveToObject(
          this,
          this.currentTarget,
          this.wanderSpeed
        );
        const distanceToTarget = Phaser.Math.Distance.Between(
          this.x,
          this.y,
          this.currentTarget.x,
          this.currentTarget.y
        );
        if (distanceToTarget < 10) {
          this.wanderTimer = 0;
        } else {
          this.wanderTimer -= time;
        }
      }
    }
  }
}
