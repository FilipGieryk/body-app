import * as THREE from "three";

export const onPointerMove = (event: MouseEvent, rendererRef, mouse) => {
  if (!rendererRef.current) return;
  const rect = rendererRef.current.domElement.getBoundingClientRect();
  mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
};

export const onClick = (
  cameraRef,
  mouse,
  allObjectsRef,
  clickedObjectRef,
  setSelectedObject
) => {
  if (!cameraRef.current) return;
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse.current, cameraRef.current);
  const intersects = raycaster.intersectObjects(
    allObjectsRef.current[0].children[1].children,
    true
  );
  let clickedObject = null;
  if (intersects.length > 0) {
    clickedObject = intersects[0].object;
    if (clickedObjectRef.current && clickedObjectRef.current != clickedObject) {
      clickedObjectRef.current.material.color.set(0.8, 0.8, 0.8);
    }
    if (clickedObject != null) {
      clickedObject.material.color.set(10, 0, 0);
      setSelectedObject(clickedObject.name);
      clickedObjectRef.current = clickedObject;
    }
  }
};

export const checkHover = (
  mouse,
  currentIntersected,
  allObjectsRef,
  cameraRef,
  clickedObjectRef
) => {
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse.current, cameraRef.current);
  const excludedMeshes = ["Arms", "Head", "Legs"];
  const intersects = raycaster.intersectObjects(allObjectsRef.current, true);

  if (intersects.length > 0) {
    const newIntersected = intersects[0].object;
    if (
      newIntersected !== clickedObjectRef.current &&
      currentIntersected !== newIntersected
    ) {
      currentIntersected?.material.color.set(0.8, 0.8, 0.8);
    }
    if (!excludedMeshes.includes(newIntersected.name)) {
      newIntersected.material.color.set(10, 10, 10);
    }
    currentIntersected = newIntersected;
  } else if (
    currentIntersected &&
    currentIntersected !== clickedObjectRef.current
  ) {
    currentIntersected.material.color.set(0.8, 0.8, 0.8);
    currentIntersected = null;
  }
};

export const onMouseDown = (
  event,
  isMouseDownRef,
  animationActionRef,
  rendererRef,
  lastMousePosition,
  allObjectsRef,
  hasMovedObjectRef
) => {
  if (event.button === 0) {
    isMouseDownRef.current = true;
    if (animationActionRef.current) {
      animationActionRef.current.paused = true;
    }
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    lastMousePosition.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    const objectToMove = allObjectsRef.current[0];
    if (objectToMove && !hasMovedObjectRef.current) {
      hasMovedObjectRef.current = true;
      console.log(`Object moved to position: ${objectToMove.position.y}`);
    }
  }
};

export const onMouseUp = (
  event: { button: number },
  isMouseDownRef,
  animationActionRef
) => {
  if (event.button === 0) {
    isMouseDownRef.current = false;
    if (animationActionRef.current) {
      animationActionRef.current.paused = true;
    }
  }
};
