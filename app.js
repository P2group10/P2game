const express = require("express");
const app = express();

//socket.io setup
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(_dirname + "/index.html");
});

const players = {};

let i = 0;
io.on("connection", (socket) => {
    i++;
    console.log("User connected. Total users:", i);
  
    socket.on("sceneLoaded", (MaingameScene) => {
      console.log(MaingameScene);
    });
  
    // Listen for player position updates
    socket.on("playerPosition", (position) => {
      // Update the player's position in the players object
      players[socket.id] = position;
  
      // Log the player's position to the server terminal
      console.log(`Player ${socket.id} position:`, position);
  
      // Broadcast the updated players object to all clients
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
  console.log("Example app listening on port 3000");
});

console.log("Server loaded");
