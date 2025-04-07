export default class HealthBar {
  constructor(scene, player) {
    this.player = player;
    this.scene = scene;

    this.maxhealth = 100;
    this.value = this.maxhealth;
    this.percent = 28 / 100; //Get percent of box to fill in draw function

    this.barWidth = 28;
    this.barHeight = 4;

    //Create the healthbar - later put in a container
    this.bg = scene.add.rectangle(0, 0, 30, 6, 0x000000);
    this.border = scene.add.rectangle(0, 0, 24, 4, 0xffffff);
    this.fill = scene.add.rectangle(0, 0, 24, 4, 0x00ff00);

    //Set the position of the healthbar to 0,0 (Relative to the container)
    this.bg.setPosition(0, 0);
    this.border.setPosition(-2, 0);
    this.fill.setPosition(-2, 0);

    this.container = scene.add.container(player.x, player.y - 20, [
      this.bg,
      this.border,
      this.fill,
    ]);

    //this.draw();
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
    //this.draw();
    this.container.setPosition(
      Math.round(this.player.x),
      Math.round(this.player.y - 20)
    );

    const hpRatio = this.value / this.maxhealth;
    this.fill.width = this.barWidth * hpRatio;

    if (this.value < 30) {
      this.fill.fillColor = 0xff0000;
    } else {
      this.fill.fillColor = 0x00ff00;
    }
  }
}
