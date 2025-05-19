import Phaser from "phaser";
import { InputComponent } from "./InputComponent";

export class VirtualKeyboardComponent {
  private scene: Phaser.Scene;
  private inputComponent: InputComponent;
  private pressedKeys: { [key: string]: boolean } = {};
  public justPressedKeys: {
    [key: string]: boolean;
  } = {};

  constructor(scene: Phaser.Scene, inputComponent: InputComponent) {
    this.scene = scene;
    this.inputComponent = inputComponent;

    scene.events.on(Phaser.Scenes.Events.RESUME, () => {
      this.pressedKeys = {};
      this.justPressedKeys = {};
    });

    this.createButtons();
  }

  private createButtons() {
    const left = 50;
    const buttonSize = 60;
    this.createButton(left, buttonSize, buttonSize, "Esc", "esc");
  }

  private createButton(x: number, y: number, width: number, label: string, key: string) {
    const button = this.scene.add
      .rectangle(x, y, width, 60, 0xaaaaaa, 0.5)
      .setInteractive()
      .on("pointerdown", () => this.handleButtonPress(key))
      .on("pointerup", () => this.handleButtonRelease(key))
      .on("pointerleave", () => this.handleButtonRelease(key));
    button.setScrollFactor(0);
    button.setDepth(100);

    const text = this.scene.add
      .text(x, y, label, {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(100);

    return button;
  }

  private handleButtonPress(key: string) {
    this.updateKey(key, true);
  }

  private handleButtonRelease(key: string) {
    this.updateKey(key, false);
  }

  private updateKey(key: string, isDown = false) {
    if (isDown) {
      this.justPressedKeys[key] = true;
    } else {
      this.justPressedKeys[key] = false;
    }
    this.pressedKeys[key] = isDown;
  }

  update() {
    this.inputComponent.applyExternalKeys(this.pressedKeys, this.justPressedKeys);
    this.justPressedKeys = {};
  }
}
