import * as THREE from 'three'

export function setCameraPosition(scene, canvas) {
  let Schlag = scene.children[1].children[0]
  console.log(Schlag.children[0].geometry.boundingBox.min.x)
  var testPos1 = [
    Schlag.children[0].geometry.boundingBox.min.x,
    Schlag.children[0].geometry.boundingBox.min.y,
    Schlag.children[0].geometry.boundingBox.min.z,
  ]

  var testPos2 = [
    Schlag.children[0].geometry.boundingBox.max.x,
    Schlag.children[0].geometry.boundingBox.max.y,
    Schlag.children[0].geometry.boundingBox.max.z,
  ]

  var testCamTarget = [
    (testPos1[0] + testPos2[0]) / 2,
    (testPos1[1] + testPos2[1]) / 2,
    (testPos1[2] + testPos2[2]) / 2,
  ]

  var xWidth = Math.abs(testPos2[0] - testPos1[0])
  var yWidth = Math.abs(testPos2[1] - testPos1[1])
  var height = xWidth
  var verh = xWidth / yWidth
  //--*Set CameraPosition relative to the visible model*--//
  //Center of the bounding Sphere corresponds to center of the visible Model
  //Schlag.children[1] is the HelperBox Mesh
  console.log(Schlag)
  var CameraTargetVector = new THREE.Vector3(
    Schlag.children[1].geometry.boundingSphere.center.x,
    Schlag.children[1].geometry.boundingSphere.center.y,
    Schlag.children[1].geometry.boundingSphere.center.z + height / 3
  )

  //CameraPositionHelperVector is a Point on one Edge of the HelperBox
  /*var CameraPositionHelperVector = new THREE.Vector3(
    (Schlag.children[1].geometry.attributes.position.array[6] +
      Schlag.children[1].geometry.attributes.position.array[9]) /
      2,
    (Schlag.children[1].geometry.attributes.position.array[7] +
      Schlag.children[1].geometry.attributes.position.array[10]) /
      2,
    (Schlag.children[1].geometry.attributes.position.array[8] +
      Schlag.children[1].geometry.attributes.position.array[11]) /
      2
  )*/
  var CameraPositionHelperVector = new THREE.Vector3(CameraTargetVector.x, CameraTargetVector.y, CameraTargetVector.z)
  //CameraPositionVector Calculates the CameraPostion
  //CameraPositionVector is the CameraTargetVector + 2x the connection vector between CameraTargetVector and CameraPositinHelperVector
  var CameraPositionVector = new THREE.Vector3(
    CameraTargetVector.x + 2 * (CameraPositionHelperVector.x - CameraTargetVector.x),
    CameraTargetVector.y + 2 * (CameraPositionHelperVector.y - CameraTargetVector.y),
    CameraTargetVector.z + 2 * (CameraPositionHelperVector.z - CameraTargetVector.z)
  )

  var cameraTEST = new THREE.PerspectiveCamera(60, verh, 0.01, 1000)
  cameraTEST.position.set(testCamTarget[0], testCamTarget[1], testCamTarget[2] + height / 2)

  var retA = [cameraTEST]

  return retA
}
