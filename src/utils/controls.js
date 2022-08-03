import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//returns controls
export function setUpControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 0
  controls.maxDistance = 1000
  return controls
}

//returns controls
//used to update the controls Target which equals to the center which "user interaction makes it rotate around"
export function setControlsTarget(controls, target) {
  controls.target.set(target.x, target.y, target.z)
  return controls
}
