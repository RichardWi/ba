//Imports

import './style.css'
import * as THREE from 'three'
import Stats from 'stats.js'
import * as dat from 'dat.gui'

function init() {
  console.log('test')
}
const gui = new dat.GUI()

//add Stats to the page
// 0: fps, 1: ms, 2: mb
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

//Setup Three JS

//Setup Canvas
const canvas = document.querySelector('canvas.webgl')

//Setup Scene
const scene = new THREE.Scene()
//Background Color of Scene (0x is hexadecimal) (0xffffff is white)
scene.background = new THREE.Color(0xffffff)

//Setup Camera
// inputs: (fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// runtime Function getting called each frame
function runtime() {
  stats.begin()

  stats.end()
}

init()

runtime()
