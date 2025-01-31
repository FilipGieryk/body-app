export class MouseControls {
  constructor(camera, object, mixer, animations, targetScale) {
    this.isMouseDown = false;
    this.lastMousePosition = { x: 0, y: 0 };
    this.camera = camera;
    this.object = object;
    this.mixer = mixer;
    this.animations = animations;
    this.targetScale = targetScale;

    this.threshold = 300;

    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  onMouseDown(event) {
    if (event.button === 0) {
      // Left mouse button
      this.isMouseDown = true;
      this.lastMousePosition.x = event.clientX; // Save initial mouse position
      this.startAnimation();
    }
  }

  // onMouseMove(event) {
  //   if (this.isMouseDown) {
  //     const deltaX = event.clientX - this.lastMousePosition.x;
  //     if (deltaX > 0) {
  //       // Mouse moved to the right
  //       if (this.animations.length > 1) {
  //         this.mixer.stopAllAction(); // Stop any currently playing animation
  //         this.animations[1].play(); // Play the right turn animation
  //       }
  //     } else if (deltaX < 0) {
  //       // Mouse moved to the left
  //       if (this.animations.length > 2) {
  //         this.mixer.stopAllAction(); // Stop any currently playing animation
  //         this.animations[2].play(); // Play the left turn animation
  //       }
  //     }

  //     this.lastMousePosition.x = event.clientX; // Update last mouse position
  //   }
  // }

  onMouseUp(event) {
    if (event.button === 0) {
      // Left mouse button
      this.isMouseDown = false;
      this.mixer.stopAllAction();
      if (this.animations.length > 0) {
        this.mixer.stopAllAction(); // Stop all animations when mouse is released
        this.animations[0].play(); // Optionally play default animation
      }
    }
  }
  startAnimation() {
    if (this.animations.length > 0) {
      this.animations[0].play(); // Play the default animation on click
    }
  }
}

export default MouseControls;
