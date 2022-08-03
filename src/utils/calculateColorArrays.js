import * as THREE from 'three'

export async function calcColorArrays(scene, imageArray) {
  console.log(imageArray)
  const loaderIMG = new THREE.ImageLoader()
  let color = []
  let colorArray = []

  for (let i = 0; i < imageArray.length; i++) {
    var some2dCanvasCtx = document.createElement('canvas').getContext('2d')
    color = []
    let img = imageArray[i].image
    // make the canvas same size as the image
    some2dCanvasCtx.canvas.width = img.naturalWidth
    some2dCanvasCtx.canvas.height = img.naturalHeight
    // draw the image into the canvas
    some2dCanvasCtx.drawImage(img, 0, 0)
    // copy the contents of the canvas
    var texData = some2dCanvasCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
    let count = 0

    while (count <= scene.children[1].children[0].geometry.attributes.uv.count * 2) {
      // let indexUV = i.indexX / 3
      let u = scene.children[1].children[0].geometry.attributes.uv.array[count]
      let v = scene.children[1].children[0].geometry.attributes.uv.array[count + 1]

      var tx = Math.min((emod(u, 1) * texData.width) | 0, texData.width - 1)
      var ty = Math.min((emod(v, 1) * texData.height) | 0, texData.height - 1)
      var offset = (ty * texData.width + tx) * 4
      //color is divided by 255 to normalize the values to be between 0 and 1
      //if not done here once, the shader would have to do it for each pixel or vertex each frame
      var r = texData.data[offset + 0]
      // greyscale means r = b = g, so only one channel is needed
      //var g = texData.data[offset + 1]
      //var b = texData.data[offset + 2]
      //var a = texData.data[offset + 3]
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

//nomralizes the value of a number to be between 0 and 1
//in case uv are not already normalized
function emod(n, m) {
  return ((n % m) + m) % m
}
