import { LEVEL_GRADE, LevelInfo } from "../levels";
import { DEFAULT_FONT } from "../utils/settings";

export class LevelHUD extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, levelInfo: LevelInfo) {
    super(scene);
    scene.add.existing(this);
    this.setScrollFactor(0);

    const background = scene.add
      .graphics()
      .fillStyle(0xaaaaaa, 0.5)
      .fillRoundedRect(scene.scale.width / 4, 8, scene.scale.width / 2, 32, 8);

    const levelText = scene.add.text(
      scene.scale.width / 2,
      24,
      `${LEVEL_GRADE[levelInfo.grade]}    Level: ${levelInfo.index + 1}`,
      {
        fontSize: "24px",
        fontFamily: DEFAULT_FONT,
      },
    );
    levelText.setOrigin(0.5, 0.5);
    this.add([background, levelText]);
  }
}
