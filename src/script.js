//Imports
import './style.css'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fragmentShader from './shaders/ModelShader/fragmentShader.glsl'
import vertexShader from './shaders/ModelShader/vertexShader.glsl'
import { VRButton } from './vr/VRButton/VRButton.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import * as cameraPosition from './components/cameraPosition.js'
import * as colorCalculator from './components/colorCalculator.js'
import * as imgColor from './components/imgColorCalculator.js'
import * as textureLoaderHelper from './components/textureLoaderHelper.js'
import * as rendererUtil from './utils/renderer.js'
import * as sceneUtil from './utils/scene.js'
import * as cameraUtil from './utils/camera.js'
import * as controlsUtil from './utils/controls.js'
import * as content from './utils/content.js'
import * as cameraPositionSnapshot from './components/cameraPositionSnapshot.js'

//variables
var orbitcontrols,
  fetchModels,
  textureArray = [],
  materialArray = [],
  ndviMap,
  HeatMap

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
  textureArray: 0,
  clearLocalStorage: false,
}

if (window.confirm('Modell und Texturen vom Server laden?')) {
  fetchModels = true
}

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
scene = content.loadContent(scene, fetchModels)

//Setup Loaders
//TextureLoader
const textureLoader = new THREE.TextureLoader()

//Array to hold all Textures

//Array to hold all Materials created with Textures

//Setup dracoLoader to load compressed gltf/glb files
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })

//*Load Model and Add to Scene*//
//Setup GLTF Loader
const loader = new GLTFLoader()
//Add dracoLoader to GLTF Loader
loader.setDRACOLoader(dracoLoader)

//Alert load models from server or upload your own

var Schlag = new THREE.Object3D()
function loadModelsFromServer() {
  loader.load(
    '/models/schlag/DracoCompressed.glb', //path to file
    function (gltf) {
      Schlag = gltf.scene.clone()
      console.log(gltf.scene)

      console.log(Schlag)
      scene.add(Schlag)

      createShader(Schlag)
    },

    undefined,
    function (error) {
      console.error(error)
    }
  )

  //textureArray = textureLoaderHelper.getTexture(textureArray, 'models/textures/ndvi/obj' + 0 + '.jpg')
  //console.log(textureArray)
  var texCount = 0
  var loadingTextures = true
  //4 ist Workaround weil loadTextures nicht false gesetzt wird, lädt maximal 4,
  //wird 4 beliebig hochgesetzt, wird ein error geworfen, Programm funktioniert trotzdem ohne Probleme
  while (texCount < 4 && loadingTextures) {
    loadTextures()
    texCount++
  }
  function loadTextures() {
    textureLoader.load(
      // resource URL
      'models/textures/ndvi/obj' + [texCount] + '.jpg',

      // onLoad callback
      function (texture) {
        texture.flipY = false
        textureArray.push(texture)
        console.log(textureArray)
      },

      // onProgress callback currently not supported
      undefined,

      // onError callback
      function (err) {
        console.error('All Textures Loaded or Error')
      }
    )
  }
}

var ndviMap
var HeatMap
//Maps have 600 Width, HARDCODED VALUE IN SHADER
function loadColorMaps() {
  textureLoader.load(
    // resource URL
    'models/textures/colorMaps/NDVIMap.png',

    // onLoad callback
    function (texture) {
      ndviMap = texture
    },
    undefined,

    // onError callback
    function (err) {
      console.error('No NDVI Map Loaded')
    }
  )
  textureLoader.load(
    // resource URL
    'models/textures/colorMaps/HeatMap.png',

    // onLoad callback
    function (texture) {
      HeatMap = texture
    },
    undefined,

    // onError callback
    function (err) {
      console.error('No Heat Map Loaded')
    }
  )
}
loadColorMaps()

//Add Shader

function createShader(Schlag) {
  if (scene.children.length > 3) {
    for (let i = scene.children.length - 1; i >= 3; i--) {
      scene.remove(scene.children[i])
    }
  }

  if (textureArray.length == 0) {
    textureArray.push(Schlag.children[0].material.map)
  }
  materialArray = []
  for (let i = 0; i < textureArray.length; i++) {
    var material = new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      uniforms: {
        uHeatColorPalette: { value: false },
        uNdviColorPalette: { value: false },
        uNDVIColorMap: { value: ndviMap },
        uHeatColorMap: { value: HeatMap },

        uTexture: { value: textureArray[i] },
      },
    })
    materialArray.push(material)
  }
  addShader(Schlag)
}
function addShader(Schlag) {
  //build shader material

  //set shader material to the model
  console.log(materialArray)
  Schlag.children[0].material = materialArray[0]

  //Position of the model Schlag

  //Setup Helper Box Around Schlag Mesh
  let bbox = new THREE.BoxHelper(Schlag.children[0], 0xffff00)

  //add bbox to Schlag group
  Schlag.add(bbox)

  //set OrbitControls Target to the Center of the visible Model
  controls.target.set(
    Schlag.children[1].geometry.boundingSphere.center.x,
    Schlag.children[1].geometry.boundingSphere.center.y,
    Schlag.children[1].geometry.boundingSphere.center.z
  )
  controls.update()

  //Add UserInterface

  // gui.add(material.uniforms.uOpacity, 'value', 0, 1).name('Change Material')
  gui.destroy()
  gui = new dat.GUI()
  gui
    .add(params, 'showNDVI')
    .name('Show NDVI Color Palette')
    .onChange(function (value) {
      materialArray[params.textureArray].uniforms.uNdviColorPalette.value = value
    })
  gui
    .add(params, 'showHeat')
    .name('Show Heat Color Palette')
    .onChange(function (value) {
      materialArray[params.textureArray].uniforms.uHeatColorPalette.value = value
    })
  //gui.add(params, 'showNDVI').name('toggle color difference')

  /*gui
    .add(params, 'showHeat')
    .name('Click twice to pick average color in a box')
    .onChange(function () {
      ColorPicker()
    })*/
  gui
    .add(params, 'textureArray', 0, materialArray.length - 1, 1)
    .name('Slider to Iterate through NDVI')
    .onChange(function () {
      console.log(materialArray)
      Schlag.children[0].material = materialArray[params.textureArray]
      materialArray[params.textureArray].uniforms.uNdviColorPalette.value = params.showNDVI
      materialArray[params.textureArray].uniforms.uHeatColorPalette.value = params.showHeat
    })
  /*gui
    .add(params, 'clearLocalStorage')
    .name('Clear Local Storage')
    .onChange(function () {
      localStorage.clear()
      window.alert('Local Storage Cleared')
    })

  /*  var scene2Material = new THREE.MeshBasicMaterial({ map: textureWHITE })
  scene2 = scene.clone()
  scene2.children[2].children[0].material = scene2Material
  console.log(scene)*/
  console.log(camera)
  camera.position.copy(cameraPosition.getCameraPosition(Schlag))

  var retA = cameraPositionSnapshot.setCameraPosition(Schlag, canvas)
  console.log(retA)
  //camera = retA[0]

  console.log(camera)
}

//Add File Input for Textures
const inputTextures = document.getElementById('textureInput')
if (scene.children[2] === undefined) {
  inputTextures.disabled = true
}

var count = 0
inputTextures.addEventListener(
  'change',
  function (e) {
    textureArray = []
    for (count = 0; inputTextures.files.length > count; count++) {
      var reader = new FileReader()
      reader.onload = function (e) {
        var img = new Image()

        img.src = e.target.result
        img = new THREE.Texture(img)
        img.flipY = false
        img.needsUpdate = true
        var mat = new THREE.MeshBasicMaterial({ map: img })
        Schlag.children[0].material = mat
        textureArray.push(img)

        createShader(Schlag)
        console.log(materialArray)
      }
      reader.readAsDataURL(inputTextures.files[count])
    }
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
      console.log(gltf)
      scene.remove(scene.children[2])
      scene.remove(scene.children[2])

      Schlag = gltf.scene.clone()
      scene.add(Schlag)
      console.log(scene)
      inputTextures.disabled = false
      createShader(Schlag)
    })
  },
  false
)

console.log(localStorage)

//Color Variante 2
//Read Local Storage for Saved Data to Calculate NDVI
/*
var AllParts = []
function addStoredPlanes() {
  for (var i = 0; i < localStorage.length; i++) {
    let key_deserialized = JSON.parse(localStorage.getItem(localStorage.key(i)))
    console.log(key_deserialized)
    AllParts.push(key_deserialized)
  }

  let a = 0
  while (AllParts.length > a) {
    let col = imgColor.getAverageRGB(
      imgEL,
      AllParts[a].AnteilX1,
      AllParts[a].AnteilY1,
      AllParts[a].AnteilX2,
      AllParts[a].AnteilY2,
      1
    )
    var plane = new THREE.Mesh(pgeometry, pmaterial)
    scene.add(plane)
    plane.position.set(
      Math.abs(AllParts[a].is1.x + AllParts[a].is2.x) / 2,
      Math.abs(AllParts[a].is1.y + is2.y) / 2,
      Math.abs(AllParts[a].is1.z + AllParts[a].is2.z) / 2 + 3
    )
    plane.material.color = new THREE.Color(col.r / 255.0, col.g / 255.0, col.b / 255.0)

    a++
  }
}
addStoredPlanes()
console.log(AllParts)
*/
/*
var timeout
function ColorPicker() {
  if (params.showHeat) {
    if (confirm('Ersten Click auf den Bildschirm um den NDVI-Index in einem Teilbereich zu bestimmen')) {
      console.log('ok')
      timeout = setTimeout(function () {
        firstclick = true
      }, 1000)
    } else {
      params.showHeat = false
      console.log('cancel')
    }
  }
}
*/
//raycaster
/*
const raycaster = new THREE.Raycaster()
const mouseP = new THREE.Vector2()
var firstclick = false
var secondclick = false
var is1 //first click position
var is2 //second click position
var pointIntersect


window.addEventListener('mouseup', (e) => {
  if (params.showHeat) {
    mouseP.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseP.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouseP, camera)
    const objectsToIntersect = [Schlag]
    const intersects = raycaster.intersectObjects(objectsToIntersect)

    for (const intersect of intersects) {
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
        params.showHeat = false
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
          let currentTime = new Date().getTime()
          let Points = {
            x1: is1.x,
            y1: is1.y,
            x2: is2.x,
            y2: is2.y,
            AnteilX1: AnteilX1,
            AnteilY1: AnteilY1,
            AnteilX2: AnteilX2,
            AnteilY2: AnteilY2,
          }
          let Points_serialized = JSON.stringify(Points)
          localStorage.setItem('plane' + currentTime, Points_serialized)

          var col = imgColor.getAverageRGB(imgEL, AnteilX1, AnteilY1, AnteilX2, AnteilY2, 1)

          scene.background = new THREE.Color(col.r / 255.0, col.g / 255.0, col.b / 255.0)
          plane.material.color = new THREE.Color(col.r / 255.0, col.g / 255.0, col.b / 255.0)

          console.log(plane)
          params.showHeat = false
          console.log('done')
          firstclick = false
          secondclick = false
        }, 1000)
      } else {
        params.showHeat = false
        console.log('cancel')
        firstclick = false
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

    cylinder.position.set(
      Schlag.children[1].geometry.attributes.position.array[3],
      Schlag.children[1].geometry.attributes.position.array[4],
      Schlag.children[1].geometry.attributes.position.array[5]
    )
    cylinder2.position.set(
      Schlag.children[1].geometry.attributes.position.array[9],
      Schlag.children[1].geometry.attributes.position.array[10],
      Schlag.children[1].geometry.attributes.position.array[11]
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
    scene.add(cylinder3)
    const pgeometry = new THREE.PlaneGeometry(Math.abs(is1.x - is2.x), Math.abs(is1.y - is2.y))
    const pmaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
    var plane = new THREE.Mesh(pgeometry, pmaterial)
    scene.add(plane)
    plane.position.set(Math.abs(is1.x + is2.x) / 2, Math.abs(is1.y + is2.y) / 2, Math.abs(is1.z + is2.z) / 2 + 3)
  }
})

var uvIntersect = new THREE.Vector2()
// instantiate a loader
const loaderIMG = new THREE.ImageLoader()
var imgEL = 0
// load a image resource
loaderIMG.load(
  // resource URL
  '/models/textures/ndvi/Orthomosaic.jpg',

  // onLoad callback
  function (image) {
    return (imgEL = image)
  },

  // onProgress callback currently not supported
  undefined,

  // onError callback
  function () {
    console.error('An error happened.')
  }
)

//Color Variant 1
var read = new Uint8Array(1 * 1 * 4)
var mouse = new THREE.Vector2()
var calc = false
var renderTarget
renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.domElement.addEventListener('mouseup', onMouseMove)
function onMouseMove(event) {
  calc = true
  mouse.x = event.clientX
  mouse.y = event.clientY
}
var rgbS1
var rgbS2
var rgbC
var deltaE
var labS1
var labS2
*/
// runtime Function getting called each frame
const runtime = () => {
  stats.begin()

  if (orbitcontrols) {
    controls.update()
  }

  // Renderer update
  //VARIANT 2

  //VARIANT 1
  /*if (params.showNDVI && calc) {
    camera.setViewOffset(renderer.domElement.width, renderer.domElement.height, mouse.x | 0, mouse.y | 0, 1, 1)
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)
    renderer.setRenderTarget(null)
    camera.clearViewOffset()
    renderer.render(scene, camera)
    renderer.readRenderTargetPixels(renderTarget, 0, 0, 1, 1, read)
    rgbS1 = [read[0], read[1], read[2]]

    camera.setViewOffset(renderer.domElement.width, renderer.domElement.height, mouse.x | 0, mouse.y | 0, 1, 1)
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene2, camera)
    renderer.setRenderTarget(null)
    camera.clearViewOffset()
    renderer.render(scene2, camera)
    renderer.readRenderTargetPixels(renderTarget, 0, 0, 1, 1, read)

    rgbS2 = [read[0], read[1], read[2]]
    labS1 = colorCalculator.rgb2lab(rgbS1)
    labS2 = colorCalculator.rgb2lab(rgbS2)
    deltaE = colorCalculator.deltaE(labS1, labS2)

    console.log(deltaE)
    rgbC = [rgbS2[0] - rgbS1[0], rgbS2[1] - rgbS1[1], rgbS2[2] - rgbS1[2]]

    scene.background = new THREE.Color(deltaE / 100.0, deltaE / 100.0, deltaE / 100.0)
    calc = false
  }*/
  // Call runtime again on the next frame
  renderer.setAnimationLoop(function () {
    runtime()

    renderer.render(scene, camera)
  })

  stats.end()
}

runtime()
