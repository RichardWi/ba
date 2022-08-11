//Imports
import './style.css'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fragmentShader from './shaders/ModelShader/fragmentShader.glsl'
import vertexShader from './shaders/ModelShader/vertexShader.glsl'
import * as rendererUtil from './utils/renderer.js'
import * as sceneUtil from './utils/scene.js'
import * as cameraUtil from './utils/camera.js'
import * as controlsUtil from './utils/controls.js'
import * as content from './utils/content.js'
import * as shaderUtil from './utils/shader.js'
import * as getColor from './utils/colorPicker'
import * as calc from './utils/calculateColorArrays.js'

//variables
var orbitcontrols,
  fetchModels,
  textureArray = [],
  materialArray = [],
  ndviMap,
  HeatMap,
  imageArray,
  BufferAttributeColorArray

var Schlag = new THREE.Object3D()
var PerfomanceTime0
var PerfomanceTime1
//add Stats to the page
// 0: fps, 1: ms, 2: mb
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

//add gui to the page
var gui = new dat.GUI()
var params = {
  showNDVI: false,
  showHeat: false,
  pickColor: false,
  showChange: false,
  textureArray: 0,
}

if (window.confirm('Modell und Texturen vom Server laden?')) {
  fetchModels = true
}
PerfomanceTime0 = performance.now()
//Setup Three JS

//Setup Canvas
const canvas = document.querySelector('.webgl')
//Setup Renderer
var renderer = rendererUtil.setUpRenderer(canvas)
//Setup Scene
var scene = sceneUtil.setUpScene()
//Setup Camera
var camera = cameraUtil.setUpCamera('perspective')

//Setup OrbitControls
var controls = controlsUtil.setUpControls(camera, canvas)
orbitcontrols = true

//Setup Content
/*
callback has four parameters
1. scene with the model, a boxhelper (if fetchmodel is true) and ambient light
2. textureArray with the textures (if fetchmodel is true) else it is undefined
3. imageArray with the images of which the textures where created (if fetchmodel is true) else it is undefined
4. HeatMap and NDVI Map
*/
content.loadInitialContent(scene, fetchModels).then((callback) => {
  scene = callback.scene
  HeatMap = callback.rampMaps.HeatMap
  ndviMap = callback.rampMaps.NDVIMap

  if (callback.textureArray != undefined) {
    textureArray = callback.textureArray
  }
  if (callback.imageArray != undefined) {
    imageArray = callback.imageArray
  }
  callColorCalculator()
})

//calculate the Color Arrays
function callColorCalculator() {
  //Set Controls to the center of the Model,
  //is run here because callColorCalculator has to be run after every model change, so does the controls target update
  controls = controlsUtil.setControlsTarget(controls, scene.children[1].children[0].geometry.boundingSphere.center)
  controls.update()
  //Set Camera view to the center of the Model,
  //is run here because callColorCalculator has to be run after every model change, so does the camera viewing angle and position update
  camera.position.copy(cameraUtil.getCameraPosition(scene))

  //calculate the Color Arrays from the image Array
  calc.calcColorArrays(scene, imageArray).then(function (colorArray) {
    BufferAttributeColorArray = []
    //Create BufferAttribute from the Color Arrays
    for (let i = 0; i < colorArray.length; i++) {
      let Uint8ArrayColor = new Uint8Array(colorArray[i])
      let calculatedColor = new THREE.BufferAttribute(Uint8ArrayColor, 1)
      BufferAttributeColorArray.push(calculatedColor)
    }

    //new BufferAttribute with the calculated Color
    //currentColor is the color of the current displayed texture
    //pastColor is the color of the previous texture in the array
    let currentColor = { currentColor: BufferAttributeColorArray[0] }
    let pastColor = { pastColor: BufferAttributeColorArray[0] }

    //add the BufferAttribute to the model so it can be used in the shader
    Object.assign(scene.children[1].children[0].geometry.attributes, currentColor)
    Object.assign(scene.children[1].children[0].geometry.attributes, pastColor)

    //call the shaderUtilFunction to create the shaders used for texturing the model
    shaderUtilFunction()
  })
}

function shaderUtilFunction() {
  //create the shaders
  //returns an array of materials, one material calculated from each texture
  shaderUtil
    .createShaderMaterials(scene.children[1], textureArray, HeatMap, ndviMap, vertexShader, fragmentShader)
    .then((returnedArray) => {
      //add the shader materials to the materialArray
      materialArray = returnedArray
      //add the first material to the model and change the display name to the name of the texture
      scene = shaderUtil.addShader(scene, materialArray, textureArray)

      //add the user interaction panel to the page
      addGui()
    })
}

function addGui() {
  //gui is rebuild after every model and texture change to avoid bugs, so it is destroyed first in case it already exists
  gui.destroy()

  gui = new dat.GUI()
  //adds Checkbox to toggle the display of the NDVI Color Map
  gui
    .add(params, 'showNDVI')
    .name('NDVI Farbskala')
    .onChange(function (value) {
      materialArray[params.textureArray].uniforms.uNdviColorPalette.value = value
    })
  //adds Checkbox to toggle the display of the Heat Color Map
  gui
    .add(params, 'showHeat')
    .name('Thermal Farbskala')
    .onChange(function (value) {
      materialArray[params.textureArray].uniforms.uHeatColorPalette.value = value
    })
  //adds Checkbox to toggle the display of the change of Color from the previous texture/material/data point
  gui
    .add(params, 'showChange')
    .name('Änderung zum vorherigen Datenpunkt')
    .onChange(function (value) {
      materialArray[params.textureArray].uniforms.uChange.value = value
    })
  //adds checkbox to start the color picker
  gui
    .add(params, 'pickColor')
    .name('Farbwertrechner')
    .onChange(function () {})
  //adds a slider to change the texture
  gui
    .add(params, 'textureArray', 0, materialArray.length - 1, 1)
    .name('Datenpunkt ändern')
    .onChange(function () {
      scene.children[1].children[0].material = materialArray[params.textureArray]
      materialArray[params.textureArray].uniforms.uNdviColorPalette.value = params.showNDVI
      materialArray[params.textureArray].uniforms.uHeatColorPalette.value = params.showHeat
      materialArray[params.textureArray].uniforms.uChange.value = params.showChange
      document.getElementById('DataPoint').innerHTML = textureArray[params.textureArray].name
      let currentColor = { currentColor: BufferAttributeColorArray[params.textureArray] }
      let pastColor = { pastColor: BufferAttributeColorArray[params.textureArray - 1] }
      if (params.textureArray === 0) {
        pastColor = { pastColor: BufferAttributeColorArray[0] }
      } else {
        pastColor = pastColor
      }
      Object.assign(scene.children[1].children[0].geometry.attributes, currentColor)
      Object.assign(scene.children[1].children[0].geometry.attributes, pastColor)
    })

  PerfomanceTime1 = performance.now()
  console.log('Performance: ' + (PerfomanceTime1 - PerfomanceTime0) + ' ms')
}

//Add File Input for Textures, takes multiple files
const inputTextures = document.getElementById('textureInput')
if (scene.children[2] === undefined) {
  inputTextures.disabled = true
}
inputTextures.addEventListener(
  'change',
  async function (e) {
    let files = Array.from(e.target.files).map((file) => {
      let reader = new FileReader()
      console.log(e.target.files)
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    })
    // promise waits for all textures to be loaded
    //then creates a texture array and an image array
    //image array for color array, texture array for materials
    let res = await Promise.all(files)
    textureArray = []
    imageArray = []
    console.log(res)
    for (let i = 0; i < res.length; i++) {
      //texture array
      let texture = new THREE.TextureLoader().load(res[i])
      texture.flipY = false
      let name = 'Name: ' + e.target.files[i].name + ' Datum: ' + e.target.files[i].lastModifiedDate
      textureArray.push({ name, texture })
      //image array
      let image = new Image()
      image.src = res[i]
      name = 'Name: ' + e.target.files[i].name + ' Datum: ' + e.target.files[i].lastModifiedDate
      imageArray.push({ name, image })
    }

    //calculate the color, create material and update gui
    callColorCalculator()
  },
  false
)

//Add File Input for Model
const inputModel = document.getElementById('modelInput')
inputModel.addEventListener(
  'change',
  function (e) {
    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    let gltfloader = new GLTFLoader()

    gltfloader.load(url, (gltf) => {
      //delete an old model which might be there from a previous load and its box helper
      scene.remove(scene.children[2])
      scene.remove(scene.children[1])

      //add the box helper
      let bbox = new THREE.BoxHelper(gltf.scene.children[0], 0xffff00)

      scene.add(gltf.scene.clone())
      scene.add(bbox)
      //new model
      console.log(gltf.scene)
      inputTextures.disabled = false
      //is run so u can see the model in the right view even before uploading the textures
      camera.position.copy(cameraUtil.getCameraPosition(scene))
      controls = controlsUtil.setControlsTarget(controls, scene.children[1].children[0].geometry.boundingSphere.center)
      controls.update()
    })
  },
  false
)

// FIRST ITERATION OF A FUNCTION TO CALCULATE THE COLOR OF 2 POINTS CHOSEN BY THE USER
// NOT FINISHED
const raycaster = new THREE.Raycaster()
const mouseP = new THREE.Vector2()
var firstclick = true
var secondclick = false
var is1 //first click position
var is2 //second click position
var pointIntersect
var timeout
var pointofint2
var pointofint1
var uvIntersect = new THREE.Vector2()
//window.addEventListener('mouseup', (e) => {})

window.addEventListener('mouseup', (e) => {
  if (params.pickColor === false) {
    firstclick = true
    secondclick = false
    is1 = null
    is2 = null
    pointofint1 = null
    pointofint2 = null
    scene.remove(
      scene.children[3],
      scene.children[4],
      scene.children[5],
      scene.children[6],
      scene.children[7],
      scene.children[8],
      scene.children[9],
      scene.children[10],
      scene.children[11]
    )
  }
  if (params.pickColor) {
    if (firstclick) {
      pointofint1 = getColor.getIntersect(e, camera, scene)
    }
    if (secondclick) {
      pointofint2 = getColor.getIntersect(e, camera, scene)
    }
    console.log('mouseup', pointofint1, pointofint2)
    mouseP.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseP.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouseP, camera)
    let objectsToIntersect = [scene.children[1].children[0]]
    let intersects = raycaster.intersectObjects(objectsToIntersect)

    for (let intersect of intersects) {
      uvIntersect = intersect.uv
      pointIntersect = intersect.point
      console.log(intersect.point)
    }

    if (firstclick) {
      is1 = pointIntersect
      firstclick = false
      //console.log(is1)
      if (confirm('Zweiten Click auf den Bildschirm um den NDVI-Index in einem Teilbereich zu bestimmen')) {
        console.log('ok')
        timeout = setTimeout(function () {
          secondclick = true
        }, 1000)
      } else {
        params.pickColor = false
        console.log('cancel')
        firstclick = false
        secondclick = false
      }
    }
    if (secondclick) {
      is2 = pointIntersect
      secondclick = false
      if (
        confirm(
          'Die Ausgewählten Punkte bestätigen:' + 'x1: ' + is1.x + ' y1: ' + is1.y + ' x2: ' + is2.x + ' y2: ' + is2.y
        )
      ) {
        console.log('ok')
        timeout = setTimeout(function () {
          console.log(is1, is2)
          let count = 0
          let calo = []
          while (count < scene.children[1].children[0].geometry.attributes.currentColor.count * 3) {
            if (
              (scene.children[1].children[0].geometry.attributes.position.array[count] =
                Math.min(is1.x, is2.x) &&
                scene.children[1].children[0].geometry.attributes.position.array[count] < Math.max(is1.x, is2.x) &&
                scene.children[1].children[0].geometry.attributes.position.array[count + 1] > Math.min(is1.y, is2.y) &&
                scene.children[1].children[0].geometry.attributes.position.array[count + 1] < Math.max(is1.y, is2.y))
            ) {
              calo.push(scene.children[1].children[0].geometry.attributes.currentColor.array[count / 3])
            }
            count += 3
          }

          let average = calo.reduce((a, b) => a + b, 0) / calo.length
          console.log(calo)
          console.log(average)

          let colors = scene.children[1].children[0].geometry

          scene.background = new THREE.Color(average / 255.0, average / 255.0, average / 255.0)
          plane.material.color = new THREE.Color(average / 255.0, average / 255.0, average / 255.0)

          console.log(plane)
          params.pickColor = false
          console.log('done')
          firstclick = false
          secondclick = false
        }, 1000)
      } else {
        params.pickColor = false
        console.log('cancel')
        firstclick = true
        secondclick = false
      }
      //console.log(is1)
    }

    //var col = imgColor.getAverageRGB(imgEL, is1, is2, radius)

    //scene.background = new THREE.Color(col.r / 255.0, col.g / 255.0, col.b / 255.0)

    const geometryZ = new THREE.CylinderGeometry(2, 2, 20, 8)
    const materialZ = new THREE.MeshBasicMaterial({ color: 0xffff00 })
    const cylinder = new THREE.Mesh(geometryZ, materialZ)
    const cylinder2 = new THREE.Mesh(geometryZ, materialZ)
    cylinder.rotation.x = Math.PI / 2
    cylinder2.rotation.x = Math.PI / 2
    scene.add(cylinder)
    scene.add(cylinder2)
    console.log(is1)
    cylinder.position.set(
      scene.children[2].geometry.attributes.position.array[3],
      scene.children[2].geometry.attributes.position.array[4],
      scene.children[2].geometry.attributes.position.array[5]
    )
    cylinder2.position.set(
      scene.children[2].geometry.attributes.position.array[9],
      scene.children[2].geometry.attributes.position.array[10],
      scene.children[2].geometry.attributes.position.array[11]
    )
    //console.log('pos', sphere.position, sphere1.position)
    var xw = cylinder2.position.x - cylinder.position.x
    var yw = cylinder.position.y - cylinder2.position.y

    var xTeil1 = cylinder2.position.x - is1.x
    var yTeil1 = cylinder.position.y - is1.y
    //console.log(xw, yw)
    //console.log(xTeil1, yTeil1)
    var AnteilX1 = 1 - xTeil1 / xw
    var AnteilY1 = 1 - yTeil1 / yw
    console.log(AnteilX1, AnteilY1)

    var xTeil2 = cylinder2.position.x - is2.x
    var yTeil2 = cylinder.position.y - is2.y
    //console.log(xTeil2, yTeil2)
    var AnteilX2 = 1 - xTeil2 / xw
    var AnteilY2 = 1 - yTeil2 / yw
    console.log(AnteilX2, AnteilY2)
    cylinder2.position.set(is1.x, is1.y, is1.z)
    cylinder.position.set(is2.x, is2.y, is2.z)
    const cylinder3 = cylinder.clone()
    cylinder3.position.set(is1.x, is2.y, is2.z)
    const cylinder4 = cylinder.clone()
    cylinder4.position.set(is2.x, is1.y, is1.z)
    scene.add(cylinder3, cylinder4)
    const pgeometry = new THREE.PlaneGeometry(Math.abs(is1.x - is2.x), Math.abs(is1.y - is2.y))
    const pmaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
    var plane = new THREE.Mesh(pgeometry, pmaterial)
    scene.add(plane)
    plane.position.set(Math.abs(is1.x + is2.x) / 2, Math.abs(is1.y + is2.y) / 2, Math.abs(is1.z + is2.z) / 2 + 3)
    window.removeEventListener('mouseup', e)
  }
})

// runtime Function getting called each frame
const runtime = () => {
  //start measuring stats
  stats.begin()

  //updates the controls so user can interact with the scene
  if (orbitcontrols) {
    controls.update()
  }

  // Call runtime again on the next frame
  renderer.setAnimationLoop(function () {
    runtime()
    //pass scene and camera to the renderer and render the scene for this frame
    renderer.render(scene, camera)
  })

  //end measuring stats
  stats.end()
}

runtime()
