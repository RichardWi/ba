import * as THREE from 'three'
import * as light from './sceneContent/light'
import model from './/sceneContent/model'
import * as boxHelper from './sceneContent/boxModel'
import textures from './/sceneContent/textures'
import colorMaps from './/sceneContent/colorMaps'
import * as dracoLoader from './loaders/dracoLoader.js'
import * as textureLoader from './loaders/textureLoader.js'
import * as imageLoader from './loaders/imageLoader.js'
import * as gltfLoader from './loaders/gltfLoader.js'

export async function loadInitialContent(scene, fetchModels) {
  let content, rampMaps, textureArray, imageArray

  let ambientLight = light.setUpLight()

  scene.add(ambientLight)

  await loadRampMaps(colorMaps).then((colorMaps) => {
    rampMaps = colorMaps
    console.log(rampMaps)
  })

  if (fetchModels === true) {
    //Load the Model
    await loadModel(model).then((model) => {
      scene.add(model)
      console.log(model.children[0])

      //add Box Helper
      let bbox = new THREE.BoxHelper(model, 0xffff00)
      scene.add(bbox)

      console.log(model)
    })

    //Load the Textures
    await loadTextures(textures).then((textures) => {
      console.log(textures)
      textureArray = textures
    })

    await loadImages(textures).then((images) => {
      console.log(images)
      imageArray = images
    })

    content = { scene, textureArray, imageArray, rampMaps }
  } else {
    content = { scene, rampMaps }
  }
  return content
}

async function loadRampMaps(colorMaps) {
  console.log(colorMaps)
  let NDVIMap = await textureLoader.textureLoader(colorMaps.NDVI)
  let HeatMap = await textureLoader.textureLoader(colorMaps.HEAT)

  return { NDVIMap, HeatMap }
}

async function loadModel(modelData, scene) {
  console.log(modelData)

  switch (modelData[0].format) {
    case 'draco':
      const modelTest = await dracoLoader.dracoLoader(modelData[0].source, scene).then((modelTest) => {
        return modelTest
      })
      return modelTest
    case 'gltf':
      //  model = gltfLoader.load(modelUrl)
      return 'model2'
  }
}

async function loadTextures(texturesData) {
  let exit = false
  let textureArray = []
  for (let i = 0; i < texturesData[0].try; i++) {
    let url = texturesData[0].source + '/obj' + i + texturesData[0].format
    let name = 'Textur ' + i

    let texture = await textureLoader.textureLoader(url).catch((end) => {
      exit = true
    })
    if (!exit) {
      let textureObj = { name, texture }
      textureArray.push(textureObj)

      console.log(textureArray)
    } else {
      return textureArray
    }
  }
}

async function loadImages(texturesData) {
  let exit = false
  let imageArray = []
  for (let i = 0; i < texturesData[0].try; i++) {
    let url = texturesData[0].source + '/obj' + i + texturesData[0].format
    let name = 'Bild ' + i

    let image = await imageLoader.imageLoader(url).catch((end) => {
      exit = true
    })
    if (!exit) {
      let imageObj = { name, image }
      imageArray.push(imageObj)

      console.log(imageArray)
    } else {
      return imageArray
    }
  }
}
