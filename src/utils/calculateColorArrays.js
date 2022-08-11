export async function calcColorArrays(scene, imageArray) {
  console.log(imageArray)

  let color = []
  let colorArray = []

  for (let i = 0; i < imageArray.length; i++) {
    var helperCanvas = document.createElement('canvas').getContext('2d')
    color = []
    let img = imageArray[i].image
    // canvas size is the size of the image
    helperCanvas.canvas.width = img.naturalWidth
    helperCanvas.canvas.height = img.naturalHeight
    // image is drawn to the canvas
    helperCanvas.drawImage(img, 0, 0)
    // get the content of the canvas
    var texData = helperCanvas.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
    let count = 0

    while (count <= scene.children[1].children[0].geometry.attributes.uv.count * 2) {
      // let indexUV = i.indexX / 3
      let u = scene.children[1].children[0].geometry.attributes.uv.array[count]
      let v = scene.children[1].children[0].geometry.attributes.uv.array[count + 1]

      var tx = Math.min((emod(u, 1) * texData.width) | 0, texData.width - 1)
      var ty = Math.min((emod(v, 1) * texData.height) | 0, texData.height - 1)
      var offset = (ty * texData.width + tx) * 4

      var r = texData.data[offset + 0]
      // greyscale means r = b = g, so only one channel is needed, but could be used in future for RGB or RGBA
      //var g = texData.data[offset + 1]
      //var b = texData.data[offset + 2]
      //var a = texData.data[offset + 3]

      count += 2
      color.push(r)
    }
    colorArray[i] = color
    console.log(color)
  }

  console.log(colorArray)
  return colorArray
}

//nomralizes the value of a number to be between 0 and 1
//in case uv are not already normalized
function emod(n, m) {
  return ((n % m) + m) % m
}
