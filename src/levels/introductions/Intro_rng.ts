import {LevelGeneratorComponent} from "../../components/LevelGeneratorComponent";
import { LevelBase } from "../LevelBase";

export class Intro_rng extends LevelBase {
  protected seed = "abcdef";

  protected setupLevel() {
    const levelGenerator = new LevelGeneratorComponent(this.seed, ["p-2", "p-3", "p-4"], 10, 0)
    const gearMap = levelGenerator.generateGearMap();

    this.gearMapComponent.setGoalGears(gearMap.goalGears);
    this.gearMapComponent.setAvailableGears(gearMap.availableGears);
  }
}
