// main.js
import StartScene from "./StartScene.js";
import MainGameScene from "./MainGameScene.js";
import GameOverScene from "./GameOverScene.js";
import InfoScene from "./InfoScene.js";

window.onload = function () {
  const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: "gameContainer",
    scene: [StartScene, InfoScene, MainGameScene, GameOverScene],
    pixelArt: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        //Use debug: true when developing - remove for production
        debug: true,
      },
    },
  };
  var game = new Phaser.Game(config);
};
