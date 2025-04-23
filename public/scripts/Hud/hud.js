export default class HUD {
  constructor(scene) {
    this.scene = scene;

    this.healthBar = this.createHealthBar();

    this.inventory = this.createInventory();

    //Listen for events about health changes.
    this.scene.events.on("playerHealthChanged", this.updateHealth, this);
  }

  createHealthBar() {
    //Add a  container in the bottom right of the view.
    const hpContainer = this.scene.add.container(730, 470).setScrollFactor(0);

    const bg = this.scene.add.rectangle(0, 0, 102, 16, 0x000000);
    const border = this.scene.add.rectangle(0, 0, 98, 12, 0xffffff);
    const fill = this.scene.add.rectangle(0, 0, 98, 12, 0x00ff00);

    hpContainer.add([bg, border, fill]);
    // Makes sure that the HUD is alway rendered above everything else.
    hpContainer.setDepth(9999);

    return {
      hpContainer,
      fill,
      maxWidth: 98,
    };
  }

  createInventory() {
    // Create a function to display and configrue the inventory slots (maybe x5 item-slots)
  }

  updateHealth(currentHealth, maxHealth) {
    // Get the thealth percentage to calculate the fill of the healthbar.
    const healthPercentage = currentHealth / maxHealth;

    // Update the width of the health bar fill
    this.healthBar.fill.width = this.healthBar.maxWidth * healthPercentage;

    // Change the color of healthbar to red if under 25% health.
    if (healthPercentage < 0.25) {
      this.healthBar.fill.setFillStyle(0xff0000); // Red for low health
    } else {
      this.healthBar.fill.setFillStyle(0x00ff00); // Green for normal health
    }
  }

  // Update Inventory
}
