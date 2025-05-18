import { createGearModel } from "../../utils/gears";
import { LevelBase } from "../LevelBase";

export class Intro_02 extends LevelBase {
  protected setupLevel() {
    this.gearMapComponent.setInitialGears([createGearModel("p-2", "init-1", 100, 500, 1)]);
    this.gearMapComponent.setGoalGears([
      createGearModel("p-2", "goal-1", 615.873935394876, 177.5266055622622, -1, 1 / 2),
      createGearModel("p-3", "goal-2", 288.20027047856905, 375.7997295214309, -1, 1 / 2),
      createGearModel("p-2", "goal-3", 330.27312395916863, 242.2268760408313, -1, 1 / 2),
    ]);
    this.gearMapComponent.setAvailableGears([
      ...Array.from({ length: 5 }, () => createGearModel("p-2", Phaser.Utils.String.UUID(), 0, 0)),
      ...Array.from({ length: 5 }, () => createGearModel("p-3", Phaser.Utils.String.UUID(), 0, 0)),
      ...Array.from({ length: 5 }, () => createGearModel("p-4", Phaser.Utils.String.UUID(), 0, 0)),
    ]);
  }
}
