import { GearMapComponent } from "../components/GearMapComponent";
import { Gear } from "../pawns/Gear";
import { GearType } from "../utils/gears";
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
    const gearObjs = Object.entries(grouped).map(([type, gears]) => {
      const gear = new GearPoolItem(this.scene, type as GearType, gears.length);
      x += gear.width / 2;
      gear.setPosition(x, gear.height / 2);
      gear.setInteractive();
      gear.on("pointerup", () => {
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
      gearItem.setSelected(type === gearItem.gearType);
    });
  }

  getSelectedType() {
    return this.selectedType;
  }
}

class GearPoolItem extends Phaser.GameObjects.Container {
  private gear: Gear;
  private label: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    public gearType: GearType,
    count: number,
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.gear = new Gear(scene, gearType);
    this.label = scene.add.text(0, -this.gear.height / 2 - 4, `#${count}`, {
      fontSize: "20px",
      color: "#ffffff",
      fontFamily: DEFAULT_FONT,
    });
    this.label.setOrigin(0.5, 1);

    this.add([this.gear, this.label]);
    this.setSize(this.gear.width, this.gear.height + this.label.height + 4);
  }

  setSelected(selected: boolean) {
    this.gear.setGearColor(selected ? 0xffff00 : 0xffffff);
  }
}
