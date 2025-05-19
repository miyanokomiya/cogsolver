import { GearMapComponent } from "../components/GearMapComponent";
import { InputComponent } from "../components/InputComponent";
import { ScrollableCameraComponent } from "../components/ScrollableCameraComponent";
import { VirtualKeyboardComponent } from "../components/VirtualKeyboardComponent";
import { Gear } from "../pawns/Gear";
import { createGearModel, GearModel } from "../utils/gears";
import { AvailableGearMarker } from "../widgets/AvailableGearMarker";
import { GearPool } from "../widgets/GearPool";

export class LevelBase extends Phaser.Events.EventEmitter {
  protected inputComponent!: InputComponent;
  private vkc!: VirtualKeyboardComponent;
  private background!: Phaser.GameObjects.TileSprite;
  private scrollableCameraComponent!: ScrollableCameraComponent;
  private gearGroup!: Phaser.GameObjects.Group;
  private availableGearInfoGroup!: Phaser.GameObjects.Group;
  protected gearMapComponent!: GearMapComponent;
  private gearPool!: GearPool;
  private nextGearModel: GearModel | undefined;
  private rotationTimestamp = 0;

  protected soundGearAdd: Phaser.Sound.BaseSound;
  protected soundGearRemove: Phaser.Sound.BaseSound;
  protected soundLevelClear: Phaser.Sound.BaseSound;

  constructor(protected scene: Phaser.Scene) {
    super();

    this.soundGearAdd = scene.sound.add("gear_add", { volume: 0.5 });
    this.soundGearRemove = scene.sound.add("gear_remove", { volume: 0.3 });
    this.soundLevelClear = scene.sound.add("level_clear", { volume: 0.2 });
  }

  protected setupLevel() {
    this.gearMapComponent.setGoalGears([
      createGearModel("p-2", "init-1", 100, 500, 1),
      createGearModel("p-2", "goal-1", 496.5462479183373, 103.45375208166261, 1),
      createGearModel("p-3", "goal-2", 266.27312395916863, 393.2268760408313, -1, 1 / 2),
      createGearModel("p-3", "goal-3", 330.97339443773774, 237.0266055622622, -1, 1 / 2),
    ]);
    this.gearMapComponent.setAvailableGears([
      ...Array.from({ length: 5 }, () => createGearModel("p-2", Phaser.Utils.String.UUID(), 0, 0)),
      ...Array.from({ length: 5 }, () => createGearModel("p-3", Phaser.Utils.String.UUID(), 0, 0)),
      ...Array.from({ length: 5 }, () => createGearModel("p-4", Phaser.Utils.String.UUID(), 0, 0)),
    ]);
  }

  protected getCameraBounds(): [minX: number, minY: number, maxX: number, maxY: number] {
    const goalBounds = this.gearMapComponent.getGoalBounds();
    const padding = 400;
    return [goalBounds[0] - padding, goalBounds[1] - padding, goalBounds[2] + padding, goalBounds[3] + padding];
  }

  create() {
    const hudScene = this.scene.scene.get("MAIN_HUD");
    this.inputComponent = new InputComponent(this.scene);
    this.vkc = new VirtualKeyboardComponent(hudScene, this.inputComponent);

    this.gearMapComponent = new GearMapComponent();
    this.gearGroup = this.scene.add.group();
    this.availableGearInfoGroup = this.scene.add.group();

    this.setupLevel();

    const cameraBounds = this.getCameraBounds();
    this.scrollableCameraComponent = new ScrollableCameraComponent(this.scene, this.scene.cameras.main);
    this.scrollableCameraComponent.setScrollBounds(...cameraBounds);
    this.scrollableCameraComponent.createUI(hudScene);

    this.background = this.scene.add
      .tileSprite(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        cameraBounds[2] - cameraBounds[0],
        cameraBounds[3] - cameraBounds[1],
        "rect_tile",
      )
      .setAlpha(0.1)
      .setScrollFactor(0);

    this.gearPool = new GearPool(hudScene, this.gearMapComponent);
    this.gearPool.setDepth(10);
    this.gearPool.setPosition(this.scene.scale.width - 250, this.scene.scale.height - 70);
    this.setNextGearModel(this.gearPool.getNextGearModelByType());
    this.gearPool.on("gear-select", (model: GearModel) => {
      this.setNextGearModel(model);
    });
    this.scene.input.on("wheel", (_a: any, _b: any, _deltaX: number, deltaY: number) => {
      const nextType =
        deltaY > 0
          ? this.gearPool.getNextGearModelByType(this.gearPool.getSelectedType())
          : this.gearPool.getPrevGearModelByType(this.gearPool.getSelectedType());
      this.setNextGearModel(nextType);
    });

    this.updateGears();
    this.updateAvailableGearInfos();
  }

  update(_time: number, delta: number): void {
    this.inputComponent.update();
    this.vkc.update();
    this.background.tilePositionX = this.scene.cameras.main.scrollX;
    this.background.tilePositionY = this.scene.cameras.main.scrollY;

    if (this.inputComponent.pressedKeys.left) {
    }
    if (this.inputComponent.pressedKeys.right) {
    }
    if (this.inputComponent.justPressedKeys.space) {
    }
    if (this.inputComponent.justPressedKeys.esc) {
      if (import.meta.env.MODE === "development") {
        console.log(JSON.parse(JSON.stringify(this.gearMapComponent.freeGears)));
      }
      this.emit("level-pause");
    }

    this.rotationTimestamp = (this.rotationTimestamp + delta) % 5000;
    this.animateGears();
  }

  private checkGameOver() {
    this.gearMapComponent.getConnectedGoals();
    if (this.gearMapComponent.getConnectedGoals().length === this.gearMapComponent.goalGears.length) {
      this.soundLevelClear.play();
      this.emit("level-clear");
    }
  }

  private animateGears() {
    const rate = this.rotationTimestamp / 5000;
    this.gearGroup.getChildren().forEach((gear) => {
      if (!(gear instanceof Gear)) return;
      gear.setGearAngleRelative(rate);
    });
    this.availableGearInfoGroup.getChildren().forEach((marker) => {
      if (!(marker instanceof AvailableGearMarker)) return;
      marker.setGearAngleRelative(rate);
    });
  }

  private updateGears() {
    const goalGearMap = new Map(this.gearMapComponent.goalGears.map((gear) => [gear.id, gear]));
    const freeGearMap = new Map(this.gearMapComponent.freeGears.map((gear) => [gear.id, gear]));

    const shouldRemove: Phaser.GameObjects.GameObject[] = [];
    this.gearGroup.getChildren().forEach((gear) => {
      if (!(gear instanceof Gear)) return;

      if (goalGearMap.has(gear.gearModel.id)) {
        const model = goalGearMap.get(gear.gearModel.id)!;
        gear.setPosition(model.x, model.y);
        goalGearMap.delete(gear.gearModel.id);
      } else if (freeGearMap.has(gear.gearModel.id)) {
        const model = freeGearMap.get(gear.gearModel.id)!;
        gear.setPosition(model.x, model.y);
        freeGearMap.delete(gear.gearModel.id);
      } else {
        shouldRemove.push(gear);
      }
    });
    shouldRemove.forEach((gear) => {
      this.gearGroup.remove(gear, true, true);
    });

    goalGearMap.forEach((model) => {
      const gear = new Gear(this.scene, model);
      gear.setPosition(model.x, model.y);
      gear.setGearColor(0x00ff55);
      this.gearGroup.add(gear);
    });
    freeGearMap.forEach((model) => {
      const gear = new Gear(this.scene, model, true);
      gear.setPosition(model.x, model.y);
      this.gearGroup.add(gear);

      gear.on("gear-remove", () => {
        this.removeFreeGear(model);
      });
    });
  }

  private updateAvailableGearInfos() {
    this.availableGearInfoGroup.clear(true, true);
    if (!this.nextGearModel) return;

    const nextGearModel = this.nextGearModel;
    const availableInfos = this.gearMapComponent.getAvailableGearInfos(nextGearModel.radius);
    availableInfos.forEach((info) => {
      const marker = new AvailableGearMarker(this.scene, { ...nextGearModel, ...info });
      this.availableGearInfoGroup.add(marker);
      marker.on("pointerdown", () => {
        this.addFreeGear({ ...nextGearModel, ...info });
      });
    });
  }

  private addFreeGear(model: GearModel) {
    this.gearMapComponent.addFreeGear(model);
    this.gearMapComponent.removeAvailableGear(model.id);
    this.gearPool.initGears();
    this.updateGears();
    this.setNextGearModel(this.gearPool.getGearModelByType(model.type));
    this.soundGearAdd.play();

    this.scene.time.delayedCall(500, () => {
      this.checkGameOver();
    });
  }

  private removeFreeGear(model: GearModel) {
    this.gearMapComponent.removeFreeGear(model.id);
    this.gearMapComponent.addAvailableGear(model);
    this.gearPool.initGears();
    this.updateGears();
    this.setNextGearModel(this.gearPool.getGearModelByType(model.type));
    this.soundGearRemove.play();
  }

  private setNextGearModel(model?: GearModel) {
    this.nextGearModel = model;
    this.gearPool.setSelectedType(model?.type);
    this.updateAvailableGearInfos();
  }
}
