// main.js
import StartScene from './StartScene.js'; // Import the Start scene
import MainGameScene from './MainGameScene.js';
import GameOverScene from './GameOverScene.js';
import InfoScene from './InfoScene.js'

window.onload = function () {
  const config = {
    type: Phaser.WEBGL, // or Phaser.CANVAS
    width: 800,
    height: 600,
    parent: 'gameContainer', // Use parent instead of canvas
    scene: [StartScene, InfoScene, MainGameScene, GameOverScene], // Ensure Start is the first scene
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
  };
  var game = new Phaser.Game(config);
};