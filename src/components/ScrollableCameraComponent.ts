export class ScrollableCameraComponent {
  private scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private isDragging = false;
  private startPointerX = 0;
  private startPointerY = 0;
  private startScrollX = 0;
  private startScrollY = 0;

  private minScrollX: number | null = null;
  private maxScrollX: number | null = null;
  private minScrollY: number | null = null;
  private maxScrollY: number | null = null;

  constructor(scene: Phaser.Scene, camera: Phaser.Cameras.Scene2D.Camera) {
    this.scene = scene;
    this.camera = camera;

    this.init();
  }
  private init() {
    const overlay = this.scene.add.zone(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      this.scene.scale.width,
      this.scene.scale.height,
    );
    overlay.setScrollFactor(0);
    overlay.setInteractive();

    overlay.on("pointerdown", this.onPointerDown, this);
    this.scene.input.on("pointerup", this.onPointerUp, this);
    this.scene.input.on("pointerupoutside", this.onPointerUp, this);
    this.scene.input.on("pointermove", this.onPointerMove, this);
  }
  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (pointer.leftButtonDown()) {
      this.isDragging = true;
      this.startPointerX = pointer.x;
      this.startPointerY = pointer.y;
      this.startScrollX = this.camera.scrollX;
      this.startScrollY = this.camera.scrollY;
    }
  }
  private onPointerUp(pointer: Phaser.Input.Pointer) {
    if (pointer.leftButtonReleased()) {
      this.isDragging = false;
    }
  }

  /**
   * Set scroll boundaries for the camera.
   * Pass null to disable a boundary.
   */
  public setScrollBounds(minX: number | null, minY: number | null, maxX: number | null, maxY: number | null) {
    this.minScrollX = minX;
    this.minScrollY = minY;
    this.maxScrollX = maxX === null ? null : maxX - this.scene.scale.width;
    this.maxScrollY = maxY === null ? null : maxY - this.scene.scale.height;
  }

  private clampScroll(x: number, y: number) {
    let clampedX = x;
    let clampedY = y;
    if (this.minScrollX !== null) clampedX = Math.max(clampedX, this.minScrollX);
    if (this.maxScrollX !== null) clampedX = Math.min(clampedX, this.maxScrollX);
    if (this.minScrollY !== null) clampedY = Math.max(clampedY, this.minScrollY);
    if (this.maxScrollY !== null) clampedY = Math.min(clampedY, this.maxScrollY);
    return { x: clampedX, y: clampedY };
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (this.isDragging) {
      const dx = pointer.x - this.startPointerX;
      const dy = pointer.y - this.startPointerY;
      let newX = this.startScrollX - dx;
      let newY = this.startScrollY - dy;
      const clamped = this.clampScroll(newX, newY);
      this.camera.scrollX = clamped.x;
      this.camera.scrollY = clamped.y;
    }
  }
}
