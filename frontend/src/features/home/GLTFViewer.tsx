import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// import { ObjectLoader } from "./libs/ObjectLoader.jsx"; // Ensure the correct path
// import { Utils } from "./libs/Utils.jsx"; // Ensure the correct path
// import BodyPartInfo from "../thumbnail/BodyPartInfo.jsx";
// import { getBodyPartInfo } from "../../data/bodyPartsData.jsx";
// import { fetchExercises } from "../../api/exerciseService.tsx";
// import {
//   onClick,
//   onPointerMove,
//   onMouseDown,
//   onMouseUp,
//   checkHover,
//   // onMouseMove,
// } from "./helpers/threeHandlers.ts";
import { animateCamera } from "./helpers/animationUtils.ts";
import { loadModel } from "./helpers/loadUtils.ts";
import { centerObject } from "./helpers/transformUtils.ts";

const GLTFViewer: React.FC = () => {
  // THREE refs
  // testing ths ref

  const raycasterRef = useRef(new THREE.Raycaster());

  const animationActionRef = useRef<THREE.AnimationAction | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clickedObjectRef = useRef<THREE.Object3D | null>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const allObjectsRef = useRef<THREE.Object3D[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const clockRef = useRef(new THREE.Clock());
  const mouse = useRef(new THREE.Vector2());
  const sceneRef = useRef<THREE.Scene>();

  // other Refs

  const lastMousePosition = useRef({ x: 0, y: 0 });
  const mountRef = useRef<HTMLDivElement>(null);
  const hasMovedObjectRef = useRef(false);
  const isMouseDownRef = useRef(false);

  // states

  const [selectedObject, setSelectedObject] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // const bodyPartInfo = getBodyPartInfo(selectedObject);
  // functinos
  // ..................
  // ..................
  // ...................

  // const loadExercises = async () => {
  //   if (!selectedObject) return;

  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const data = await fetchExercises(selectedObject.toLowerCase(), 2);
  //     setExercises(data);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffects
  // ..................
  // ..................
  // ...................

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

    const onResize = () => {
      if (camera && container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    };

    const load = async () => {
      try {
        const { object, animations } = await loadModel("/models/check9.gltf");
        allObjectsRef.current.push(object);
        mixerRef.current = new THREE.AnimationMixer(object);
        const clip = animations[0];
        animationActionRef.current = mixerRef.current.clipAction(clip);
        animationActionRef.current.play();
        scene.add(object);
        console.log(scene);
        centerObject(object);
        // object.scale.set(0.1, 0.1, 0.1);
      } catch (err) {
        console.error("failed to load model", err);
      }
    };

    load();

    requestAnimationFrame(animateCamera);

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    //   mountRef.current.appendChild(rendererRef.current.domElement);

    //   const handlePointerMove = (event) =>
    //     onPointerMove(event, rendererRef, mouse);

    //   const handleMouseUp = (event) =>
    //     onMouseUp(event, isMouseDownRef, animationActionRef);

    //   const handleClick = () =>
    //     onClick(
    //       cameraRef,
    //       mouse,
    //       allObjectsRef,
    //       clickedObjectRef,
    //       setSelectedObject
    //     );

    //   const handleMouseDown = (event) =>
    //     onMouseDown(
    //       event,
    //       isMouseDownRef,
    //       animationActionRef,
    //       rendererRef,
    //       lastMousePosition,
    //       allObjectsRef,
    //       hasMovedObjectRef
    //     );

    const animate = () => {
      let currentIntersected = null;
      // checkHover(
      //   mouse,
      //   currentIntersected,
      //   allObjectsRef,
      //   cameraRef,
      //   clickedObjectRef
      // );
      requestAnimationFrame(animate);
      if (mixerRef.current) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }
      if (rendererRef.current)
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    //   let currentIntersected = null;

    //   window.addEventListener("click", handleClick);
    //   window.addEventListener("pointermove", handlePointerMove);
    //   window.addEventListener("mousedown", handleMouseDown);
    //   window.addEventListener("mouseup", handleMouseUp);
    //   window.addEventListener("mousemove", handleMouseDown);

    animate();
    //   return () => {
    //     if (mountRef.current && rendererRef.current) {
    //     }
    //     window.addEventListener("pointermove", onPointerMove);
    //     window.addEventListener("mousedown", onMouseDown);
    //     window.addEventListener("mouseup", onMouseUp);
    //     window.addEventListener("mousemove", onMouseMove);
    //   };
  }, []);

  // useEffect(() => {
  //   loadExercises();
  // }, [selectedObject]);

  return (
    <div ref={mountRef} className="w-full h-full z-10">
      <div className="absolute inset-0 -left-30 -right-5 -bottom-15 -top-10 rotate-3 bg-[url(./assets/bg-brush.png)] bg-center bg-[length:104%_105%] z-[-10] " />
      {/* {bodyPartInfo && (
        <BodyPartInfo
          staticInfo={bodyPartInfo}
          exercises={exercises}
          isLoading={isLoading}
          error={error}
        />
      )} */}
    </div>
  );
};

export default GLTFViewer;
