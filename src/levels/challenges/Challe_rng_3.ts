import { LevelGeneratorComponent } from "../../components/LevelGeneratorComponent";
import { getSeedInputOrRandom } from "../../utils/inputs";
import { LevelBase } from "../LevelBase";

export class Challe_rng_3 extends LevelBase {
  seed = getSeedInputOrRandom();

  protected setupLevel() {
    const levelGenerator = new LevelGeneratorComponent(this.seed, ["p-2", "p-3"], [4, 6], 0);
    const gearMap = levelGenerator.generateGearMap();

    this.gearMapComponent.setGoalGears(gearMap.goalGears);
    this.gearMapComponent.setAvailableGears(gearMap.availableGears);
  }
}
