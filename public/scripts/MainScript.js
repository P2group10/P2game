// Importing all the scenes
import CharacterSelectScene from "/scripts/scenes/CharacterSelectScene.js";
import MenuScene from "/scripts/scenes/MenuScene.js";
import GameScene from "/scripts/scenes/GameScene.js";
import GameOverScene from "/scripts/scenes/GameOverScene.js";

// Configuring the game
const config = {
  type: Phaser.AUTO,
  backgroundColor: "#FFFF",

  scale: {
    parent: "gameScreen",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1200,
    height: 750,
  },

  scene: [MenuScene, CharacterSelectScene, GameScene, GameOverScene],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};
// Creating the game instance
const game = new Phaser.Game(config);
