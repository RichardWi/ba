import scene from './script.js'

return () => {
  //--*Set CameraPosition relative to the visible model*--//
  //Center of the bounding Sphere corresponds to center of the visible Model
  //Schlag.children[1] is the HelperBox Mesh
  Schlag = scene.children[2]

  var CameraTargetVector = new THREE.Vector3(
    Schlag.children[1].geometry.boundingSphere.center.x,
    Schlag.children[1].geometry.boundingSphere.center.y,
    Schlag.children[1].geometry.boundingSphere.center.z
  )

  //CameraPositionHelperVector is a Point on one Edge of the HelperBox
  var CameraPositionHelperVector = new THREE.Vector3(
    (Schlag.children[1].geometry.attributes.position.array[6] +
      Schlag.children[1].geometry.attributes.position.array[9]) /
      2,
    (Schlag.children[1].geometry.attributes.position.array[7] +
      Schlag.children[1].geometry.attributes.position.array[10]) /
      2,
    (Schlag.children[1].geometry.attributes.position.array[8] +
      Schlag.children[1].geometry.attributes.position.array[11]) /
      2
  )
  //CameraPositionVector Calculates the CameraPostion
  //CameraPositionVector is the CameraTargetVector + 2x the connection vector between CameraTargetVector and CameraPositinHelperVector
  var CameraPositionVector = new THREE.Vector3(
    CameraTargetVector.x + 2 * (CameraPositionHelperVector.x - CameraTargetVector.x),
    CameraTargetVector.y + 2 * (CameraPositionHelperVector.y - CameraTargetVector.y),
    CameraTargetVector.z + 2 * (CameraPositionHelperVector.z - CameraTargetVector.z)
  )
  //Cameraposition equals CameraPositionVector
  camera.position.set(CameraPositionVector.x, CameraPositionVector.y, CameraPositionVector.z)
}
