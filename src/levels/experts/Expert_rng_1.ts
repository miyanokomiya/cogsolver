import { LevelGeneratorComponent } from "../../components/LevelGeneratorComponent";
import { getSeedInputOrRandom } from "../../utils/inputs";
import { LevelBase } from "../LevelBase";

export class Expert_rng_1 extends LevelBase {
  seed = getSeedInputOrRandom();

  protected setupLevel() {
    const levelGenerator = new LevelGeneratorComponent(this.seed, ["p-2", "p-3", "p-4"], [10, 14], 10);
    const gearMap = levelGenerator.generateGearMap();

    this.gearMapComponent.setGoalGears(gearMap.goalGears);
    this.gearMapComponent.setAvailableGears(gearMap.availableGears);
  }
}
