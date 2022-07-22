export function getAverageRGB(imgEl, AnteilX, AnteilY, AnteilX2, AnteilY2, radius) {
  var blockSize = 1, // only visit every 5 pixels
    defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
    canvas = document.createElement('canvas'),
    context = canvas.getContext && canvas.getContext('2d'),
    data,
    width,
    height,
    i = -4,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0

  if (!context) {
    return defaultRGB
  }

  height = canvas.height = imgEl.naturalHeight
  width = canvas.width = imgEl.naturalWidth

  context.drawImage(imgEl, 0, 0)
  // var upperLeft = { x: Math.min(is1.x, is2.x), y: Math.max(is1.y, is2.y) }
  // var lowerRight = { x: Math.max(is1.x, is2.x), y: Math.min(is1.y, is2.y) }

  //var distance = { x: (lowerRight.x - upperLeft.x) * width, y: (upperLeft.y - lowerRight.y) * height }
  //console.log(Math.abs(AnteilX - AnteilX2), Math.abs(AnteilY - AnteilY2))
  // console.log(height, width)
  console.log(Math.abs(AnteilX - AnteilX2) * width, Math.abs(AnteilY - AnteilY2) * height)

  try {
    data = context.getImageData(
      AnteilX * width,
      height - AnteilY * height,
      Math.abs(AnteilX - AnteilX2) * width,
      Math.abs(AnteilY - AnteilY2) * height
    )
  } catch (e) {
    /* security error, img on diff domain */ alert('x')
    return defaultRGB
  }

  length = data.data.length

  while ((i += blockSize * 4) < length) {
    ++count
    rgb.r += data.data[i]
    rgb.g += data.data[i + 1]
    rgb.b += data.data[i + 2]
  }

  // ~~ used to floor values
  rgb.r = ~~(rgb.r / count)
  rgb.g = ~~(rgb.g / count)
  rgb.b = ~~(rgb.b / count)
  console.log(rgb)
  return rgb
}
