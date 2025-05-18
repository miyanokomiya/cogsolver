import { SelectableObject } from "../components/SelectableGridComponent";
import { DEFAULT_FONT } from "../utils/settings";

const WIDTH = 100;
const HEIGHT = 40;

export class MenuButton extends Phaser.GameObjects.Container implements SelectableObject {
  private background: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    text: string,
    private variant?: "primary" | "secondary",
  ) {
    super(scene, 0, 0);
    scene.add.existing(this);

    const background = scene.add.graphics();
    this.background = background;
    this.setFocused(false);
    this.add(background);

    const label = scene.add.text(0, 0, text, {
      fontSize: "20px",
      fontFamily: DEFAULT_FONT,
      color: this.getTextColor(),
    });
    label.setOrigin(0.5, 0.5);
    this.add(label);

    this.setSize(WIDTH, HEIGHT);

    this.setInteractive();
    this.on("pointermove", () => {
      this.setFocused(true);
    });
    this.on("pointerout", () => {
      this.setFocused(false);
    });
  }

  setFocused(focused: boolean) {
    this.background.clear();
    this.background.fillStyle(this.getFillColor());
    this.background.lineStyle(focused ? 4 : 2, focused ? 0xeeee00 : 0x000000);
    this.background.fillRoundedRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT, 10);
    this.background.strokeRoundedRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT, 10);
  }

  getFillColor() {
    switch (this.variant) {
      case "primary":
        return 0x0044ff;
      case "secondary":
        return 0xeeeeee;
      default:
        return 0xeeeeee;
    }
  }

  getTextColor() {
    switch (this.variant) {
      case "primary":
        return "#ffffff";
      case "secondary":
        return "#000000";
      default:
        return "#000000";
    }
  }
}
