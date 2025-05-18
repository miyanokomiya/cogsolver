interface Circle {
  radius: number;
  x: number;
  y: number;
  rotation: -1 | 0 | 1;
}

export interface GearModel extends Circle {
  id: string;
  type: GearType;
}

export type GearType = "p-1" | "p-2" | "p-3" | "p-4" | "p-5" | "p-6" | "p-7" | "p-8";

const GEAR_ANGLE_UNIT = 45;

const GEAR_INCUT_RADIUS = 6;

export function getAvailableGearPositionForRadius(gears: GearModel[], radius: number): Circle[] {
  const count = 360 / GEAR_ANGLE_UNIT;
  const radians = Array.from({ length: count }, (_, i) => Phaser.Math.DegToRad(GEAR_ANGLE_UNIT * i));
  const ret: Circle[] = [];

  gears.forEach((gear) => {
    const distance = gear.radius + radius;
    radians.forEach((r) => {
      const x = gear.x + Math.cos(r) * distance;
      const y = gear.y + Math.sin(r) * distance;
      ret.push({ x, y, radius, rotation: getCounterRotation(gear) });
    });
  });

  return omitCircleWithSamePoints(ret).filter((circle) => {
    return !isGearOverlapping(circle, gears);
  });
}

function getCounterRotation(gear: GearModel): -1 | 0 | 1 {
  return -gear.rotation as any;
}

function isGearOverlapping(gear: Circle, gears: Circle[]): boolean {
  return gears.some((g) => {
    const distance = Phaser.Math.Distance.Between(g.x, g.y, gear.x, gear.y);
    const radiusSum = g.radius + gear.radius;
    if (radiusSum <= distance) return false;
    if (distance < radiusSum - GEAR_INCUT_RADIUS) return true;
    return g.rotation * gear.rotation > 0;
  });
}

function omitCircleWithSamePoints(points: Circle[], epsilon = 1e-6): Circle[] {
  const result: Circle[] = [];
  points.forEach((p) => {
    if (
      !result.some((q) => {
        return Phaser.Math.Distance.Squared(p.x, p.y, q.x, q.y) < epsilon * epsilon;
      })
    ) {
      result.push(p);
    }
  });
  return result;
}

export function createGearModel(type: GearType, id: string, x: number, y: number): GearModel {
  return { ...createCircleFromGearType(type, x, y), type, id };
}

function createCircleFromGearType(type: GearType, x: number, y: number): Circle {
  switch (type) {
    case "p-2":
      return { radius: 32, x, y, rotation: 0 };
    case "p-3":
      return { radius: 64, x, y, rotation: 0 };
    case "p-4":
      return { radius: 128, x, y, rotation: 0 };
    default:
      return { radius: 24, x, y, rotation: 0 };
  }
}
