import { Intro_01 } from "./introductions/Intro_01";
import { Intro_02 } from "./introductions/Intro_02";
import { Intro_03 } from "./introductions/Intro_03";
import {Intro_rng} from "./introductions/Intro_rng";

export const LEVEL_GRADE = {
  INTRODUCTION: "INTRODUCTION",
  CHALLENGE: "CHALLENGE",
} as const;
export type LevelGrade = keyof typeof LEVEL_GRADE;

export type LevelSceneConfig = { grade: LevelGrade; index: number; seed?: string };

export type Level = {
  grade: (typeof LEVEL_GRADE)[LevelGrade];
  LevelClass: any;
  version: number;
  rng?: boolean;
};

export type LevelInfo = {
  grade: LevelGrade;
  index: number;
};

export const LEVEL_LIST: Level[] = [
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: Intro_01, version: 1 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: Intro_02, version: 1 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: Intro_03, version: 1 },
  { grade: LEVEL_GRADE.INTRODUCTION, LevelClass: Intro_rng, version: 1, rng: true },
];

export function getNextLevel(current: Level): Level | undefined {
  const levels = LEVEL_LIST.filter((level) => level.grade === current.grade);
  const currentIndex = levels.findIndex((level) => level === current);
  return levels.at(currentIndex + 1);
}

export function getLevel(grade: LevelGrade, index = 0): Level | undefined {
  const levels = LEVEL_LIST.filter((level) => level.grade === grade);
  return levels.at(index);
}
