import Phaser from "phaser";
import { LevelSceneConfig } from "../levels";
import { LevelHUD } from "../widgets/LevelHUD";

export class MainHUDScene extends Phaser.Scene {
  private config!: LevelSceneConfig;

  constructor() {
    super({ key: "MAIN_HUD" });
  }

  init(config: LevelSceneConfig) {
    this.config = config;
  }

  create() {
    new LevelHUD(this, this.config).setDepth(10);
  }
}
