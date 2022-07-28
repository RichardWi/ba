import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export function setUpControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 0
  controls.maxDistance = 1000
  return controls
}

export function setControlsTarget(controls, target) {
  controls.target.set(target.x, target.y, target.z)
  return controls
}
