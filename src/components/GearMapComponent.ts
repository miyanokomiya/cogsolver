import { GearCircle, GearModel, getAvailableGearPositionForRadius } from "../utils/gears";

export class GearMapComponent {
  initialGears: GearModel[] = [];
  goalGears: GearModel[] = [];
  freeGears: GearModel[] = [];
  availableGears: GearModel[] = [];

  constructor(private scene: Phaser.Scene) {}

  setInitialGears(gears: GearModel[]) {
    this.initialGears = gears.concat();
  }

  setGoalGears(gears: GearModel[]) {
    this.goalGears = gears.concat();
  }

  setAvailableGears(gears: GearModel[]) {
    this.availableGears = gears.concat();
  }

  getAvailableGearInfos(radius: number): GearCircle[] {
    const allGears = this.initialGears.concat(this.freeGears);
    return getAvailableGearPositionForRadius(allGears, radius, this.goalGears);
  }

  addFreeGear(gear: GearModel) {
    this.freeGears.push(gear);
  }

  removeFreeGear(id: string) {
    this.freeGears = this.freeGears.filter((g) => g.id !== id);
  }

  addAvailableGear(gear: GearModel) {
    this.availableGears.push(gear);
  }

  removeAvailableGear(id: string) {
    this.availableGears = this.availableGears.filter((g) => g.id !== id);
  }
}
