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
    const allGears = this.initialGears.concat(this.goalGears).concat(this.freeGears);
    return getAvailableGearPositionForRadius(allGears, radius);
  }

  addFreeGear(gear: GearModel) {
    this.freeGears.push(gear);
  }

  removeFreeGear(id: string) {
    this.freeGears = this.freeGears.filter((g) => g.id !== id);
  }

  removeAvailableGear(id: string) {
    this.availableGears = this.availableGears.filter((g) => g.id !== id);
  }
}
