//Imports
import './style.css'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fragmentShader from './shaders/ModelShader/fragmentShader.glsl'
import vertexShader from './shaders/ModelShader/vertexShader.glsl'
import { Group } from 'three'

//const gui = new dat.GUI()

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
//Background Color of Scene (0x is hexadecimal) (0x000000 is black)
scene.background = new THREE.Color(0x000000)

//Setup Camera
// inputs: (fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 7000)
camera.position.x = 50
camera.position.y = 50
camera.position.z = 50
scene.add(camera)

//Setup light source
// inputs: (color, intensity) (0x is hexadecimal) (0xffffff is white)
const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

//Setup Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, //point to canvas
  antialias: true, //antialiasing
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(2)

//setup controls
// Controls are used to control the camera, light, and other objects in the scene. control schema is orbit controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 0
controls.maxDistance = 4000
var orbitcontrols = true

//Load Model and Add to Scene
const loader = new GLTFLoader()
var Schlag = new THREE.Object3D()
loader.load(
  '/models/schlag/seusslitz_ownCoordinates_texture-jpeg_raster-indexValues_medium (1).glb',
  function (gltf) {
    Schlag = gltf.scene.clone()

    const TXT = gltf.scene.children[0].material.map
    const modelMaterial = Schlag.children[0].material
    console.log(Schlag)
    scene.add(Schlag)

    addShader(Schlag, TXT, modelMaterial)
  },

  undefined,
  function (error) {
    console.error(error)
  }
)

//Add Shader

function addShader(Schlag, TXT, modelMaterial) {
  //load texture
  const texture = new THREE.TextureLoader().load('/models/textures/white/weiss.png')
  console.log(texture)

  Schlag.children[0].material.vertexColors = THREE.VertexColors

  const uColor = new Float32Array(Schlag.children[0].geometry.attributes.color.data.array)
  for (let i = 0; i < Schlag.children[0].geometry.attributes.color.data.array.length * 4; i += 4) {
    uColor[i] = Schlag.children[0].geometry.attributes.color.array[i] / 255.0
    uColor[i + 1] = Schlag.children[0].geometry.attributes.color.array[i + 1] / 255.0
    uColor[i + 2] = Schlag.children[0].geometry.attributes.color.array[i + 2] / 255.0
    uColor[i + 3] = Schlag.children[0].geometry.attributes.color.array[i + 3]
  }

  Schlag.children[0].geometry.setAttribute('color', new THREE.BufferAttribute(uColor, 4))

  //build shader material
  const material = new THREE.RawShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    uniforms: {
      uOpacity: { value: 1.0 },
      uTexture: { value: texture },
    },
  })

  //set shader material to the model
  Schlag.children[0].material = material

  var currentMateriel = material

  //Position of the model Schlag
  Schlag.position.x = -180
  Schlag.position.y = -200
  Schlag.position.z = 0
  Schlag.rotation.x = (Math.PI / 2) * -1

  //set OrbitControls Target to the model
  controls.target.set(Schlag.position.x, Schlag.position.y, Schlag.position.z)

  //change Material on click
  var materialButton = document.getElementById('materialButton')

  materialButton.onclick = function () {
    console.log('clicked')
    if (currentMateriel == material) {
      currentMateriel = modelMaterial
    } else {
      currentMateriel = material
    }
    Schlag.children[0].material = currentMateriel
  }

  document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      console.log('Space pressed')
      if (currentMateriel == material) {
        currentMateriel = modelMaterial
      } else {
        currentMateriel = material
      }
      Schlag.children[0].material = currentMateriel
    }
  })

  //Add Helper Box
  const bbox = new THREE.BoxHelper(Schlag.children[0], 0xffff00)
  //add bbox to Schlag group
  Schlag.add(bbox)
}
// runtime Function getting called each frame
const tick = () => {
  stats.begin()

  if (orbitcontrols) {
    controls.update()
  }

  // Renderer update

  renderer.render(scene, camera)

  // Call tick again on the next frame
  renderer.setAnimationLoop(function () {
    tick()

    renderer.render(scene, camera)
  })

  stats.end()
}

tick()
