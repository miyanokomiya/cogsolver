import { GearCircle, GearType } from "../utils/gears";

export class Gear extends Phaser.GameObjects.Container {
  private shiftAngle = 0;
  private gearImage: Phaser.GameObjects.Image;
  private angleAnimation?: Phaser.Tweens.Tween;
  private teethCount: number;

  constructor(
    scene: Phaser.Scene,
    gearType: GearType,
    tilt?: GearCircle["tilt"],
    public rotationDirection: GearCircle["rotationDirection"] = 0,
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);

    const gearInfo = getGearInfo(gearType);
    this.shiftAngle = tilt ? (tilt * 360) / gearInfo.teethCount : 0;
    this.teethCount = gearInfo.teethCount;

    this.gearImage = this.scene.add.image(0, 0, gearInfo.texture);
    this.add(this.gearImage);
    this.setGearAngle(0);

    this.setSize(this.gearImage.width, this.gearImage.height);
  }

  setGearAngle(angle: number) {
    this.gearImage.setAngle(angle + this.shiftAngle);
  }

  // When rate is 1, 8 teeth geear rotates in 5seconds.
  setGearAngleRelative(rate: number) {
    const count = this.teethCount / 8;
    const sign = this.rotationDirection;
    this.gearImage.setAngle((sign * (rate * 360)) / count + this.shiftAngle);
  }

  animateAngle(duration: number, counterClockwise = false) {
    this.angleAnimation?.stop().destroy();

    this.angleAnimation = this.scene.tweens.add({
      targets: [this.gearImage],
      angle: { from: this.shiftAngle, to: this.shiftAngle + (counterClockwise ? -360 : 360) },
      duration,
      repeat: -1,
      ease: "Linear",
    });
  }

  setPositionBasedOn(gear: Gear, angle: number) {
    const d = gear.gearImage.width / 2 + this.gearImage.width / 2 - 9;
    const r = Phaser.Math.DegToRad(angle);
    const x = gear.x + d * Math.cos(r);
    const y = gear.y + d * Math.sin(r);
    this.setPosition(x, y);
  }

  setGearColor(color: number) {
    this.gearImage.setTint(color);
  }
}

function getGearInfo(gearType: GearType) {
  switch (gearType) {
    case "p-2":
      return { texture: "gear2", teethCount: 8 };
    case "p-3":
      return { texture: "gear3", teethCount: 16 };
    case "p-4":
      return { texture: "gear4", teethCount: 32 };
    default:
      return { texture: "gear1", teethCount: 6 };
  }
}
