import * as THREE from 'three'

//creats a shader material for each texture array which can be used to texture the model
//vertex shader = calculates positon of each vertex
//fragment shader = calculates color of each vertex
//uniforms = passes data to the shader
//data the shader always gets passed if available and is needed: BufferAttribute uv, BufferAttribute position, BufferAttribute normal, BufferAttribute color
//uniform values can be changed by the gui and will result in different color output
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
        //uTexture: { value: textureArray[i].texture }, currently not used, because the color information is passed to the shader via the current and past color array calculated in
        //calculateColorArrays.js
        //was left in the code in case it is needed in the future, shader code also just uncommented the texture use
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
