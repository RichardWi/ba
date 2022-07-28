import * as THREE from 'three'
export async function textureLoader(url) {
  console.log(url)

  const imageLoader = new THREE.TextureLoader()
  var image = await imageLoader.loadAsync(
    url,

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function (err) {
      console.error('All images Loaded or Error')
    }
  )
  image.flipY = false

  return image
}
