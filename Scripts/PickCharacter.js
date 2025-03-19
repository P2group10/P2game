export default class PickCharacter extends Phaser.Scene {
  constructor() {
      super({ key: 'PickCharacter' });
  }

  preload() {
      this.load.image('backgroundStart', 'assets/backgroundStart.jpeg');
      this.load.image('Character1', 'assets/Character1.png');
      this.load.image('Character2', 'assets/Character2.png');
      this.load.image('Character3', 'assets/Character3.png');
      this.load.image('Character4', 'assets/Character4.png');
      this.load.image('Character5', 'assets/Character5.png');
      this.load.image('Character6', 'assets/Character6.png');
      this.load.image('Character7', 'assets/Character7.png');
  }

  create() {
      let centerX = this.cameras.main.centerX;
      let centerY = this.cameras.main.centerY;

      this.background = this.add.tileSprite(centerX, centerY, 800, 600, "backgroundStart").setScrollFactor(0);
      
      let characterPositions = [
        { x: centerX - 300, y: centerY - 100 }, 
        { x: centerX - 100, y: centerY - 100 }, 
        { x: centerX + 100, y: centerY - 100 }, 
        { x: centerX + 300, y: centerY - 100 }, 
        { x: centerX + 200, y: centerY + 100 }, 
        { x: centerX, y: centerY + 100 },       
        { x: centerX - 200, y: centerY + 100 }  
    ];
    
    for (let i = 1; i <= 7; i++) {
        let charButton = this.add.image(characterPositions[i - 1].x, characterPositions[i - 1].y, `Character${i}`)
            .setScale(0.5)
            .setInteractive();
    
        // Hover effect
        charButton.on('pointerover', () => {
            charButton.setScale(0.55);
        });
    
        charButton.on('pointerout', () => {
            charButton.setScale(0.5);
        });
    
        // Click event
        charButton.on("pointerdown", () => {
            console.log(`Character ${i} selected`);
            this.scene.start('MainGameScene');
        });
    }
    
      







  }

  update() {
      this.background.tilePositionX += 2;
  }
}
