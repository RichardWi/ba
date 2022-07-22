import * as THREE from 'three'

export function setUpScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)
  return scene
}
