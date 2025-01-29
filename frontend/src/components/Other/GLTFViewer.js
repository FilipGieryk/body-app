import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ObjectLoader } from "../../libs/ObjectLoader.js"; // Ensure the correct path
import { Utils } from "../../libs/Utils.js"; // Ensure the correct path
import { MouseControls } from "../../libs/MouseControls.js"; // Ensure the correct path
import BodyPartInfo from "./BodyPartInfo/BodyPartInfo.js";
import { getBodyPartInfo } from "../../data/bodyPartsData";
import { fetchExercises } from "../../api/exerciseService.js";
const GLTFViewer = () => {
  const mountRef = useRef(null);
  const mouse = new THREE.Vector2();
  const allObjectsRef = useRef([]); // Persistent reference for objects
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const clickedObjectRef = useRef();
  const isMouseDownRef = useRef(false);
  const animationActionRef = useRef(null);
  const hasMovedObjectRef = useRef(false);
  const mouseMovedRef = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const [selectedObject, setSelectedObject] = useState();
  const bodyPartInfo = getBodyPartInfo(selectedObject);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  let clickedOjbect = null;
  let originalPosition = new THREE.Vector3();
  useEffect(() => {
    const container = document.getElementById("container");
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Handle window resize
    window.addEventListener("resize", () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    initLights(scene);
    initObject(scene);

    function initLights(scene) {
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(0.3, 1, 0.3).normalize();
      scene.add(light);
    }

    function initObject(scene) {
      ObjectLoader.loadModel(
        "models/check9.gltf",
        scene,
        (object, animations) => {
          // scene.add(object);
          allObjectsRef.current.push(object); // Add to persistent ref
          mixerRef.current = new THREE.AnimationMixer(object);

          const clip = animations[0];
          animationActionRef.current = mixerRef.current.clipAction(clip);
          // animationActionRef.current.play();
          scene.add(object);
          Utils.centerObject(object);
        }
      );
    }

    sceneRef.current = scene; // Store scene in ref
    cameraRef.current = camera; // Store camera in ref
    rendererRef.current = renderer; // Store renderer in ref
  }, []);

  useEffect(() => {
    mountRef.current.appendChild(rendererRef.current.domElement);

    const onPointerMove = (event) => {
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    let currentIntersected = null;

    const onMouseDown = (event) => {
      if (event.button === 0) {
        // Left mouse button
        isMouseDownRef.current = true;
        // Log that the mouse was pressed
        console.log(
          "Mouse down detected, waiting for movement to start animation."
        );

        // Pause the animation initially
        if (animationActionRef.current) {
          animationActionRef.current.paused = true;
        }

        // Record the initial mouse position to calculate movement later
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        lastMousePosition.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };

        // Handle object movement, if necessary
        const objectToMove = allObjectsRef.current[0];
        if (objectToMove && !hasMovedObjectRef.current) {
          // objectToMove.position.y -= 3; // Move down by 3 units
          hasMovedObjectRef.current = true; // Mark as moved
          console.log(`Object moved to position: ${objectToMove.position.y}`);
        }
      }
    };
    const onMouseUp = (event) => {
      if (event.button === 0) {
        // Left mouse button
        isMouseDownRef.current = false;
        if (animationActionRef.current) {
          animationActionRef.current.paused = true; // Stop the animation on mouse up
        }
      }
    };

    function onClick(event) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(
        allObjectsRef.current[0].children[1].children,
        true
      );
      let clickedObject = null;
      if (intersects.length > 0) {
        clickedObject = intersects[0].object;
        // If nothing is clicked
        if (clickedObjectRef.current) {
          if (clickedObjectRef.current != clickedObject) {
            // Reset the color of previously clicked object if any
            clickedObjectRef.current.material.color.set(0.8, 0.8, 0.8);
            // setClickedObject(null); // Clear clicked object
          }
        }

        // If something is clicked

        // Only proceed if the clicked object is different from the current clicked object
        if (clickedObject.name !== "Mesh1__0") {
          // Reset previous clicked object's color if it exists
          if (clickedObject) {
            clickedObject.material.color.set(0.8, 0.8, 0.8); // Reset color
          }

          // Set the new clicked object and change its color
          clickedObject.material.color.set(10, 0, 0); // Set color to red
          setSelectedObject(clickedObject.name);
          // Update the clicked object state
          clickedObjectRef.current = clickedObject;
        }
      }
    }

    function checkHover() {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const excludedMeshes = ["Arms", "Head", "Legs"];
      const intersects = raycaster.intersectObjects(
        allObjectsRef.current,
        true
      );

      if (intersects.length > 0 && !clickedObjectRef.current) {
        const newIntersected = intersects[0].object;

        if (
          newIntersected !== clickedOjbect &&
          currentIntersected !== newIntersected &&
          !clickedObjectRef.current
        ) {
          currentIntersected?.material.color.set(0.8, 0.8, 0.8);
          if (!excludedMeshes.includes(newIntersected.name)) {
            newIntersected.material.color.set(10, 10, 10);
          }
          currentIntersected = newIntersected;
        }
      } else if (
        currentIntersected &&
        currentIntersected !== clickedObjectRef.current &&
        !clickedObjectRef.current
      ) {
        currentIntersected.material.color.set(0.8, 0.8, 0.8);
        currentIntersected = null;
      }
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("click", onClick);

    const animate = () => {
      checkHover();
      // rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
      if (mixerRef.current) {
        const delta = clockRef.current.getDelta(); // Time since last frame
        mixerRef.current.update(delta); // Update the mixer
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    const onMouseMove = (event) => {
      if (!isMouseDownRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const width = rect.width;

      // Determine the direction of animation based on mouse movement

      if (animationActionRef.current) {
        // Calculate the change in mouse position
        const deltaX = event.clientX - lastMousePosition.current.x;

        if (Math.abs(deltaX) > 2) {
          // Resume animation when significant movement is detected
          animationActionRef.current.paused = false;

          if (!animationActionRef.current.isRunning()) {
            animationActionRef.current.play();
          }

          if (deltaX < 0) {
            // Move left: play forward animation
            animationActionRef.current.timeScale = 1;
            animationActionRef.current.setLoop(THREE.LoopRepeat, Infinity);
          } else {
            // Move right: play backward animation
            animationActionRef.current.timeScale = -1;
            animationActionRef.current.setLoop(THREE.LoopRepeat, Infinity);
          }

          // Update animation time incrementally based on mouse movement
          const animationDuration =
            animationActionRef.current.getClip().duration;
          const timeIncrement = (deltaX / width) * animationDuration;

          animationActionRef.current.time += timeIncrement;
          if (animationActionRef.current.time >= animationDuration) {
            animationActionRef.current.time %= animationDuration; // Wrap forward
          } else if (animationActionRef.current.time < 0) {
            animationActionRef.current.time =
              animationDuration +
              (animationActionRef.current.time % animationDuration); // Wrap backward
          }
          // Update the last mouse position
          lastMousePosition.current = { x: event.clientX, y: event.clientY };
        } else {
          // Pause the animation if the mouse hasn't moved significantly
          animationActionRef.current.paused = true;
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);

    animate();
    return () => {
      // Cleanup
      document.body.removeChild(rendererRef.current.domElement);
    };
  }, []); // Empty dependency array to prevent re-runs

  useEffect(() => {
    const loadExercises = async () => {
      if (!selectedObject) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchExercises(selectedObject.toLowerCase(), 2);
        setExercises(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadExercises();
  }, [selectedObject]);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%" }}>
      {bodyPartInfo && (
        <BodyPartInfo
          staticInfo={bodyPartInfo}
          exercises={exercises}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
};

export default GLTFViewer;
