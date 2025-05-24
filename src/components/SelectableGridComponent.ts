import { InputComponent } from "./InputComponent";

export interface SelectableObject extends Phaser.GameObjects.GameObject {
  setFocused(focused: boolean): void;
}

export class SelectableGridComponent<T extends SelectableObject = SelectableObject> extends Phaser.Events.EventEmitter {
  private itemGrid: T[][] = [];
  private focused: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private inputComponent?: InputComponent) {
    super();
  }

  clear() {
    this.itemGrid.forEach((row) => {
      row.forEach((item) => {
        item.off("pointermove", this.hoverItem);
        item.setFocused(false);
      });
    });
    this.itemGrid = [];
    this.focused = { x: 0, y: 0 };
  }

  addLine(items: T[]) {
    this.itemGrid.push(items);
    items.forEach((item) => {
      item.on("pointermove", this.hoverItem.bind(this, item));
    });
  }

  update() {
    const focusedButton = this.getFocusedButton();
    if (this.inputComponent?.justPressedKeys.left) {
      this.focusItem(Math.max(0, this.focused.x - 1), this.focused.y);
    }
    if (this.inputComponent?.justPressedKeys.right) {
      this.focusItem(Math.min(this.itemGrid[this.focused.y].length - 1, this.focused.x + 1), this.focused.y);
    }
    if (this.inputComponent?.justPressedKeys.up) {
      this.focusItem(this.focused.x, Math.max(0, this.focused.y - 1));
    }
    if (this.inputComponent?.justPressedKeys.down) {
      this.focusItem(this.focused.x, Math.min(this.itemGrid.length - 1, this.focused.y + 1));
    }
    if (this.inputComponent?.justPressedKeys.space) {
      const button = this.getFocusedButton();
      if (button) {
        this.emit("item-select", button);
        return;
      }
    }

    const nextFocusedButton = this.getFocusedButton();
    if (focusedButton !== nextFocusedButton) {
      focusedButton?.setFocused(false);
      nextFocusedButton?.setFocused(true);
    }
  }

  focusItem(x: number, y: number) {
    y = Math.max(0, Math.min(this.itemGrid.length - 1, y));
    const nextLine = this.itemGrid.at(y);
    if (!nextLine) return;

    x = Math.max(0, Math.min(nextLine.length - 1, x));
    const nextItem = nextLine.at(x);
    if (!nextItem) return;

    this.itemGrid[this.focused.y]?.[this.focused.x]?.setFocused(false);
    nextItem.setFocused(true);
    this.focused.x = x;
    this.focused.y = y;
    this.emit("item-focused", nextItem);
  }

  getFocusedButton(): T | undefined {
    return this.itemGrid[this.focused.y]?.[this.focused.x];
  }

  private hoverItem(target: T) {
    let x = -1;
    let y = -1;
    this.itemGrid.some((line, i) => {
      return line.some((item, j) => {
        if (item === target) {
          x = j;
          y = i;
          return true;
        }
      });
    });
    if (x === -1 || y === -1) return;

    this.focusItem(x, y);
  }
}
