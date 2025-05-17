import Phaser from "phaser";
import { getLevel, LEVEL_GRADE, LevelSceneConfig } from "../levels";
import { LevelHUD } from "../widgets/LevelHUD";
import { getGlobalStorageComponent } from "../components/GlobalStorageComponent";
import { LevelBase } from "../levels/LevelBase";

export class MainScene extends Phaser.Scene {
  private level!: LevelBase;
  private config: LevelSceneConfig = { grade: LEVEL_GRADE.INTRODUCTION, index: 0 };

  constructor() {
    super({ key: "MAIN" });
  }

  init(config: Partial<LevelSceneConfig>) {
    this.config.grade = config.grade ?? this.config.grade;
    this.config.index = config.index ?? this.config.index;
  }

  preload() {}

  create() {
    const levelInfo = getLevel(this.config.grade, this.config.index)!;
    const LevelClass = levelInfo.LevelClass;
    this.level = new LevelClass(this);
    this.level.create();
    this.level.on("level-clear", () => {
      getGlobalStorageComponent().updateLevelProgress({ ...this.config, version: levelInfo.version }, 1);
      this.scene.pause().launch("LEVEL_END", { grade: this.config.grade, index: this.config.index, cleared: true });
    });
    this.level.on("level-fail", () => {
      this.scene.pause().launch("LEVEL_END", { grade: this.config.grade, index: this.config.index });
    });
    this.level.on("level-pause", () => {
      this.scene.pause().launch("LEVEL_PAUSE", { grade: this.config.grade, index: this.config.index });
    });

    new LevelHUD(this, this.config);
  }

  update(time: number, delta: number): void {
    this.level.update(time, delta);
  }
}
