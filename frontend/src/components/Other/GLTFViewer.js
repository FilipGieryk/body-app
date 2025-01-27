import React, { use, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ObjectLoader } from "../../libs/ObjectLoader.js"; // Ensure the correct path
import { Utils } from "../../libs/Utils.js"; // Ensure the correct path
import { MouseControls } from "../../libs/MouseControls.js"; // Ensure the correct path

// const ObjectInfo = ({ object }) => {
//   if (!object) return null;
//   return (
//     <div id="object-info" style={{ position: "absolute", display: "block" }}>
//       <strong>Muscle Part</strong>: {object.name}
//       <br />
//       <br />
//       {object.userData.bestExercises.map((el) => (
//         <div key={el.name}>
//           <strong>{el.name}</strong>
//           <br />
//           <img
//             src={el.image}
//             alt={el.name}
//             style={{ maxWidth: "100%", height: "auto" }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

const GLTFViewer = () => {
  const mountRef = useRef(null);
  const clickedObjectRef = useRef();
  const mouse = new THREE.Vector2();
  const allObjectsRef = useRef([]); // Persistent reference for objects
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  let clickedOjbect = null;
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

    // Handle window resize
    window.addEventListener("resize", () => {
      // Update camera aspect ratio
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix(); // Recalculate projection matrix

      // Update renderer size
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
      ObjectLoader.loadModel("models/bodyy123.gltf", scene, (object) => {
        scene.add(object);
        allObjectsRef.current.push(object); // Add to persistent ref
        Utils.centerObject(object);
        new MouseControls(camera, object);
      });
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

    function onClick(event) {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(
        allObjectsRef.current,
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

          // Update the clicked object state
          clickedObjectRef.current = clickedObject;
        }
      }
    }

    function checkHover() {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
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
          if (newIntersected.name !== "Mesh1__0") {
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
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };

    animate();
  }, []); // Empty dependency array to prevent re-runs

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default GLTFViewer;
