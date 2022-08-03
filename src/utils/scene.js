import * as THREE from 'three'

//return the scene
export function setUpScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  return scene
}
