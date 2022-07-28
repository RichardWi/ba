import * as THREE from 'three'

export function getCameraPosition(scene) {
  //--*Set CameraPosition relative to the visible model*--//
  //Center of the bounding Sphere corresponds to center of the visible Model
  //Schlag.children[1] is the HelperBox Mesh
  console.log(scene)
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
