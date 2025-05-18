import { GearMapComponent } from "../components/GearMapComponent";
import { InputComponent } from "../components/InputComponent";
import { VirtualKeyboardComponent } from "../components/VirtualKeyboardComponent";
import { Gear } from "../pawns/Gear";
import { createGearModel, GearModel } from "../utils/gears";

export class LevelBase extends Phaser.Events.EventEmitter {
  protected inputComponent!: InputComponent;
  private vkc!: VirtualKeyboardComponent;
  private gearGroup!: Phaser.GameObjects.Group;
  private availableGearInfoGroup!: Phaser.GameObjects.Group;
  private gearMapComponent!: GearMapComponent;

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
      const gear = new Gear(this.scene, model.type, false);
      gear.setPosition(model.x, model.y);
      gear.setGearColor(0xff4400);
      this.gearGroup.add(gear);
    });
    goalGearMap.forEach((model) => {
      const gear = new Gear(this.scene, model.type, false);
      gear.setPosition(model.x, model.y);
      gear.setGearColor(0x00ff00);
      this.gearGroup.add(gear);
    });
    freeGearMap.forEach((model) => {
      const gear = new Gear(this.scene, model.type, false);
      gear.setPosition(model.x, model.y);
      this.gearGroup.add(gear);
    });
  }

  private updateAvailableGearInfos() {
    this.availableGearInfoGroup.clear(true, true);

    const newGear = createGearModel("p-2", Phaser.Utils.String.UUID(), 0, 0);
    const availableInfos = this.gearMapComponent.getAvailableGearInfos(newGear.radius);
    availableInfos.forEach((info) => {
      const circle = this.scene.add.circle(info.x, info.y, 8, 0xff0000, 1);
      this.availableGearInfoGroup.add(circle);
      circle.setInteractive();
      circle.on("pointerdown", () => {
        this.addFreeGear({ ...newGear, x: info.x, y: info.y });
      });
    });
  }

  private addFreeGear(model: GearModel) {
    this.gearMapComponent.addFreeGear(model);
    this.updateGears();
    this.updateAvailableGearInfos();
  }
}
