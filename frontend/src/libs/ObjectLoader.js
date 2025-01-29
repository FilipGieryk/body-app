import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // Adjusted import for GLTFLoader

export class ObjectLoader {
  static loadModel(path, scene, onLoadedCallback) {
    const loader = new GLTFLoader();

    // Load the GLTF model
    loader.load(
      path,
      function (gltf) {
        const object = gltf.scene;
        const animations = gltf.animations;
        scene.add(object);
        // Traverse through the loaded object to handle meshes and custom data
        object.traverse((node) => {
          if (node.isMesh && node.userData && node.userData.gltfExtras) {
            // Log or attach custom properties from extras
            const customData = node.userData.gltfExtras;
            console.log(`Node: ${node.name}, Custom Data:`, customData);

            // Attach the custom data directly to the node for later use
            node.customData = customData;
          }
        });

        // mixerRef.current = new THREE.AnimationMixer(gltf.scene);
        // gltf.animations.forEach((clip) => {
        //   mixerRef.current.clipAction(clip).play(); // Play the animation
        // });
        // Invoke the callback with the loaded object
        if (onLoadedCallback) onLoadedCallback(object, animations);
      },
      function (xhr) {
        // Log loading progress
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        // Log any errors
        console.error("An error occurred while loading the model:", error);
      }
    );
  }
}

export default ObjectLoader;
