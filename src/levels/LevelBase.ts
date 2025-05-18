import { GearMapComponent } from "../components/GearMapComponent";
import { InputComponent } from "../components/InputComponent";
import { VirtualKeyboardComponent } from "../components/VirtualKeyboardComponent";
import { Gear } from "../pawns/Gear";
import { createGearModel, GearModel } from "../utils/gears";
import { GearPool } from "../widgets/GearPool";

export class LevelBase extends Phaser.Events.EventEmitter {
  protected inputComponent!: InputComponent;
  private vkc!: VirtualKeyboardComponent;
  private gearGroup!: Phaser.GameObjects.Group;
  private availableGearInfoGroup!: Phaser.GameObjects.Group;
  private gearMapComponent!: GearMapComponent;
  private gearPool!: GearPool;
  private nextGearModel: GearModel | undefined;

  constructor(protected scene: Phaser.Scene) {
    super();
  }

  create() {
    this.inputComponent = new InputComponent(this.scene);
    this.vkc = new VirtualKeyboardComponent(this.scene, this.inputComponent);
    this.gearMapComponent = new GearMapComponent(this.scene);
    this.gearGroup = this.scene.add.group();
    this.availableGearInfoGroup = this.scene.add.group();

    this.gearMapComponent.setInitialGears([createGearModel("p-2", "init-1", 100, 50)]);
    this.gearMapComponent.setGoalGears([createGearModel("p-2", "goal-1", 100, 500)]);
    this.gearMapComponent.setAvailableGears([
      ...Array.from({ length: 5 }, () => createGearModel("p-2", Phaser.Utils.String.UUID(), 0, 0)),
      ...Array.from({ length: 5 }, () => createGearModel("p-3", Phaser.Utils.String.UUID(), 0, 0)),
      ...Array.from({ length: 5 }, () => createGearModel("p-4", Phaser.Utils.String.UUID(), 0, 0)),
    ]);

    this.gearPool = new GearPool(this.scene, this.gearMapComponent);
    this.gearPool.setPosition(this.scene.scale.width - 300, this.scene.scale.height - 150);
    this.gearPool.on("gear-select", (model: GearModel) => {
      this.setNextGearModel(model);
    });

    this.updateGears();
    this.updateAvailableGearInfos();
  }

  update(_time: number, _delta: number): void {
    this.inputComponent.update();
    this.vkc.update();

    if (this.inputComponent.pressedKeys.left) {
    }
    if (this.inputComponent.pressedKeys.right) {
    }
    if (this.inputComponent.justPressedKeys.space) {
    }
    if (this.inputComponent.justPressedKeys.esc) {
      this.emit("level-pause");
    }
  }

  private updateGears() {
    const initialGearMap = new Map(this.gearMapComponent.initialGears.map((gear) => [gear.id, gear]));
    const goalGearMap = new Map(this.gearMapComponent.goalGears.map((gear) => [gear.id, gear]));
    const freeGearMap = new Map(this.gearMapComponent.freeGears.map((gear) => [gear.id, gear]));

    this.gearGroup.getChildren().forEach((gear) => {
      if (!(gear instanceof Gear)) return;

      if (initialGearMap.has(gear.name)) {
        const model = initialGearMap.get(gear.name)!;
        gear.setPosition(model.x, model.y);
        initialGearMap.delete(gear.name);
      } else if (goalGearMap.has(gear.name)) {
        const model = goalGearMap.get(gear.name)!;
        gear.setPosition(model.x, model.y);
        goalGearMap.delete(gear.name);
      } else if (freeGearMap.has(gear.name)) {
        const model = freeGearMap.get(gear.name)!;
        gear.setPosition(model.x, model.y);
        freeGearMap.delete(gear.name);
      } else {
        this.gearGroup.remove(gear, true, true);
      }
    });

    initialGearMap.forEach((model) => {
      const gear = new Gear(this.scene, model.type, model.tilt);
      gear.setPosition(model.x, model.y);
      gear.setGearColor(0xff4400);
      this.gearGroup.add(gear);
    });
    goalGearMap.forEach((model) => {
      const gear = new Gear(this.scene, model.type, model.tilt);
      gear.setPosition(model.x, model.y);
      gear.setGearColor(0x00ff00);
      this.gearGroup.add(gear);
    });
    freeGearMap.forEach((model) => {
      const gear = new Gear(this.scene, model.type, model.tilt);
      gear.setPosition(model.x, model.y);
      this.gearGroup.add(gear);
    });
  }

  private updateAvailableGearInfos() {
    this.availableGearInfoGroup.clear(true, true);
    if (!this.nextGearModel) return;

    const nextGearModel = this.nextGearModel;
    const availableInfos = this.gearMapComponent.getAvailableGearInfos(nextGearModel.radius);
    availableInfos.forEach((info) => {
      const circle = this.scene.add.circle(info.x, info.y, 8, 0xff0000, 1);
      this.availableGearInfoGroup.add(circle);
      circle.setInteractive();
      circle.on("pointerdown", () => {
        this.addFreeGear({ ...nextGearModel, ...info });
      });
    });
  }

  private addFreeGear(model: GearModel) {
    this.gearMapComponent.addFreeGear(model);
    this.gearMapComponent.removeAvailableGear(model.id);
    this.gearPool.initGears();
    this.updateGears();
    this.setNextGearModel();
  }

  private setNextGearModel(model?: GearModel) {
    this.nextGearModel = model;
    this.gearPool.setSelectedType(model?.type);
    this.updateAvailableGearInfos();
  }
}
