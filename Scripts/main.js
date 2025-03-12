// main.js
import MenuScene from './MenuScene.js';
import MainGameScene from './MainGameScene.js';
import GameOverScene from './GameOverScene.js';

window.onload = function () {
  const config = {
    type: Phaser.WEBGL, // or Phaser.CANVAS
    width: 800,
    height: 600,
    parent: 'gameContainer', // Use parent instead of canvas
    scene: [MenuScene, MainGameScene, GameOverScene], // Add both scenes
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