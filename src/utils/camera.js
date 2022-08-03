import * as THREE from 'three'

//return the camera
export function setUpCamera(perspective) {
  if (perspective === 'perspective') {
    //Parameters: fov, aspect, near, far
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

//return the camera
//used to update the camera position, so it is always looking at the center of the model
export function getCameraPosition(scene) {
  //--*Set CameraPosition relative to the visible model*--//
  //Center of the bounding Sphere corresponds to center of the visible Model
  //helperbox has the same dimensions as the visible model the bbox (the yellow box)

  let model = scene.children[1].children[0]
  let helperbox = new THREE.BoxHelper(model, 0xffff00)
  var CameraTargetVector = new THREE.Vector3(
    model.geometry.boundingSphere.center.x,
    model.geometry.boundingSphere.center.y,
    model.geometry.boundingSphere.center.z
  )

  //CameraPositionHelperVector is a Point on one Edge of the HelperBox
  var CameraPositionHelperVector = new THREE.Vector3(
    (helperbox.geometry.attributes.position.array[6] + helperbox.geometry.attributes.position.array[9]) / 2,
    (helperbox.geometry.attributes.position.array[7] + helperbox.geometry.attributes.position.array[10]) / 2,
    (helperbox.geometry.attributes.position.array[8] + helperbox.geometry.attributes.position.array[11]) / 2
  )
  //CameraPositionVector Calculates the CameraPostion
  //CameraPositionVector is the CameraTargetVector + 2x the connection vector between CameraTargetVector and CameraPositinHelperVector
  var CameraPositionVector = new THREE.Vector3(
    CameraTargetVector.x + 2 * (CameraPositionHelperVector.x - CameraTargetVector.x),
    CameraTargetVector.y + 2 * (CameraPositionHelperVector.y - CameraTargetVector.y),
    CameraTargetVector.z + 2 * (CameraPositionHelperVector.z - CameraTargetVector.z)
  )

  return CameraPositionVector
}
