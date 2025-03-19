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
  }

  getRandomPointInRadius() {
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
    const distance = Phaser.Math.FloatBetween(0, this.roamRadius);
    const targetX = this.spawnPoint.x + Math.cos(angle) * distance;
    const targetY = this.spawnPoint.y + Math.sin(angle) * distance;
    return new Phaser.Math.Vector2(targetX, targetY);
  }

  update(player, time) {
    const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const chaseDistance = 50;

    if (!this.scene || !this.scene.physics) {
      console.error("Scene or physics is undefined in Enemy update!");
      return;
    }

    if (distanceToPlayer < chaseDistance) {
      this.scene.physics.moveToObject(this, player, 150);
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      this.setRotation(angle);
    } else {
      if (this.wanderTimer <= 0) {
        this.currentTarget = this.getRandomPointInRadius();
        this.wanderTimer = this.wanderInterval;
      } else {
        this.scene.physics.moveToObject(this, this.currentTarget, this.wanderSpeed);
        const distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, this.currentTarget.x, this.currentTarget.y);
        if (distanceToTarget < 10) {
          this.wanderTimer = 0;
        } else {
          this.wanderTimer -= time;
        }
      }
    }
  }
}