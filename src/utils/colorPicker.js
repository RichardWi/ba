import * as THREE from 'three'
import * as raycasterUtil from './raycaster'

let firstPos
let secondPos

export function getColor(isPickColor, camera, scene, mouseP) {
  if (isPickColor) {
    let raycaster = raycasterUtil.getRaycaster(camera, { x: 0, y: 0 })
  }
  //get first pos
  //get second pos
  //get image
  //get color on image pos
}

export function getIntersect(e, camera, scene) {
  let mouseP = { x: 0, y: 0 }
  let pointIntersect
  mouseP.x = (e.clientX / window.innerWidth) * 2 - 1
  mouseP.y = -(e.clientY / window.innerHeight) * 2 + 1
  let raycaster = raycasterUtil.getRaycaster(camera, mouseP)
  let objectsToIntersect = [scene.children[1].children[0]]
  let intersects = raycaster.intersectObjects(objectsToIntersect)
  for (let intersect of intersects) {
    pointIntersect = intersect.point
    console.log(intersect.point)
  }
  return pointIntersect
}
