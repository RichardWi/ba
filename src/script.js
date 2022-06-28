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

const gui = new dat.GUI()

//add Stats to the page
// 0: fps, 1: ms, 2: mb
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

//Setup Three JS

//Setup Canvas
const canvas = document.querySelector('.webgl')

//Setup Scene
const scene = new THREE.Scene()

//Setup Background Color of Scene (0x is hexadecimal) (0x000000 is black)
scene.background = new THREE.Color(0x000000)

//Setup Camera
//inputs: (fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 7000)
scene.add(camera)

//Setup light source
// inputs: (color, intensity) (0x is hexadecimal) (0xffffff is white)
const light = new THREE.AmbientLight(0xffffff, 5.0)
scene.add(light)

//Setup Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, //point to canvas
  antialias: false, //antialiasing
})
//Renderersize inputs: (width,height)
renderer.setSize(window.innerWidth, window.innerHeight)
//Renderer PixelRatio inputs: (PixelRatio)
renderer.setPixelRatio(1)

//Setup VR
//renderer.xr.enabled = true
//VR Button
//document.body.appendChild(VRButton.createButton(renderer))

//setup controls
// Controls are used to control the camera, light, and other objects in the scene. control schema is orbit controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 0
controls.maxDistance = 1000
var orbitcontrols = true

//Setup dracoLoader to load compressed gltf/glb files
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })

//*Load Model and Add to Scene*//
//Setup GLTF Loader
const loader = new GLTFLoader()
//Add dracoLoader to GLTF Loader
loader.setDRACOLoader(dracoLoader)
var Schlag = new THREE.Object3D()
loader.load(
  '/models/schlag/DracoCompressed.glb', //path to file
  function (gltf) {
    Schlag = gltf.scene.clone()
    console.log(gltf.scene)

    console.log(Schlag)
    scene.add(Schlag)

    addShader(Schlag)
  },

  undefined,
  function (error) {
    console.error(error)
  }
)

//Add Shader

function addShader(Schlag) {
  //Load Texture Files which include the NDVI Index
  const textureNDVI = new THREE.TextureLoader().load('/models/textures/ndvi/obj.jpg')
  textureNDVI.flipY = false
  const textureWHITE = new THREE.TextureLoader().load('/models/textures/white/weiss.png')
  textureWHITE.flipY = false
  var materialformodel = new THREE.MeshBasicMaterial({ map: textureNDVI })

  //build shader material

  const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    uniforms: {
      uOpacity: { value: 1.0 },
      uTexture: { value: textureNDVI },
      uTextureWhite: { value: textureWHITE },
    },
  })

  //set shader material to the model
  Schlag.children[0].material = material

  //Position of the model Schlag

  //Setup Helper Box Around Schlag Mesh
  const bbox = new THREE.BoxHelper(Schlag.children[0], 0xffff00)

  //add bbox to Schlag group
  Schlag.add(bbox)

  //set OrbitControls Target to the Center of the visible Model
  controls.target.set(
    Schlag.children[1].geometry.boundingSphere.center.x,
    Schlag.children[1].geometry.boundingSphere.center.y,
    Schlag.children[1].geometry.boundingSphere.center.z
  )
  controls.update()

  //--*Set CameraPosition relative to the visible model*--//
  //Center of the bounding Sphere corresponds to center of the visible Model
  //Schlag.children[1] is the HelperBox Mesh
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

  console.log(scene)

  //Add UserInterface
  gui.add(material.uniforms.uOpacity, 'value', 0, 1).name('Change Material')
}
// runtime Function getting called each frame
const runtime = () => {
  stats.begin()

  if (orbitcontrols) {
    controls.update()
  }

  // Renderer update

  renderer.render(scene, camera)

  // Call runtime again on the next frame
  renderer.setAnimationLoop(function () {
    runtime()

    renderer.render(scene, camera)
  })

  stats.end()
}

runtime()
