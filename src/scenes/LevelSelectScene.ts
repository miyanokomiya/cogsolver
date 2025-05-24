import Phaser from "phaser";
import gear1 from "../assets/images/gear1.svg";
import gear2 from "../assets/images/gear2.svg";
import gear3 from "../assets/images/gear3.svg";
import gear4 from "../assets/images/gear4.svg";
import { LEVEL_GRADE, LEVEL_LIST, LevelSceneConfig } from "../levels";
import { LevelRngSelectButton, LevelSelectButton } from "../widgets/LevelSelectButton";
import { DEFAULT_FONT } from "../utils/settings";
import { getGlobalStorageComponent } from "../components/GlobalStorageComponent";
import { Background2 } from "../pawns/Background";
import { SelectableGridComponent } from "../components/SelectableGridComponent";
import {InputComponent} from "../components/InputComponent";

export class LevelSelectScene extends Phaser.Scene {
  private config: LevelSceneConfig = { grade: LEVEL_GRADE.INTRODUCTION, index: 0 };
  protected inputComponent!: InputComponent;
  private selectableGridComponent!: SelectableGridComponent;

  constructor() {
    super({ key: "LEVEL_SELECT" });
  }

  preload() {
    this.load.image("gear1", gear1);
    this.load.image("gear2", gear2);
    this.load.image("gear3", gear3);
    this.load.image("gear4", gear4);
  }

  init(config: Partial<LevelSceneConfig>) {
    this.config.grade = config.grade ?? this.config.grade;
    this.config.index = config.index ?? this.config.index;
  }

  create() {
    const globalStore = getGlobalStorageComponent();
    this.inputComponent = new InputComponent(this);
    this.selectableGridComponent = new SelectableGridComponent(this.inputComponent);

    new Background2(this);

    const lineX = 100;

    this.add.text(lineX, 62, "Cogsolver", {
      fontSize: "70px",
      fontFamily: DEFAULT_FONT,
      color: "#000000",
    });

    const lineY = 180;

    const lineHeight = 100;
    const grouped = Object.entries(Object.groupBy(LEVEL_LIST, (level) => level.grade));
    grouped.forEach(([, list], gradeIndex) => {
      const label = this.add.text(lineX, lineY + gradeIndex * lineHeight, list[0].grade, {
        fontSize: "24px",
        fontFamily: DEFAULT_FONT,
        color: "#000000",
      });

      let buttonX = label.x;
      const buttons = list.map((level, levelIndex) => {
        const progress = globalStore.getLevelProgress({
          grade: level.grade,
          index: levelIndex,
          version: level.version,
        });
        const button = new (level.rng ? LevelRngSelectButton : LevelSelectButton)(
          this,
          0,
          label.y + 60,
          level.grade,
          levelIndex,
          !!progress
        );
        button.on("pointerdown", () => {
          const config = { grade: button.levelGrade, index: button.levelIndex };
          this.scene.start("MAIN", config);
        });
        button.x = buttonX + button.width / 2;
        buttonX += button.width + 10;
        return button;
      });
      this.selectableGridComponent.addLine(buttons);
    });

    this.add
      .text(
        lineX,
        this.scale.height - 40,
        `Move & Action: Mouse, Touch\nSwitch Gears: Wheel\nPause: Escape\n\n${process.env.__APP_VERSION__}`,
        {
          fontSize: "20px",
          fontFamily: DEFAULT_FONT,
          color: "#000000",
        }
      )
      .setOrigin(0, 1);
  }

  update(): void {
    this.inputComponent.update();
    this.selectableGridComponent.update();
  }
}
