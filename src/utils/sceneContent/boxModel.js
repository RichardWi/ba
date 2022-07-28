import * as THREE from 'three'

export function setUpBoxHelper(model) {
  let bbox = new THREE.BoxHelper(model, 0xffff00)
  return bbox
}
