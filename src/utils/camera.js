import * as THREE from 'three'

export function setUpCamera(perspective) {
  if (perspective === 'perspective') {
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    return camera
  }
  if (perspective === 'orthographic') {
    var camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      1,
      1000
    )
    return camera
  }
}
