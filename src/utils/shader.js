import * as THREE from 'three'

export async function createShaderMaterials(model, textureArray, HeatMap, ndviMap, vertexShader, fragmentShader) {
  let materialArray = []

  if (textureArray.length == 0) {
    textureArray.push({ name: 'Textur des übergebenen Modells', texture: model.children[0].material.map })
  }
  console.log(textureArray[0].texture)
  materialArray = []
  for (let i = 0; i < textureArray.length; i++) {
    let material = new THREE.RawShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      uniforms: {
        uHeatColorPalette: { value: false },
        uNdviColorPalette: { value: false },
        uNDVIColorMap: { value: ndviMap },
        uHeatColorMap: { value: HeatMap },
        uChange: { value: false },
        uTexture: { value: textureArray[i].texture },
      },
    })
    materialArray.push(material)
  }

  return materialArray
}

export function addShader(scene, materialArray, textureArray) {
  scene.children[1].children[0].material = materialArray[0]
  document.getElementById('DataPoint').innerHTML = textureArray[0].name
  return scene
}
