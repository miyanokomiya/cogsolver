import { InputComponent } from "../components/InputComponent";
import { LevelSceneConfig } from "../levels";
import { getRandomSeed } from "../utils/inputs";
import { DEFAULT_FONT } from "../utils/settings";
import { MenuButton } from "../widgets/MenuButton";

type Config = LevelSceneConfig;

export class LevelPauseScene extends Phaser.Scene {
  private config!: Config;
  protected inputComponent!: InputComponent;

  constructor() {
    super({ key: "LEVEL_PAUSE" });
  }

  init(config: Config) {
    this.config = config;
  }

  create() {
    this.inputComponent = new InputComponent(this);

    this.add.graphics().fillStyle(0x000000, 0.3).fillRect(0, 0, this.scale.width, this.scale.height);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 100, "Paused", {
        fontSize: "32px",
        fontFamily: DEFAULT_FONT,
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    const buttons: MenuButton[] = [];

    const resumeButton = new MenuButton(this, "Resume", "primary");
    resumeButton.on("pointerdown", () => {
      this.resumeGame();
    });
    buttons.push(resumeButton);

    const newSeedButton = this.config.seed ? new MenuButton(this, "Roll", "primary") : undefined;
    if (newSeedButton) {
      newSeedButton.on("pointerdown", () => {
        const config = { grade: this.config.grade, index: this.config.index, seed: getRandomSeed() };
        this.scene.start("MAIN", config);
      });
      buttons.push(newSeedButton);
    }

    const retryButton = new MenuButton(this, "Retry");
    retryButton.on("pointerdown", () => {
      const config = { grade: this.config.grade, index: this.config.index };
      this.scene.start("MAIN", config);
    });
    buttons.push(retryButton);

    const menuButton = new MenuButton(this, "Menu");
    menuButton.on("pointerdown", () => {
      this.scene.stop("MAIN").start("LEVEL_SELECT", { grade: this.config.grade, index: this.config.index });
    });
    buttons.push(menuButton);

    buttons.forEach((button, i) => {
      if (i === 0) {
        button.x = this.scale.width / 2;
        button.y = this.scale.height / 2;
      } else {
        Phaser.Display.Align.In.BottomCenter(button, buttons[i - 1], 0, button.height + 14);
      }
    });
  }

  private resumeGame() {
    this.scene.stop().resume("MAIN");
  }

  update(_time: number, _delta: number): void {
    this.inputComponent.update();

    if (this.inputComponent.justPressedKeys.esc) {
      this.resumeGame();
    }
  }
}
