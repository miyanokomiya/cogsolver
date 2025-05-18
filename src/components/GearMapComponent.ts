import { GearModel } from "../utils/gears";

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
}
