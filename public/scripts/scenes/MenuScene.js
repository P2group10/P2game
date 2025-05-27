import TextInput from "../Buttons/InputTextBox.js";
import CharacterSelectScene from "./CharacterSelectScene.js";

// Creating a class for the Menu Scene
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.textInput = null;
    this.socket = null;
    this.showJoinRoomInput = this.showJoinRoomInput.bind(this);
    this.showCreateRoomInput = this.showCreateRoomInput.bind(this);
    this.handleRoomResponse = this.handleRoomResponse.bind(this);


    // Initialize socket only if it doesn't exist
    if (!this.socket) {
      this.socket = io({ 
        reconnection: true,
        withCredentials: true,
        transports: ['websocket', 'polling'] // Explicitly specify transports
      });
      this.socket.emit("client-identified", "menu-scene");
      this.setupSocketListeners();
    }
  }
// Preload assets for the scene
  preload() {
    this.load.image(
      "BackGroundImageStart",
      "assets/images/backgroundStart.jpeg"
    );
    this.load.image("logo", "assets/images/logo.png");
  }
// Create the scene and set up the UI elements
  create() {
    let centerX = this.cameras.main.centerX;
    let centerY = this.cameras.main.centerY;

    this.background = this.add.tileSprite(
      centerX,
      centerY,
      1200,
      750,
      "BackGroundImageStart"
    );
// Adding the logo
    const logo = this.add.image(centerX, centerY - 250, "logo");

    const buttonStyle = {
      font: "32px Arial",
      fill: "#ffffff",
      padding: { x: 20, y: 10 },
      backgroundColor: "#222",
    };

    this.textInput = new TextInput();
// Adding the "Join Room" and "Create Room" buttons
    let JoinRoomButton = this.add
      .text(centerX, centerY + 50, "Join Room", buttonStyle)
      .setOrigin(0.5)
      .setInteractive();

    JoinRoomButton.on("pointerover", () => JoinRoomButton.setScale(1.1));
    JoinRoomButton.on("pointerout", () => JoinRoomButton.setScale(1));
    JoinRoomButton.on("pointerdown", () => this.showJoinRoomInput());

    let CreateRoomButton = this.add
      .text(centerX, centerY + 200, "Create Room", buttonStyle)
      .setOrigin(0.5)
      .setInteractive();
    CreateRoomButton.on("pointerover", () => CreateRoomButton.setScale(1.1));
    CreateRoomButton.on("pointerout", () => CreateRoomButton.setScale(1));
    CreateRoomButton.on("pointerdown", () => this.showCreateRoomInput());
  }
// Set up socket listeners for room creation and joining
  setupSocketListeners() {
    // Remove any existing listeners first
    this.socket.off("room-create-response");
    this.socket.off("room-join-response");

    // Handle room creation response
    this.socket.on("room-create-response", (response) => {
      this.handleRoomResponse(response, true);
    });

    // Handle room join response
    this.socket.on("room-join-response", (response) => {
      this.handleRoomResponse(response, false);
    });
  }
// Show input for joining a room
  showJoinRoomInput() {
    const inputElement = this.textInput.showJoinRoomInput();
    let isJoining = false;
    
    inputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !isJoining) {
        const inputs = document.querySelectorAll('input[type="text"]');
        inputElement.remove();
        const roomCode = inputElement.value.trim();
        this.socket.emit("join-room", { roomCode });
        isJoining = true;
        inputs.forEach((input) => input.remove());
      }
    });
  }
// Show input for creating a room
  showCreateRoomInput() {
    const inputElement = this.textInput.showCreateRoomInput();
    let isCreating = false;

    inputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !isCreating) {
        const inputs = document.querySelectorAll('input[type="text"]');
        inputElement.remove();
        isCreating = true;
        const roomCode = inputElement.value.trim();
        this.socket.emit("create-room", { roomCode }, (response) => {
          isCreating = false;
          if (!response.success) {
            console.error("Creation failed:", response.message);
          }
          inputs.forEach((input) => input.remove());
        });
      }
    });
  }
// Handle the response from the server for room creation or joining
  handleRoomResponse(response, isHost) {
    if (response.success) {
      const inputs = document.querySelectorAll('input[type="text"]');
      inputs.forEach((input) => input.remove());
      
      this.scene.start("CharacterSelectScene", {
        roomCode: response.roomCode,
        socket: this.socket,
        isHost: isHost,
      });
    } else {
      alert(response.message);
    }
  }
  // Destroy and clean up socket listeners
  destroy() {
    if (this.socket) {
      this.socket.off("room-create-response");
      this.socket.off("room-join-response");
    }
    super.destroy();
  }
// Constantly update the background position for a scrolling effect
  update() {
    this.background.tilePositionX += 2;
  }
}
