import * as THREE from "three";

export class Utils {
  static centerObject(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    object.position.x = -center.x;
    object.position.y = -center.y;
    object.position.z = 0;
  }
}
export default Utils;
