import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as THREE from 'three'

export async function dracoLoader(modelUrl) {
  console.log('dracoLoader', modelUrl)
  //Setup dracoLoader to load compressed gltf/glb files

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  dracoLoader.setDecoderConfig({ type: 'js' })

  //Setup GLTF Loader
  const loader = new GLTFLoader()
  //Add dracoLoader to GLTF Loader
  loader.setDRACOLoader(dracoLoader)

  //Alert load models from server or upload your own

  var model = new THREE.Object3D()

  var dracoModel = await loader.loadAsync(
    modelUrl, //path to file

    undefined,
    function (error) {
      console.error(error)
    }
  )
  return dracoModel.scene
}
