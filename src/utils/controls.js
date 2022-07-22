import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as THREE from 'three'

export function setUpControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.minDistance = 0
  controls.maxDistance = 1000
  return controls
}
