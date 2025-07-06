export const animateCamera = (time: number) => {
  const initialPosition = new THREE.Vector3(0, 10, -20); // Behind the object
  const middlePosition = new THREE.Vector3(15, 10, 0);
  const targetPosition = new THREE.Vector3(0, 0, 5); // Move to front

  let startTime = performance.now();
  const duration = 2000;
  let elapsed = time - startTime;
  let progress = Math.min(elapsed / duration, 1);

  if (progress < 0.5) {
    // First half: Move from initial to middle
    camera.position.lerpVectors(initialPosition, middlePosition, progress * 2);
  } else {
    // Second half: Move from middle to target
    camera.position.lerpVectors(
      middlePosition,
      targetPosition,
      (progress - 0.5) * 2
    );
  }

  camera.lookAt(0, 0, 0);

  if (progress < 1) {
    requestAnimationFrame(animateCamera);
  }
};

const animate = () => {
  checkHover();
  requestAnimationFrame(animate);
  if (mixerRef.current) {
    const delta = clockRef.current.getDelta();
    mixerRef.current.update(delta);
  }
  if (rendererRef.current)
    rendererRef.current.render(sceneRef.current, cameraRef.current);
};
