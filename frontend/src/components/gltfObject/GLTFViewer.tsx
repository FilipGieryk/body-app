import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ObjectLoader } from "./libs/ObjectLoader.jsx"; // Ensure the correct path
import { Utils } from "./libs/Utils.jsx"; // Ensure the correct path
import BodyPartInfo from "../thumbnail/BodyPartInfo.jsx";
import { getBodyPartInfo } from "../../data/bodyPartsData.jsx";
import { fetchExercises } from "../../api/exerciseService.tsx";
const GLTFViewer: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef(new THREE.Vector2());
  const allObjectsRef = useRef<THREE.Object3D[]>([]);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const clickedObjectRef = useRef<THREE.Object3D | null>();
  const isMouseDownRef = useRef(false);
  const animationActionRef = useRef<THREE.AnimationAction | null>(null);
  const hasMovedObjectRef = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const [selectedObject, setSelectedObject] = useState<string | undefined>();
  const bodyPartInfo = getBodyPartInfo(selectedObject);
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = document.getElementById("container");
    if (!container) return; // Ensure the container exists

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    mountRef.current?.appendChild(renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0.3, 1, 0.3).normalize();
    scene.add(light);

    ObjectLoader.loadModel(
      "models/check9.gltf",
      scene,
      (object: THREE.Object3D, animations: any[]) => {
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

    const initialPosition = new THREE.Vector3(0, 10, -20); // Behind the object
    const middlePosition = new THREE.Vector3(15, 10, 0);
    const targetPosition = new THREE.Vector3(0, 0, 5); // Move to front
    let startTime = performance.now();
    const duration = 2000;

    function animateCamera(time: number) {
      let elapsed = time - startTime;
      let progress = Math.min(elapsed / duration, 1);

      if (progress < 0.5) {
        // First half: Move from initial to middle
        camera.position.lerpVectors(
          initialPosition,
          middlePosition,
          progress * 2
        );
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
    }
    requestAnimationFrame(animateCamera);

    // Resize event listener
    const onResize = () => {
      if (camera && container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    mountRef.current.appendChild(rendererRef.current.domElement);

    const onMouseDown = (event) => {
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

    const onMouseUp = (event: { button: number }) => {
      if (event.button === 0) {
        isMouseDownRef.current = false;
        if (animationActionRef.current) {
          animationActionRef.current.paused = true;
        }
      }
    };

    const onPointerMove = (event: MouseEvent) => {
      if (!rendererRef.current) return;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    let currentIntersected = null;

    const onClick = () => {
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
        if (
          clickedObjectRef.current &&
          clickedObjectRef.current != clickedObject
        ) {
          clickedObjectRef.current.material.color.set(0.8, 0.8, 0.8);
        }
        if (clickedObject != null) {
          clickedObject.material.color.set(10, 0, 0);
          setSelectedObject(clickedObject.name);
          clickedObjectRef.current = clickedObject;
        }
      }
    };

    function checkHover() {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse.current, cameraRef.current);
      const excludedMeshes = ["Arms", "Head", "Legs"];
      const intersects = raycaster.intersectObjects(
        allObjectsRef.current,
        true
      );

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
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("click", onClick);

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
    const onMouseMove = (event) => {
      if (!isMouseDownRef.current || !rendererRef.current) return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const width = rect.width;

      if (animationActionRef.current) {
        const deltaX = event.clientX - lastMousePosition.current.x;

        if (Math.abs(deltaX) > 2) {
          animationActionRef.current.paused = false;

          if (!animationActionRef.current.isRunning()) {
            animationActionRef.current.play();
          }

          if (deltaX < 0) {
            animationActionRef.current.timeScale = 1;
            animationActionRef.current.setLoop(THREE.LoopRepeat, Infinity);
          } else {
            animationActionRef.current.timeScale = -1;
            animationActionRef.current.setLoop(THREE.LoopRepeat, Infinity);
          }

          const animationDuration =
            animationActionRef.current.getClip().duration;
          const timeIncrement = (deltaX / width) * animationDuration;

          animationActionRef.current.time += timeIncrement;
          if (animationActionRef.current.time >= animationDuration) {
            animationActionRef.current.time %= animationDuration;
          } else if (animationActionRef.current.time < 0) {
            animationActionRef.current.time =
              animationDuration +
              (animationActionRef.current.time % animationDuration);
          }
          lastMousePosition.current = { x: event.clientX, y: event.clientY };
        } else {
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
      if (mountRef.current && rendererRef.current) {
      }
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("mousemove", onMouseMove);
    };
  }, []);

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
    <div ref={mountRef} className="w-full h-full z-10">
      <div className="absolute inset-0 -left-30 -right-5 -bottom-15 -top-10 rotate-3 bg-[url(./assets/bg-brush.png)] bg-center bg-[length:104%_105%] z-[-10] " />
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
