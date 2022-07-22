import * as THREE from 'three'

export function getMultipleTextures(path) {
  const texturesLoaders = new THREE.TextureLoader()
  var i = 0
  var loadingTextures = true
  //100 ist Workaround weil loadTextures nicht false gesetzt wird
  while (i < 4 && loadingTextures) {
    loadTextures()
    i++
  }
  function loadTextures() {
    texturesLoaders.load(
      // resource URL
      'models/textures/ndvi/obj' + [i] + '.jpg',

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

export var getTexture = async (textureArray, path) => {
  const textureLoaderss = new THREE.TextureLoader()
  textureLoaderss.load(
    // resource URL
    path,

    // onLoad callback
    function (texture) {
      loaded(texture)
    }
  )
  function loaded(texture) {
    textureArray.push(texture)

    return textureArray
  }
  return textureArray
}
