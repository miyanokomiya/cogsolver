import { DEFAULT_FONT } from "../utils/settings";

const ZOOM_STEP = 1.2;

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

  private zoomInButton?: Phaser.GameObjects.Container;
  private zoomOutButton?: Phaser.GameObjects.Container;

  private overlay!: Phaser.GameObjects.Zone;

  constructor(scene: Phaser.Scene, camera: Phaser.Cameras.Scene2D.Camera) {
    this.scene = scene;
    this.camera = camera;

    this.init();
  }
  private init() {
    this.overlay = this.scene.add.zone(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      this.scene.scale.width,
      this.scene.scale.height,
    );
    this.overlay.setScrollFactor(0);
    this.overlay.setInteractive();

    this.overlay.on("pointerdown", this.onPointerDown, this);
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
      const dx = (pointer.x - this.startPointerX) / this.camera.zoom;
      const dy = (pointer.y - this.startPointerY) / this.camera.zoom;
      let newX = this.startScrollX - dx;
      let newY = this.startScrollY - dy;
      const clamped = this.clampScroll(newX, newY);
      this.camera.scrollX = clamped.x;
      this.camera.scrollY = clamped.y;
    }
  }

  /**
   * Zoom in the camera by a given factor (default: 1.1).
   */
  public zoomIn(factor: number = ZOOM_STEP) {
    this.camera.setZoom(this.camera.zoom * factor);
    this.overlay.setScale(1 / this.camera.zoom);
  }

  /**
   * Zoom out the camera by a given factor (default: 1.1).
   */
  public zoomOut(factor: number = ZOOM_STEP) {
    this.camera.setZoom(this.camera.zoom / factor);
    this.overlay.setScale(1 / this.camera.zoom);
  }

  /**
   * Helper to create a zoom button with a rectangle background as a game object.
   */
  private createZoomButton(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const width = 48;
    const height = 48;
    const bg = scene.add.rectangle(0, 0, width, height, 0x333333, 0.5);
    const text = scene.add
      .text(0, 0, label, {
        font: "30px",
        fontFamily: DEFAULT_FONT,
        color: "#fff",
      })
      .setOrigin(0.5, 0.5);
    const container = scene.add.container(x, y, [bg, text]);
    container.setSize(width, height);
    container.setInteractive();
    container.on("pointerdown", onClick);
    return container;
  }

  public createUI(scene: Phaser.Scene) {
    if (this.zoomInButton && this.zoomOutButton) return;

    const padding = 12;
    const buttonSize = 48;
    const sceneHeight = scene.scale.height;

    // Zoom In Button
    this.zoomInButton = this.createZoomButton(
      scene,
      padding + buttonSize / 2,
      sceneHeight - buttonSize / 2 - padding,
      "+",
      () => this.zoomIn(),
    );

    // Zoom Out Button
    this.zoomOutButton = this.createZoomButton(
      scene,
      padding + this.zoomInButton.x + buttonSize,
      this.zoomInButton.y,
      "-",
      () => this.zoomOut(),
    );
  }
}
