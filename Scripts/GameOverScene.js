export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    create() {
        this.add.text(400, 300, 'You are dead!', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);
        this.time.delayedCall(3000, () => {
            this.scene.start('InfoScene'); // Transition back to the start menu after 3 seconds
        }, [], this);
    }
}