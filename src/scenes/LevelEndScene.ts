import { InputComponent } from "../components/InputComponent";
import { getLevel, LevelSceneConfig } from "../levels";
import { getRandomSeed } from "../utils/inputs";
import { DEFAULT_FONT } from "../utils/settings";
import { MenuButton } from "../widgets/MenuButton";

type Config = LevelSceneConfig & { cleared: boolean };

export class LevelEndScene extends Phaser.Scene {
  private config!: Config;
  protected inputComponent!: InputComponent;

  constructor() {
    super({ key: "LEVEL_END" });
  }

  init(config: Config) {
    this.config = config;
  }

  create() {
    this.inputComponent = new InputComponent(this);

    const nextLevel = getLevel(this.config.grade, this.config.index + 1);

    this.add.graphics().fillStyle(0x000000, 0.3).fillRect(0, 0, this.scale.width, this.scale.height);

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 100, this.config.cleared ? "Cleared" : "Failed", {
        fontSize: "32px",
        fontFamily: DEFAULT_FONT,
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    const buttons: MenuButton[] = [];

    const nextButton = this.config.cleared && nextLevel ? new MenuButton(this, "Next", "primary") : undefined;
    if (nextButton) {
      nextButton.on("pointerdown", () => {
        const config = { grade: this.config.grade, index: this.config.index + 1 };
        this.scene.start("MAIN", config);
      });
      buttons.push(nextButton);
    }

    const newSeedButton = this.config.seed ? new MenuButton(this, "Roll", "primary") : undefined;
    if (newSeedButton) {
      newSeedButton.on("pointerdown", () => {
        const config = { grade: this.config.grade, index: this.config.index, seed: getRandomSeed() };
        this.scene.start("MAIN", config);
      });
      buttons.push(newSeedButton);
    }

    const resumeButton = new MenuButton(this, "Resume");
    resumeButton.on("pointerdown", () => {
      this.scene.stop().resume("MAIN");
    });

    const retryButton = new MenuButton(this, "Retry");
    retryButton.on("pointerdown", () => {
      const config = { grade: this.config.grade, index: this.config.index };
      this.scene.start("MAIN", config);
    });

    const menuButton = new MenuButton(this, "Menu");
    menuButton.on("pointerdown", () => {
      this.scene.stop("MAIN").start("LEVEL_SELECT", { grade: this.config.grade, index: this.config.index });
    });

    buttons.push(resumeButton, retryButton, menuButton);

    buttons.forEach((button, i) => {
      if (i === 0) {
        button.x = this.scale.width / 2;
        button.y = this.scale.height / 2;
      } else {
        Phaser.Display.Align.In.BottomCenter(button, buttons[i - 1], 0, button.height + 14);
      }
    });
  }

  update(_time: number, _delta: number): void {
    this.inputComponent.update();
  }
}
