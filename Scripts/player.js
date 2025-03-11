export default class player {
  constructor(x, y, imageNumber) {
    let x = 100;
    let y = 100;
    let radius = 50;
    let speed = 2;

    //Character upload
    const characterImage = new Image();
    characterImage.src = "Images/characters/player1.png";

    characterImage.onload = function () {
      drawGame();
    };

    function drawPlayer() {
      ctx.drawImage(
        characterImage,
        x - radius,
        y - radius,
        radius * 1.5,
        radius * 1.5
      );
    }
  }
}
