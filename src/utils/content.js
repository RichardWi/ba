import * as THREE from 'three'
import * as light from './sceneContent/light'
import model from './/sceneContent/model'
import * as textures from './/sceneContent/textures'

const modelUrl = '../static/models/Schlag.glb'
const modelCompression = 'draco'

const texturesUrl = '../static/models/textures/ndvi'
const texturesFormat = '.jpg'

export function loadContent(scene, fetchModels) {
  let ambientLight = light.setUpLight()

  if (fetchModels === true) {
    loadModel(model)
    //loadTextures(textures)
    //createMaterials()
    //createMesh()
    //addMesh()
  }
  scene.add(ambientLight)
  return scene
}

function loadModel(model) {
  console.log(model)
}
