import zombieB from './ZombieB.js';

export default class MultiplayerEnemiesManager {
  constructor(scene, socket, roomCode) {
    this.scene = scene;
    this.socket = socket;
    this.roomCode = roomCode;
    this.enemies = {};
    this.enemiesGroup = scene.physics.add.group();
    this.isHost = scene.isHost;
    
    // Only the host spawns and manages enemies
    this.lastEnemyId = 0;
    
    // Setup socket listeners
    this.setupSocketListeners();
  }
  
  setupSocketListeners() {
    // Listen for enemy spawn events
    this.socket.on('enemy-spawn', (data) => {
      if (this.isHost) return; // Host already has these enemies
      
      // Create enemy if it doesn't exist yet
      if (!this.enemies[data.enemyId]) {
        this.createEnemy(data.enemyId, data.x, data.y, data.texture, false);
      }
    });
    
    // Listen for enemy position updates
    this.socket.on('enemy-position-update', (data) => {
      if (this.isHost) return; // Host manages enemy movement locally
      
      const enemy = this.enemies[data.enemyId];
      if (enemy) {
        enemy.x = data.x;
        enemy.y = data.y;
        // Update health bar position after updating enemy position
        if (enemy.updateHealthBar) {
          enemy.updateHealthBar();
        }
        if (data.animation) {
          enemy.play(data.animation, true);
        }
      }
    });
    
    // Listen for enemy death events
    this.socket.on('enemy-killed', (data) => {
      const enemy = this.enemies[data.enemyId];
      if (enemy) {
        // Clean up health bar before destroying the enemy
        if (enemy.healthBarContainer) {
          enemy.healthBarContainer.destroy();
        }
        enemy.destroy();
        delete this.enemies[data.enemyId];
      }
    });
  }
  
  createEnemy(enemyId, x, y, texture = 'enemy', emitToOthers = true) {
    // Create the enemy instance
    const enemy = new zombieB(this.scene, x, y, texture);
    enemy.id = enemyId;
    this.enemies[enemyId] = enemy;
    this.enemiesGroup.add(enemy);
    // If this is the host and we should emit, send spawn event to other players
    if (this.isHost && emitToOthers) {
      this.socket.emit('enemy-spawn', {
        roomCode: this.roomCode,
        enemyId: enemyId,
        x: x,
        y: y,
        texture: texture,
        hp: enemy.hp || 100
      });
    }
    
    return enemy;
  }
  
  spawnEnemy(x, y, texture = 'enemy') {
    if (!this.isHost) return null; // Only host spawns enemies
    
    const enemyId = `enemy_${this.lastEnemyId++}`;
    return this.createEnemy(enemyId, x, y, texture, true);
  }
  
  update(time, delta) {
    const localPlayer = this.scene.player;
    
    // If host, update all enemies and sync positions
    if (this.isHost) {
      Object.values(this.enemies).forEach(enemy => {
        enemy.update(localPlayer, delta);
        
        // Only send position updates when movement occurs
        this.socket.emit('enemy-position-update', {
          roomCode: this.roomCode,
          enemyId: enemy.id,
          x: enemy.x,
          y: enemy.y,
          animation: enemy.anims.currentAnim?.key
        });
      });
    } else {
      // For non-hosts, make sure health bars follow enemies
      Object.values(this.enemies).forEach(enemy => {
        if (enemy.updateHealthBar) {
          enemy.updateHealthBar();
        }
      });
    }
  }
  
  // Add collision between enemies and all players
  setupCollisions(players) {
    const enemiesArray = Object.values(this.enemies);
    this.scene.physics.add.collider(this.enemiesGroup, players, this.handleEnemyCollision.bind(this));
    this.scene.physics.add.collider(this.enemiesGroup, this.enemiesGroup);
  }
  
  handleEnemyCollision(player) {
    // Enhanced safety checks
    if (player && player.isLocalPlayer && typeof player.takeDamage === 'function' && player.scene) {
        player.takeDamage(1); // Adjust damage amount as needed
        
        // Safe access to animation data
        const currentAnimation = player.anims?.currentAnim?.key || 'idlePlayerM';
        
        // Only emit if socket is available
        if (this.socket) {
            this.socket.emit('playerPosition', {
                roomCode: this.roomCode,
                playerId: this.socket.id,
                playerName: player.name || 'Player',
                x: player.x,
                y: player.y,
                animation: currentAnimation,
                spriteModel: this.scene.character || 'character1',
                playerHP: player.playerHP || player.health || 0
            });
        }
    }
  }
  
  killEnemy(enemyId) {
    if (this.isHost) {
      // Emit enemy death event
      this.socket.emit('enemy-killed', {
        roomCode: this.roomCode,
        enemyId: enemyId
      });
      
      // Destroy the enemy
      const enemy = this.enemies[enemyId];
      if (enemy) {
        // Clean up health bar before destroying
        if (enemy.healthBarContainer) {
          enemy.healthBarContainer.destroy();
        }
        enemy.destroy();
        delete this.enemies[enemyId];
      }
    }
  }
}