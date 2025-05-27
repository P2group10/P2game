# 🧠 Multiplayer Zombie Survival Game

Welcome to our 2D browser-based multiplayer zombie survival game!

This game was created as a university project focused on web programming, algorithms, and distributed systems. It is designed to run in your browser while being powered by a real-time multiplayer backend using Socket.IO. The game is on Aalborg University’s research and hosting service CLAAUDIA and can be found on the URL: http://130.225.37.50:5001/.

---

## 🎮 What Is This?

This is a cooperative multiplayer survival game where players select characters, team up in a room, and fight off waves of zombies in real-time.

Built with:
- **Phaser** (game engine)
- **Socket.IO** (real-time communication)
- **Node.js** (server-side JavaScript)
- **Express** (serving the game files)

---

## 📁 Project Structure

```
├── server.js                # Main server file (Socket.IO + Express)
├── package.json            # Project dependencies
├── /public
│   ├── index.html          # Main HTML file
│   ├── MainScript.js       # Loads Phaser and game scenes
│   ├── MenuScene.js        # Main menu
│   ├── CharacterSelectScene.js # Character selection screen
│   ├── GameScene.js        # Main game logic
│   ├── GameOverScene.js    # Game over screen
│   ├── enemies.js          # Zombie logic
│   ├── enemyManager.js     # Controls spawning behavior
│   ├── characters.js       # Base character logic
│   ├── Character1–4.js     # Individual character classes
│   ├── CharacterAnims.js   # Shared animation setup
│   ├── hud.js              # Health display and UI
│   └── InputTextBox.js     # Room code input box
```

---

## ▶️ How to Run the Game

Follow these steps to start the game locally on your machine:

### 1. Clone or Download the Project
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install Dependencies
```bash
npm install
```

This installs Express, Socket.IO, and any required dependencies from `package.json`.

### 3. Start the Server
```bash
npx nodemon server.js
```
> Or, if you don’t have nodemon:
```bash
node server.js
```

### 4. Open the Game in Your Browser
Go to:
```
http://localhost:5001
```

Now you can play locally or share your screen with others for testing!

---

## 💡 Notes

- No progress saving or accounts — this game is purely session-based.
- Intended for LAN/local testing, not production hosting.
- Real-time communication handled by Socket.IO for smooth gameplay.
- Phaser manages all rendering, physics, and animation.
- Browser compatibility: Chrome and Firefox recommended.

---

## 🧰 Requirements

- [Node.js](https://nodejs.org) (latest LTS version)
- npm (comes with Node.js)

---

Enjoy the game and thanks for playing!
