import { Scene, Object3D, Group, Object3DEventMap, AnimationClip } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"; // Adjusted import for GLTFLoader

export class ObjectLoader {
  static loadModel(
    path: string,
    scene: Scene,
    onLoadedCallback: {
      (object: Object3D, animations: any[]): void;
      (arg0: Group<Object3DEventMap>, arg1: AnimationClip[]): void;
    }
  ) {
    const loader = new GLTFLoader();

    // Load the GLTF model
    loader.load(
      path,
      function (gltf) {
        const object = gltf.scene;
        const animations = gltf.animations;
        scene.add(object);

        object.traverse((node) => {
          if (node.isMesh && node.userData && node.userData.gltfExtras) {
            const customData = node.userData.gltfExtras;
            console.log(`Node: ${node.name}, Custom Data:`, customData);

            node.customData = customData;
          }
        });
        if (onLoadedCallback) onLoadedCallback(object, animations);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.error("An error occurred while loading the model:", error);
      }
    );
  }
}

export default ObjectLoader;
