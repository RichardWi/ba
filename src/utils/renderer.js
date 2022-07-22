import * as THREE from 'three'

export function setUpRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xffffff)
  renderer.setPixelRatio(Math.min(/*window.devicePixelRatio,*/ 2))
  return renderer
}
