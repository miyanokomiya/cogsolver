import Phaser from "phaser";
import { LevelSceneConfig } from "../levels";
import { LevelHUD } from "../widgets/LevelHUD";

export class MainHUDScene extends Phaser.Scene {
  private config!: LevelSceneConfig;
  private levelHUD!: LevelHUD;
  public seed = "";

  constructor() {
    super({ key: "MAIN_HUD" });
  }

  init(config: LevelSceneConfig) {
    this.config = config;
  }

  create() {
    console.log("MainHUDScene.ts");
    this.levelHUD = new LevelHUD(this, this.config).setDepth(10);
    if (this.seed) {
      this.levelHUD.displaySeed(this.seed);
    }
  }
}
