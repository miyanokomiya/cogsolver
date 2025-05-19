import Phaser from "phaser";
import { getLevel, LEVEL_GRADE, LevelSceneConfig } from "../levels";
import { LevelHUD } from "../widgets/LevelHUD";
import { getGlobalStorageComponent } from "../components/GlobalStorageComponent";
import { LevelBase } from "../levels/LevelBase";

import rect_tile from "../assets/images/rect_tile.png";
import impact_1 from "../assets/sounds/impact_1.mp3";
import crunch_1 from "../assets/sounds/crunch_1.mp3";
import tone_1 from "../assets/sounds/tone_1.mp3";
import coin_3 from "../assets/sounds/coin_3.mp3";

export class MainScene extends Phaser.Scene {
  private level!: LevelBase;
  private config: LevelSceneConfig = { grade: LEVEL_GRADE.INTRODUCTION, index: 0 };

  constructor() {
    super({ key: "MAIN" });
  }

  preload() {
    this.load.image("rect_tile", rect_tile);
    this.load.audio("gear_add", impact_1);
    this.load.audio("clink_2", crunch_1);
    this.load.audio("gear_remove", tone_1);
    this.load.audio("level_clear", coin_3);
  }

  init(config: Partial<LevelSceneConfig>) {
    this.config.grade = config.grade ?? this.config.grade;
    this.config.index = config.index ?? this.config.index;
  }

  create() {
    new LevelHUD(this, this.config).setDepth(10);
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
  }

  update(time: number, delta: number): void {
    this.level.update(time, delta);
  }
}
