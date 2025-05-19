import { GearMapComponent } from "../components/GearMapComponent";
import { Gear } from "../pawns/Gear";
import { GearModel, GearType } from "../utils/gears";
import { DEFAULT_FONT } from "../utils/settings";

export class GearPool extends Phaser.GameObjects.Container {
  private selectedType: GearType | undefined;

  constructor(
    scene: Phaser.Scene,
    private gearMapComponent: GearMapComponent,
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.initGears();
  }

  initGears() {
    this.removeAll(true);

    const grouped = Object.groupBy(this.gearMapComponent.availableGears, (gear) => gear.type);

    let x = 0;
    const gearObjs = Object.entries(grouped)
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([, gears]) => {
        const gear = new GearPoolItem(this.scene, gears[0], gears.length);
        x += 60;
        gear.setPosition(x, gear.height / 2);
        gear.setInteractive();
        gear.on("pointerdown", () => {
          this.emit("gear-select", gears[0]);
        });
        return gear;
      });
    this.add(gearObjs.reverse());
  }

  setSelectedType(type?: GearType) {
    this.selectedType = type;
    this.getAll().forEach((item) => {
      const gearItem = item as GearPoolItem;
      gearItem.setSelected(type === gearItem.gearModel.type);
    });
  }

  getSelectedType() {
    return this.selectedType;
  }

  getGearModelByType(type: GearType): GearModel | undefined {
    const item = this.getAll().find((item) => (item as GearPoolItem).gearModel.type === type);
    if (!item) return;
    return (item as GearPoolItem).gearModel;
  }

  getNextGearModelByType(type?: GearType): GearModel | undefined {
    const grouped = Object.groupBy(this.gearMapComponent.availableGears, (gear) => gear.type);
    const types = Object.keys(grouped);
    const index = type ? types.indexOf(type) : types.length - 1;
    const nextType = types[(index + 1) % types.length];
    return this.getGearModelByType(nextType as GearType);
  }

  getPrevGearModelByType(type?: GearType): GearModel | undefined {
    const grouped = Object.groupBy(this.gearMapComponent.availableGears, (gear) => gear.type);
    const types = Object.keys(grouped);
    const index = type ? types.indexOf(type) : 0;
    const nextType = types.at(index - 1);
    return this.getGearModelByType(nextType as GearType);
  }
}

class GearPoolItem extends Phaser.GameObjects.Container {
  private gear: Gear;
  private label: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    public gearModel: GearModel,
    count: number,
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.gear = new Gear(scene, gearModel);
    this.label = scene.add.text(0, -this.gear.height / 2 - 4, `#${count}`, {
      fontSize: "18px",
      color: "#ffffff",
      fontFamily: DEFAULT_FONT,
    });
    this.label.setOrigin(0.5, 1);

    const background = this.scene.add
      .graphics()
      .fillStyle(0x666666, 0.3)
      .fillRoundedRect(-this.gear.width / 2, -this.gear.height / 2, this.gear.width, this.gear.height, 8);

    this.add([background, this.gear, this.label]);
    this.setSize(this.gear.width, this.gear.height);
  }

  setSelected(selected: boolean) {
    this.gear.setGearColor(selected ? 0xffff00 : 0xffffff);
  }
}
