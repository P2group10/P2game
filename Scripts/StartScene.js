// StartScene.js
export default class StartScene extends Phaser.Scene {

    constructor(){
        super({key: "StartScene"});
    }

    preload() {
        this.load.image('backgroundStart', 'assets/backgroundStart.jpeg');
        this.load.image('logo', 'assets/logo.png');
        this.load.image("button", "assets/gamestartbutton.png");
    }

    create() {
        // Get center of screen
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;

        // Background and logo
        this.background = this.add.tileSprite(centerX, centerY, 800, 600, "backgroundStart"); // Adjust dimensions to match game resolution
        const logo = this.add.image(centerX, centerY - 150, "logo");

        // Create and center the button
        let startButton = this.add.image(centerX, centerY + 50, "button").setInteractive();

        // Button hover effects
        startButton.on('pointerover', () => {
            startButton.setScale(1.1); 
        });

        startButton.on('pointerout', () => {
            startButton.setScale(1); 
        });

        // Button click event
        startButton.on("pointerdown", () => {
            this.scene.start('InfoScene'); // Start the MainGameScene
        });
    }

    update() {
        this.background.tilePositionX += 2; // Scroll the background
    }
}