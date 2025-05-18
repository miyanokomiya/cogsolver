export interface GearCircle {
  radius: number;
  x: number;
  y: number;
  rotationDirection: -1 | 0 | 1;
  tilt: number;
}

export interface GearModel extends GearCircle {
  id: string;
  type: GearType;
}

export type GearType = "p-1" | "p-2" | "p-3" | "p-4";

const GEAR_ANGLE_UNIT = 45;

const GEAR_INCUT_RADIUS = 6;

export function getAvailableGearPositionForRadius(
  gears: GearModel[],
  radius: number,
  obstacles: GearModel[] = [],
): GearCircle[] {
  const count = 360 / GEAR_ANGLE_UNIT;
  const radians = Array.from({ length: count }, (_, i) => Phaser.Math.DegToRad(GEAR_ANGLE_UNIT * i));
  const ret: GearCircle[] = [];

  gears.forEach((gear) => {
    const distance = gear.radius + radius - GEAR_INCUT_RADIUS * 0.75;
    radians.forEach((r) => {
      const x = gear.x + Math.cos(r) * distance;
      const y = gear.y + Math.sin(r) * distance;
      ret.push({
        x,
        y,
        radius,
        rotationDirection: getCounterRotation(gear),
        tilt: gear.tilt + 1 / 2,
      });
    });
  });

  const allObstacles = [...gears, ...obstacles];
  return omitCircleWithSamePoints(ret).filter((circle) => {
    return !isGearOverlapping(circle, allObstacles);
  });
}

function getCounterRotation(gear: GearModel): -1 | 0 | 1 {
  return -gear.rotationDirection as any;
}

function isGearOverlapping(gear: GearCircle, gears: GearCircle[]): boolean {
  return gears.some((g) => {
    const distance = Phaser.Math.Distance.Between(g.x, g.y, gear.x, gear.y);
    const radiusSum = g.radius + gear.radius;
    if (radiusSum <= distance) return false;
    if (distance < radiusSum - GEAR_INCUT_RADIUS) return true;
    return g.rotationDirection * gear.rotationDirection > 0;
  });
}

// Assume all gears are at proper positions
export function getAdjacentGearMap(gears: GearCircle[]): Map<GearCircle, GearCircle[]> {
  const map = new Map<GearCircle, GearCircle[]>();
  gears.forEach((gear) => {
    map.set(gear, getAdjacentGearMapFor(gears, gear));
  });
  return map;
}

export function getAdjacentGearMapFor(gears: GearCircle[], target: GearCircle): GearCircle[] {
  return gears.filter((g) => {
    if (g === target) return false;

    const distance = Phaser.Math.Distance.Between(g.x, g.y, target.x, target.y);
    const radiusSum = g.radius + target.radius;
    return radiusSum > distance;
  });
}

function omitCircleWithSamePoints(points: GearCircle[], epsilon = 1e-6): GearCircle[] {
  const result: GearCircle[] = [];
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

export function createGearModel(
  type: GearType,
  id: string,
  x: number,
  y: number,
  rotation?: GearCircle["rotationDirection"],
  tilt?: GearCircle["tilt"],
): GearModel {
  return { ...createCircleFromGearType(type, x, y), type, id, rotationDirection: rotation ?? 0, tilt: tilt ?? 0 };
}

export function createCircleFromGearType(type: GearType, x: number, y: number): GearCircle {
  switch (type) {
    case "p-2":
      return { radius: 32, x, y, rotationDirection: 0, tilt: 0 };
    case "p-3":
      return { radius: 64, x, y, rotationDirection: 0, tilt: 0 };
    case "p-4":
      return { radius: 128, x, y, rotationDirection: 0, tilt: 0 };
    default:
      return { radius: 24, x, y, rotationDirection: 0, tilt: 0 };
  }
}
