import { LevelGeneratorComponent } from "../../components/LevelGeneratorComponent";
import { getSeedInputOrRandom } from "../../utils/inputs";
import { LevelBase } from "../LevelBase";

export class Intro_rng extends LevelBase {
  seed = getSeedInputOrRandom();

  protected setupLevel() {
    const levelGenerator = new LevelGeneratorComponent(this.seed, ["p-2"], [4, 5], 0);
    const gearMap = levelGenerator.generateGearMap();

    this.gearMapComponent.setGoalGears(gearMap.goalGears);
    this.gearMapComponent.setAvailableGears(gearMap.availableGears);
  }
}
