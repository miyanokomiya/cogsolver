import Phaser from "phaser";
import { getLevel, LevelSceneConfig } from "../levels";
import { getGlobalStorageComponent } from "../components/GlobalStorageComponent";
import { LevelBase } from "../levels/LevelBase";

import rect_tile from "../assets/images/rect_tile.png";
import impact_1 from "../assets/sounds/impact_1.mp3";
import crunch_1 from "../assets/sounds/crunch_1.mp3";
import tone_1 from "../assets/sounds/tone_1.mp3";
import coin_3 from "../assets/sounds/coin_3.mp3";
import { MainHUDScene } from "./MainHUDScene";

export class MainScene extends Phaser.Scene {
  private level?: LevelBase;
  private config!: LevelSceneConfig;

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

  init(config: LevelSceneConfig) {
    console.log("MainScene.ts");
    this.config = config;
    this.level = undefined;
    this.scene.launch("MAIN_HUD", this.config);
  }

  create() {
    // Need to wait until "MAIN_HUD" executes its "create".
    this.time.delayedCall(1, () => {
      const levelInfo = getLevel(this.config.grade, this.config.index)!;
      const LevelClass = levelInfo.LevelClass;
      const level = new LevelClass(this);
      this.level = level;
      level.create();
      level.on("level-clear", () => {
        getGlobalStorageComponent().updateLevelProgress({ ...this.config, version: levelInfo.version }, 1);
        this.scene.pause().launch("LEVEL_END", { grade: this.config.grade, index: this.config.index, cleared: true });
      });
      level.on("level-fail", () => {
        this.scene
          .pause()
          .pause("MAIN_HUD")
          .launch("LEVEL_END", { grade: this.config.grade, index: this.config.index });
      });
      level.on("level-pause", () => {
        this.scene
          .pause()
          .pause("MAIN_HUD")
          .launch("LEVEL_PAUSE", { grade: this.config.grade, index: this.config.index });
      });
      this.events.on("resume", () => {
        this.scene.resume("MAIN_HUD");
      });
      this.events.on("shutdown", () => {
        this.scene.stop("MAIN_HUD");
      });

      const hudScene = this.scene.get("MAIN_HUD") as MainHUDScene;
      hudScene.seed = level.seed;
    });
  }

  update(time: number, delta: number): void {
    this.level?.update(time, delta);
  }
}
