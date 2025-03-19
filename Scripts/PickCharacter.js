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
    
    const characterInfo = [
      "Character 1: Soldier with damage boost and sprint, but regular hp",
      "Character 2: A powerful medic with the ability to heal teammates and move faster for healing them, but lower hp.",
      "Character 3: Strong guy with more hp and damage but slower movement speed. Strong guy also has a taunt to take the zombies' attention",
      "Character 4: Supplier with the ability to carry more and instant reload",
      "Character 5: Scout with the ability to see a bigger portion of the map to alarm the team for incoming zombies and faster movement",
      "Character 6: Hunter, provides more damage to animal zombies and can place traps",
      "Character 7: Perk guy gives extra perks to teammates but can also use them for himself"
    ];

    let infoBox = document.createElement('div');
    infoBox.style.position = "absolute";
    infoBox.style.display = "none"; 
    infoBox.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    infoBox.style.color = "white";
    infoBox.style.padding = "10px";
    infoBox.style.borderRadius = "5px";
    infoBox.style.fontSize = "16px";
    document.body.appendChild(infoBox);

    for (let i = 1; i <= 7; i++) {
        let charButton = this.add.image(characterPositions[i - 1].x, characterPositions[i - 1].y, `Character${i}`)
            .setScale(0.5)
            .setInteractive();

        charButton.on('pointerover', () => {
            charButton.setScale(0.55);
            infoBox.innerHTML = characterInfo[i - 1];
            infoBox.style.display = "block";
            infoBox.style.top = `${characterPositions[i - 1].y - 40}px`;
            infoBox.style.left = `${characterPositions[i - 1].x - 100}px`;
        });

        charButton.on('pointerout', () => {
            charButton.setScale(0.5);
            infoBox.style.display = "none";
        });

        
        charButton.on("pointerdown", () => {
            console.log(`Character ${i} selected`);
            infoBox.style.display = "none"; 
            this.scene.start('MainGameScene');
        });
    }
  }

  update() {
      this.background.tilePositionX += 2;
  }
}
