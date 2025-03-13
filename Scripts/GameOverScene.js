export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        // Display "You are dead!" message
        this.add.text(400, 300, 'You are dead!', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);

        // Stop the MainGameScene and transition to InfoScene after 3 seconds
        this.time.delayedCall(3000, () => {
            this.scene.stop('MainGameScene'); // Stop the MainGameScene
            this.scene.start('InfoScene'); // Start the InfoScene
        }, [], this);
    }
}