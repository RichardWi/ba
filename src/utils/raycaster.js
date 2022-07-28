import * as THREE from 'three'

export function getRaycaster(camera, mouseP) {
  let mouse = new THREE.Vector2(mouseP.x, mouseP.y)
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  return raycaster
}
