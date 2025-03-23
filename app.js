const express = require("express");
const app = express();

//socket.io setup
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 5001;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const players = {};
const previousPositions = {}; // Declare previousPositions object

let i = 0;
io.on("connection", (socket) => {
  i++;
  console.log("User connected. Total users:", i);
  // Initialize the player's position
  players[socket.id] = {
    id: socket.id,
    name: `Player ${i}`, // Default name
    x: 100,
    y: 100,
    animation: "idle", // Default animation
    spriteModel: "player", // Default sprite model
  };
  previousPositions[socket.id] = { x: 100, y: 100 }; // Initialize previous position
  io.emit("updatePlayers", players); // Broadcast the updated players object

  // Listen for player name updates
  socket.on("setPlayerName", (name) => {
    players[socket.id].name = name;
    io.emit("updatePlayers", players);
  });

  socket.on("sceneLoaded", (MaingameScene) => {
    console.log(MaingameScene);
  });

  // Listen for player position updates
  socket.on("playerPosition", (position) => {
    const previousPosition = previousPositions[socket.id];
    if (
      previousPosition.x !== position.x ||
      previousPosition.y !== position.y
    ) {
      players[socket.id].x = position.x;
      players[socket.id].y = position.y;
      io.emit("updatePlayers", players);
      io.emit("playerPositionUpdate", {
        playerId: socket.id,
        playerName: players[socket.id].name,
        x: position.x,
        y: position.y,
        animation: players[socket.id].animation, // Include the current animation state
        spriteModel: players[socket.id].spriteModel, // Include the current sprite model
      });
    }
    // Update the previous position
    previousPositions[socket.id] = { x: position.x, y: position.y };
  });

  socket.on("setPlayerAnimation", (animation) => {
    players[socket.id].animation = animation;
    io.emit("updatePlayers", players);
  });

  socket.on("setPlayerSpriteModel", (spriteModel) => {
    players[socket.id].spriteModel = spriteModel;
    io.emit("updatePlayers", players);
  });

  // Handle player disconnection
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
    console.log("User disconnected. Total users:", i);
    i--;
  });
});

server.listen(port, () => {
  console.log("Example app listening on port 5001");
});

console.log("Server loaded");
