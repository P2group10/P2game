export default class InfoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InfoScene' });
    }

    preload() {
        // Load assets
        this.load.image('backgroundStart', 'assets/backgroundStart.jpeg');
        this.load.image("play", "assets/play.png");
    }

    create() {
        let centerX = this.cameras.main.centerX;
        let centerY = this.cameras.main.centerY;

        // Background (adjust dimensions to match game resolution)
        this.background = this.add.tileSprite(centerX, centerY, 800, 600, "backgroundStart");

        // Create a rounded rectangle for the text box
        let boxWidth = 600;
        let boxHeight = 250;
        let box = this.add.graphics();
        box.fillStyle(0x000000, 0.7);
        box.fillRoundedRect(centerX - boxWidth / 2, centerY - 180, boxWidth, boxHeight, 20);

        // Multiline string for the instructions
        let infoText = `Welcome to Zombie Survival!

- Move with arrow keys
- Survive as long as possible
- Defeat zombies and level up

Click 'PLAY' to pick character.`;

        // Add the text to the scene
        let text = this.add.text(centerX, centerY - 80, infoText, {
            fontSize: '20px',
            fill: '#ffffff',
            align: 'center',
            fontFamily: 'Arial, sans-serif',
            wordWrap: { width: boxWidth - 40 }
        }).setOrigin(0.5);

        // Add the play button and make it interactive
        let playButton = this.add.image(centerX, centerY + 150, "play").setInteractive();

        // Button hover effects
        playButton.on('pointerover', () => {
            playButton.setScale(1.1); // Slightly enlarge the button when hovering over it
        });

        playButton.on('pointerout', () => {
            playButton.setScale(1); // Reset the button size
        });

        // Event listener for the button click
        playButton.on("pointerdown", () => {
            this.scene.start('MainGameScene'); // Start the MainGameScene
        });
    }

    update() {
        this.background.tilePositionX += 2; // Scroll the background
    }
}