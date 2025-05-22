// enemies.js
export default class zombieB extends Phaser.Physics.Arcade.Sprite {
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
    this.body.setCircle(16, 16, 16);
    this.setScale(0.5);

    this.hp = 100;
    this.maxHp = 100;
    this.attackDamage = 1;
    this.attackCooldown = 1000;
    this.lastAttackTime = 0;

    this.createHealthBar();
    this.on('destroy', this.onDestroy, this);
  }

  onDestroy() {
    if (this.healthBarContainer) {
      this.healthBarContainer.destroy();
      this.healthBarContainer = null;
    }
  }

  createHealthBar() {
    this.healthBarContainer = this.scene.add.graphics();
    this.updateHealthBar();
  }

  updateHealthBar() {
    if (!this.healthBarContainer || !this.scene) return;

    this.healthBarContainer.clear();
    const healthPercentage = this.hp / this.maxHp;

    this.healthBarContainer.fillStyle(0xff0000);
    this.healthBarContainer.fillRect(this.x - 15, this.y - 25, 30, 4);

    this.healthBarContainer.fillStyle(0x00ff00);
    this.healthBarContainer.fillRect(
      this.x - 15,
      this.y - 25,
      30 * healthPercentage,
      4
    );
  }

  getRandomPointInRadius() {
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
    const distance = Phaser.Math.FloatBetween(0, this.roamRadius);
    const targetX = this.spawnPoint.x + Math.cos(angle) * distance;
    const targetY = this.spawnPoint.y + Math.sin(angle) * distance;
    return new Phaser.Math.Vector2(targetX, targetY);
  }

  createAnimations(scene) {
    if (!scene.anims.exists('zIdle')) {
      scene.anims.create({
        key: "zIdle",
        frames: scene.anims.generateFrameNumbers("zombieB", { start: 143, end: 151 }),
        frameRate: 10,
      });
      scene.anims.create({
        key: "zRunRight",
        frames: scene.anims.generateFrameNumbers("zombieB", { start: 144, end: 151 }),
        frameRate: 20,
      });
      scene.anims.create({
        key: "zRunUp",
        frames: scene.anims.generateFrameNumbers("zombieB", { start: 105, end: 112 }),
        frameRate: 20,
      });
      scene.anims.create({
        key: "zRunDown",
        frames: scene.anims.generateFrameNumbers("zombieB", { start: 131, end: 138 }),
        frameRate: 20,
      });
      scene.anims.create({
        key: "zRunLeft",
        frames: scene.anims.generateFrameNumbers("zombieB", { start: 118, end: 125 }),
        frameRate: 20,
      });
    }
  }

  takeDamage(amount, killerId) {
    this.hp -= amount;
    this.updateHealthBar();

    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => this.clearTint());

    if (this.hp <= 0) {
      if (this.healthBarContainer) {
        this.healthBarContainer.destroy();
        this.healthBarContainer = null;
      }

      // ✅ Giv score til den spiller, som faktisk dræbte zombien
      if (killerId === this.scene.socket?.id) {
        if (this.scene.score !== undefined) {
          this.scene.score += 1;
          this.scene.hud.updateScore(this.scene.score);
        }
      }

      if (this.scene.enemiesManager && this.id) {
        this.scene.enemiesManager.killEnemy(this.id);
      } else {
        this.destroy();
      }
    }
  }

  attackPlayer(player) {
    if (player && typeof player.takeDamage === 'function') {
      player.takeDamage(this.attackDamage);
    }
  }

  update(time) {
    this.updateHealthBar();

    const allPlayers = [];
    if (this.scene.player && this.scene.player.active) {
      allPlayers.push(this.scene.player);
    }

    if (this.scene.otherPlayers) {
      Object.values(this.scene.otherPlayers).forEach((player) => {
        if (player && player.active) {
          allPlayers.push(player);
        }
      });
    }

    if (allPlayers.length === 0) {
      this.anims.play("zIdle", true);
      return;
    }

    let closestPlayer = null;
    let minDistance = Infinity;

    for (const player of allPlayers) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (distance < minDistance) {
        minDistance = distance;
        closestPlayer = player;
      }
    }

    const chaseDistance = 200;

    if (!this.scene || !this.scene.physics) {
      console.error("Scene or physics is undefined in zombieB update!");
      return;
    }

    if (minDistance < chaseDistance) {
      this.scene.physics.moveToObject(this, closestPlayer, 150);
      const angle = Phaser.Math.Angle.Between(this.x, this.y, closestPlayer.x, closestPlayer.y);
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

      if (minDistance < 50 && time > this.lastAttackTime + this.attackCooldown) {
        this.attackPlayer(closestPlayer);
        this.lastAttackTime = time;
      }
    } else {
      this.anims.play("zIdle", true);
      if (this.wanderTimer <= 0) {
        this.currentTarget = this.getRandomPointInRadius();
        this.wanderTimer = this.wanderInterval;
      } else {
        this.scene.physics.moveToObject(this, this.currentTarget, this.wanderSpeed);
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
