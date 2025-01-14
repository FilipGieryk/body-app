export class MouseControls {
  constructor(camera, object, targetScale) {
    this.isMouseDown = false;
    this.lastMousePosition = { x: 0, y: 0 };
    this.camera = camera;
    this.object = object;
    this.targetScale = targetScale;

    this.threshold = 300;

    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseDown(event) {
    this.isMouseDown = true;
    this.lastMousePosition.x = event.clientX;
  }

  onMouseMove(event) {
    if (this.isMouseDown) {
      const deltaX = event.clientX - this.lastMousePosition.x;
      this.object.rotation.y += deltaX * 0.01;
      this.lastMousePosition.x = event.clientX;
    }
  }

  onMouseUp() {
    this.isMouseDown = false;
  }
}

export default MouseControls;
