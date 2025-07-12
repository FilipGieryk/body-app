import * as THREE from "three";

export const centerObject = (
  object: THREE.Object3D<THREE.Object3DEventMap>
) => {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.x = -center.x;
  object.position.y = -center.y;
  object.position.z = 0;
};
