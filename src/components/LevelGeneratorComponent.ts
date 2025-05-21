import Phaser from "phaser";
import { GearMapComponent } from "./GearMapComponent";
import {
  createCircleFromGearType,
  createGearModel,
  GEAR_TYPE,
  GearModel,
  GearType,
  getAvailableGearPositionForRadius,
} from "../utils/gears";

export class LevelGeneratorComponent {
  private rng: Phaser.Math.RandomDataGenerator;
  private cleardGearMapComponent = new GearMapComponent();
  private gearMaxCount: number;
  private gearExCount: number;

  constructor(
    public readonly seed: string,
    private availableGearTypes = Object.values(GEAR_TYPE),
    maxUsedCount = 10,
    maxExCount = 0
  ) {
    this.rng = new Phaser.Math.RandomDataGenerator([seed]);
    this.gearMaxCount = this.rng.between(4, maxUsedCount);
    this.gearExCount = this.rng.between(0, maxExCount);
  }

  public generateGearMap(): GearMapComponent {
    this.cleardGearMapComponent = new GearMapComponent();
    for (let i = 0; i < this.gearMaxCount; i++) {
      if (!this.generateStep()) break;
    }

    this.centralizeGears(this.cleardGearMapComponent.freeGears);

    const internalGears = this.cleardGearMapComponent.freeGears.slice(1, -1);
    const shuffledInternalGears = this.rng.shuffle(internalGears);
    const goalCount = this.rng.between(0, Math.max(0, Math.round(shuffledInternalGears.length / 4)));
    const goalGears = [
      this.cleardGearMapComponent.freeGears[0],
      ...shuffledInternalGears.slice(0, goalCount),
      this.cleardGearMapComponent.freeGears[this.cleardGearMapComponent.freeGears.length - 1],
    ];
    const freeGears = shuffledInternalGears.slice(goalCount);
    const availableGears = freeGears.concat();
    for (let i = 0; i < this.gearExCount; i++) {
      const gearModel = this.createNextGearModel();
      if (!gearModel) break;
      availableGears.push(gearModel);
    }

    const gearMapComponent = new GearMapComponent();
    gearMapComponent.setGoalGears(goalGears);
    gearMapComponent.setAvailableGears(availableGears);

    goalGears.forEach((gear) => {
      this.cleardGearMapComponent.removeFreeGear(gear.id);
    });
    this.cleardGearMapComponent.setGoalGears(goalGears);

    return gearMapComponent;
  }

  private generateStep(): boolean {
    const gearModel = this.createNextGearModel();
    if (!gearModel) return false;

    this.cleardGearMapComponent.addFreeGear(gearModel);
    return true;
  }

  private createNextGearModel(): GearModel | undefined {
    const currentGearModels = this.cleardGearMapComponent.freeGears;
    const lastGearModel = currentGearModels.at(-1);
    if (!lastGearModel) {
      const gearModel = this.createRandomGearModel();
      gearModel.x = 0;
      gearModel.y = 0;
      gearModel.rotationDirection = 1;
      gearModel.tilt = 0;
      return gearModel;
    }

    const nextGearType = this.createRandomGearType();
    const nextGearCircleSrc = createCircleFromGearType(nextGearType, 0, 0);
    const candidateCircles = getAvailableGearPositionForRadius(
      [lastGearModel],
      nextGearCircleSrc.radius,
      currentGearModels.slice(0, -1)
    );
    if (candidateCircles.length === 0) return;

    const nextGearCircle = this.rng.pick(candidateCircles);
    return { ...nextGearCircle, type: nextGearType, id: this.rng.uuid() };
  }

  private centralizeGears(gearModels: GearModel[]) {
    const cx = gearModels.reduce((v, m) => v + m.x, 0) / gearModels.length;
    const cy = gearModels.reduce((v, m) => v + m.x, 0) / gearModels.length;
    gearModels.forEach((m) => {
      m.x += 400 - cx;
      m.y += 300 - cy;
    });
  }

  private createRandomGearModel(): GearModel {
    return createGearModel(this.createRandomGearType(), this.rng.uuid(), 0, 0);
  }

  private createRandomGearType(): GearType {
    return this.rng.pick(this.availableGearTypes);
  }

  public getSolvedFreeGears(): GearModel[] {
    return this.cleardGearMapComponent.freeGears;
  }
}
