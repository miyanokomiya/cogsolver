import { createGearModel } from "../../utils/gears";
import { LevelBase } from "../LevelBase";

export class Intro_03 extends LevelBase {
  protected setupLevel() {
    this.gearMapComponent.setInitialGears([createGearModel("p-2", "init-1", 100, 500, 1)]);
    this.gearMapComponent.setGoalGears([
      createGearModel("p-2", "goal-1", 627.4005409571382, 344.5, -1, 1 / 2),
      createGearModel("p-2", "goal-2", 255.49999999999997, 344.5, 1),
      createGearModel("p-2", "goal-3", 411.70027047856905, 279.7997295214309, 1),
    ]);
    this.gearMapComponent.setAvailableGears([
      ...Array.from({ length: 5 }, () => createGearModel("p-2", Phaser.Utils.String.UUID(), 0, 0)),
      ...Array.from({ length: 5 }, () => createGearModel("p-3", Phaser.Utils.String.UUID(), 0, 0)),
      ...Array.from({ length: 5 }, () => createGearModel("p-4", Phaser.Utils.String.UUID(), 0, 0)),
    ]);
  }
}
