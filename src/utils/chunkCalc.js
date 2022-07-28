import * as THREE from 'three'

export async function calcF(scene, imageArray) {
  console.log(imageArray)
  const loaderIMG = new THREE.ImageLoader()
  let color = []
  let colorArray = []

  for (let i = 0; i < imageArray.length; i++) {
    var some2dCanvasCtx = document.createElement('canvas').getContext('2d')
    color = []
    let img = imageArray[i].image
    // make the canvas same size as the image
    some2dCanvasCtx.canvas.width = img.width
    some2dCanvasCtx.canvas.height = img.height
    // draw the image into the canvas
    some2dCanvasCtx.drawImage(img, 0, 0)
    // copy the contents of the canvas
    var texData = some2dCanvasCtx.getImageData(0, 0, img.width, img.height)
    let count = 0

    while (count <= scene.children[1].children[0].geometry.attributes.uv.count * 2) {
      // let indexUV = i.indexX / 3
      let u = scene.children[1].children[0].geometry.attributes.uv.array[count]
      let v = scene.children[1].children[0].geometry.attributes.uv.array[count + 1]

      var tx = Math.min((emod(u, 1) * texData.width) | 0, texData.width - 1)
      var ty = Math.min((emod(v, 1) * texData.height) | 0, texData.height - 1)
      var offset = (ty * texData.width + tx) * 4
      var r = texData.data[offset + 0]
      var g = texData.data[offset + 1]
      var b = texData.data[offset + 2]
      var a = texData.data[offset + 3]
      count += 2
      color.push(r)
    }
    colorArray[i] = color
    console.log(color)
  }
  //const average = color.reduce((a, b) => a + b, 0) / color.length

  //iDontKnow = { average, indexArr: indexArrX, shaderArr, color }

  console.log(colorArray)
  return colorArray
}

async function getAvrgColor(indexArrX, scene, shaderArr) {
  const loaderIMG1 = new THREE.ImageLoader()
  var img
  await loaderIMG1
    .loadAsync(
      // resource URL
      '/models/textures/ndvi/obj0.jpg',

      // onLoad callback
      function (image) {
        return (img = image)
      },

      // onProgress callback currently not supported
      undefined,

      // onError callback
      function () {
        console.error('An error happened.')
      }
    )
    .then(async function (img) {
      //var u = 0.5
      //var v = 0.6
      var some2dCanvasCtx = document.createElement('canvas').getContext('2d')
      console.log(img)

      // make the canvas same size as the image
      some2dCanvasCtx.canvas.width = img.width
      some2dCanvasCtx.canvas.height = img.height
      // draw the image into the canvas
      some2dCanvasCtx.drawImage(img, 0, 0)
      // copy the contents of the canvas
      var texData = some2dCanvasCtx.getImageData(0, 0, img.width, img.height)
      let i
      var color = []
      for (i of indexArrX) {
        let indexUV = i.indexX / 3
        let u = scene.children[1].children[0].geometry.attributes.uv.array[indexUV]
        let v = scene.children[1].children[0].geometry.attributes.uv.array[indexUV + 1]

        var tx = Math.min((emod(u, 1) * texData.width) | 0, texData.width - 1)
        var ty = Math.min((emod(v, 1) * texData.height) | 0, texData.height - 1)
        var offset = (ty * texData.width + tx) * 4
        var r = texData.data[offset + 0]
        var g = texData.data[offset + 1]
        var b = texData.data[offset + 2]
        var a = texData.data[offset + 3]

        color.push(r)
      }
      const average = color.reduce((a, b) => a + b, 0) / color.length

      iDontKnow = { average, indexArr: indexArrX, shaderArr, color }
    })
  return iDontKnow
}

function emod(n, m) {
  return ((n % m) + m) % m
}
