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
    if (g.rotationDirection * gear.rotationDirection > 0) return true;

    // TODO: This may work only for 1 / 2 tilt unit.
    const tiltSum = g.tilt + gear.tilt;
    if (Math.abs(tiltSum - Math.round(tiltSum)) < 1e-6) return true;

    return false;
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
    return isAdjacentGear(g, target);
  });
}

function isAdjacentGear(gear: GearCircle, target: GearCircle): boolean {
  if (gear === target) return false;

  const distance = Phaser.Math.Distance.Between(gear.x, gear.y, target.x, target.y);
  const radiusSum = gear.radius + target.radius;
  return radiusSum > distance;
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

// Treat targetIds[0] as the starting point
export function checkGearsConnected(gears: GearModel[], targetIds: string[]): Set<string> {
  if (targetIds.length === 0) return new Set();

  // Build a map from id to gear
  const gearMap = new Map<string, GearModel>();
  gears.forEach((g) => gearMap.set(g.id, g));

  // Use BFS to find all connected gears starting from the first target
  const visited = new Set<string>();
  const queue: string[] = [];
  if (!gearMap.has(targetIds[0])) return visited;

  queue.push(targetIds[0]);
  visited.add(targetIds[0]);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentGear = gearMap.get(currentId)!;
    for (const other of gears) {
      if (other.id === currentId) continue;
      if (!visited.has(other.id) && isAdjacentGear(currentGear, other)) {
        visited.add(other.id);
        queue.push(other.id);
      }
    }
  }

  // If the visited set is less than 2, it means no gears are connected
  if (visited.size < 2) return new Set();

  // Check if all targetIds are in the visited set (i.e., connected)
  // (The function returns the set of connected gear ids, not just a boolean)
  return visited;
}
