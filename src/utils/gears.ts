interface Circle {
  radius: number;
  x: number;
  y: number;
}

export interface GearModel extends Circle {
  id: string;
  type: GearType;
}

export type GearType = "p-1" | "p-2" | "p-3" | "p-4" | "p-5" | "p-6" | "p-7" | "p-8";

const GEAR_ANGLE_UNIT = 15;

export function getAvailableGearPositionForRadius(gears: GearModel[], radius: number): { x: number; y: number }[] {
  const count = 360 / GEAR_ANGLE_UNIT;
  const radians = Array.from({ length: count }, (_, i) => Phaser.Math.DegToRad(GEAR_ANGLE_UNIT * i));
  const ret: { x: number; y: number }[] = [];

  gears.forEach((gear) => {
    const distance = gear.radius + radius;
    radians.forEach((r) => {
      const x = Math.cos(r) * distance;
      const y = Math.sin(r) * distance;
      ret.push({ x, y });
    });
  });

  return omitSamePoints(ret).filter((pos) => {
    return !isGearOverlapping({ radius, x: pos.x, y: pos.y }, gears);
  });
}

function isGearOverlapping(gear: Circle, gears: Circle[]): boolean {
  return gears.some((g) => {
    const distance = Phaser.Math.Distance.Between(g.x, g.y, gear.x, gear.y);
    return distance < g.radius + gear.radius;
  });
}

function omitSamePoints(points: { x: number; y: number }[], epsilon = 1e-6): { x: number; y: number }[] {
  const result: { x: number; y: number }[] = [];
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
  const radius = type === "p-1" ? 16 : 8;
  return { type, id, radius, x, y };
}
