import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

export async function gltfLoader(modelUrl) {
  console.log('gltf', modelUrl)
  //Setup GLTF Loader
  const loader = new GLTFLoader()
  var model = new THREE.Object3D()

  var model = await loader.loadAsync(
    modelUrl, //path to file

    undefined,
    function (error) {
      console.error(error)
    }
  )
  return model.scene
}
