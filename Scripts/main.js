import player from "./player.js";
const canvas = document.getElementById("gamearea");
const ctx = canvas.getContext("2d");

function clearScreen() {
  ctx.fillStyle = "white";
  ctx.fillRect = (0, 0, canvas.width, canvas.height);
}

function drawGame() {
  drawPlayer();
}
