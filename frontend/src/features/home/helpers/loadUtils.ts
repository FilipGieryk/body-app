import { Scene, Object3D, Group, Object3DEventMap, AnimationClip } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// export const loadModel = (
//   path: string,
//   scene: Scene,
//   onLoadedCallback: (
//     object: Group<Object3DEventMap>,
//     animations: AnimationClip[]
//   ) => void
// ) => {
//   const loader = new GLTFLoader();

//   loader.load(
//     path,
//     (gltf) => {
//       const object = gltf.scene;
//       const animations = gltf.animations;
//       scene.add(object);

//       object.traverse((node: any) => {
//         if (node.isMesh && node.userData?.gltfExtras) {
//           const customData = node.userData.gltfExtras;
//           console.log(`Node: ${node.name}, Custom Data:`, customData);
//           node.customData = customData;
//         }
//       });

//       onLoadedCallback(object, animations);
//     },
//     (xhr) => {
//       console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
//     },
//     (error) => {
//       console.error("An error occurred while loading the model:", error);
//     }
//   );
// };

export const loadModel = (path: string): Promise<LoadedModel> => {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        const object = gltf.scene;
        const animations = gltf.animations;

        // Optional: process custom userData
        object.traverse((node: any) => {
          if (node.isMesh && node.userData?.gltfExtras) {
            node.customData = node.userData.gltfExtras;
          }
        });

        resolve({ object, animations });
      },
      undefined, // onProgress can be added if needed
      (error) => {
        reject(error);
      }
    );
  });
};
