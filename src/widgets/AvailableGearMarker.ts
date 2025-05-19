import { Gear } from "../pawns/Gear";
import { GearModel } from "../utils/gears";

const radius = 12;

export class AvailableGearMarker extends Phaser.GameObjects.Container {
  private circle: Phaser.GameObjects.Graphics;
  private gearPreview: Gear;

  constructor(scene: Phaser.Scene, gear: GearModel) {
    super(scene, gear.x, gear.y);
    scene.add.existing(this);

    this.circle = this.scene.add.graphics();
    this.gearPreview = new Gear(this.scene, gear);
    this.gearPreview.setVisible(false).setAlpha(0.3);

    this.add([this.circle, this.gearPreview]);
    this.setFocused(false);

    this.setSize(radius * 2, radius * 2);

    this.setInteractive();
    this.on("pointermove", () => {
      this.setFocused(true);
    });
    this.on("pointerout", () => {
      this.setFocused(false);
    });
  }

  setFocused(focused: boolean) {
    this.circle
      .clear()
      .fillStyle(focused ? 0x00ff00 : 0xffff00)
      .lineStyle(2, 0x000000)
      .setAlpha(0.7)
      .fillCircle(0, 0, radius)
      .strokeCircle(0, 0, radius);

    this.gearPreview.setVisible(focused);
  }

  setGearAngleRelative(rate: number) {
    this.gearPreview.setGearAngleRelative(rate);
  }
}
