# ba

## Setup

Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

```bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

Prototype uses the following file formats:

For getting Files from the Web:

1. Draco compressed GLTF (gltf + texture + bin)
2. Textures in JPG or PNG Format

For uploading local Files:

1. Any non compressed GLTF
2. Textures in JPG or PNG Format

To change Files downloaded from the Web:

Model:

1. Copy draco compressed model to /static/models/schlag
2. If the model has a different name, change name in /src/utils/sceneContent/model.js

Textures:

1. Copy the textures to /static/textures/ndvi/
2. Name the textures from obj+"[Number of the first texture]" to obj+"[Number of the last texture]"
3. If the textures use a different format than JPG, change Format in /src/utils/sceneContent/textures.js

Colormaps:

1. Create a custom Colorramp Texture with the width of 600px
2. Name the texture HeatMap.png or NDVIMap.png
3. Overwrite textures in /static/textures/colormaps
4. Change the src for the overwritten Texture in /src/index.html

if the Texture uses a different size than 600px - change the number in the part of the FragmentShader that calculates the pixel color with the texture changed to the width of the new texture
alternative: add a uniform for the width of the texture to the shader and pass the texture width with the uniform
