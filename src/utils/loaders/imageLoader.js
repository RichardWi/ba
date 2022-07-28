import * as THREE from 'three'
export async function imageLoader(url) {
  console.log(url)

  const imageLoader = new THREE.ImageLoader()
  var image = await imageLoader.loadAsync(
    url,

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function (err) {
      console.error('All Textures Loaded or Error')
    }
  )

  console.log(image)
  return image
}
