export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.scene = scene;
        this.setCollideWorldBounds(true);
    }

    update(player) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        const chaseDistance = 1000; // Set the distance within which the enemy will chase the player

        // Ensure the scene and physics are available
        if (!this.scene || !this.scene.physics) {
            console.error("Scene or physics is undefined in Enemy update!");
            return;
        }

        if (distance < chaseDistance) {
            this.scene.physics.moveToObject(this, player, 150); // Move towards the player at a speed of 150

            // Calculate the angle to the player
            const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

            // Rotate the enemy to face the player
            this.setRotation(angle);
        } else {
            this.setVelocity(0); // Stop moving if the player is out of range
        }
    }
}