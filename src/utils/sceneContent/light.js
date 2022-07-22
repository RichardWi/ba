import * as THREE from 'three'

export function setUpLight() {
  const light = new THREE.AmbientLight(0xffffff, 20.0)

  return light
}
