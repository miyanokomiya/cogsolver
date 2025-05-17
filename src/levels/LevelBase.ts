import { InputComponent } from "../components/InputComponent";
import { VirtualKeyboardComponent } from "../components/VirtualKeyboardComponent";

export class LevelBase extends Phaser.Events.EventEmitter {
  protected inputComponent!: InputComponent;
  private vkc!: VirtualKeyboardComponent;

  constructor(protected scene: Phaser.Scene) {
    super();
  }

  create() {
    this.inputComponent = new InputComponent(this.scene);
    this.vkc = new VirtualKeyboardComponent(this.scene, this.inputComponent);
  }

  update(_time: number, _delta: number): void {
    this.inputComponent.update();
    this.vkc.update();

    if (this.inputComponent.pressedKeys.left) {
    }
    if (this.inputComponent.pressedKeys.right) {
    }
    if (this.inputComponent.justPressedKeys.space) {
    }
    if (this.inputComponent.justPressedKeys.esc) {
      this.emit("level-pause");
    }
  }
}
