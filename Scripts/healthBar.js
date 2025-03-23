export default class HealthBar {
  constructor(scene, Player) {
    this.healthBar = new Phaser.GameObjects.Graphics(scene);

    this.player = Player;
    this.value = 100;
    this.percent = 28 / 100; //Get percent of box to fill in draw function

    this.scene = scene;

    scene.add.existing(this.healthBar);

    this.draw();
  }

  draw() {
    const x = Math.round(this.player.x - 15);
    const y = Math.round(this.player.y - 20);

    // Important to clear the element before rendering, since using this class for multiple objects would create unwanted results.
    this.healthBar.clear();

    this.healthBar.fillStyle(0x000000);
    this.healthBar.fillRect(x, y, 30, 6);

    this.healthBar.fillStyle(0xffffff);
    this.healthBar.fillRect(x + 1, y + 1, 28, 4);

    //If statement changes the color of the health from Green to Red if health goes under 30
    if (this.value < 30) {
      this.healthBar.fillStyle(0xff0000);
    } else {
      this.healthBar.fillStyle(0x00ff00);
    }

    let hpRemainder = Math.floor(this.value * this.percent);

    this.healthBar.fillRect(x + 1, y + 1, hpRemainder, 4);
  }

  update() {
    this.draw();
  }
}
