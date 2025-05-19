import { checkGearsConnected, GearCircle, GearModel, getAvailableGearPositionForRadius } from "../utils/gears";

export class GearMapComponent {
  goalGears: GearModel[] = [];
  freeGears: GearModel[] = [];
  availableGears: GearModel[] = [];

  setGoalGears(gears: GearModel[]) {
    this.goalGears = gears.concat();
  }

  setAvailableGears(gears: GearModel[]) {
    this.availableGears = gears.concat();
  }

  getAvailableGearInfos(radius: number): GearCircle[] {
    const allGears = this.freeGears.concat(this.goalGears);
    return getAvailableGearPositionForRadius(allGears, radius);
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

  getConnectedGoals() {
    const allGears = this.freeGears.concat(this.goalGears);
    const connectedSet = checkGearsConnected(
      allGears,
      this.goalGears.map((g) => g.id),
    );
    return this.goalGears.filter((goalGear) => connectedSet.has(goalGear.id));
  }
}
