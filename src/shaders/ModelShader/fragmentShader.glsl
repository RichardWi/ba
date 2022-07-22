precision mediump float;

uniform sampler2D uTexture;
uniform bool uNdviColorPalette;
uniform bool uHeatColorPalette;
uniform sampler2D uNDVIColorMap;
uniform sampler2D uHeatColorMap;

varying vec2 vUv;




  void main()
    {   
      if(uNdviColorPalette)
      {
        vec4 textureNDVI = texture2D(uTexture, vUv);
    float u = (textureNDVI.r * (600.0 - 1.0) + 0.5) / 600.0;
     
  gl_FragColor = texture2D(uNDVIColorMap, vec2(u, 0.5));
      }
      if(uHeatColorPalette)
      {
       

              vec4 textureHeat= texture2D(uTexture,vUv);
               
    float u = (textureHeat.g * (600.0 - 1.0) + 0.5) / 600.0;
     
  gl_FragColor = texture2D(uHeatColorMap, vec2(u, 0.5));
      }
      if(uNdviColorPalette == false && uHeatColorPalette == false) {
      vec4 textureC = texture2D(uTexture,vUv);
      textureC.a=1.0;
       gl_FragColor=textureC;
      }

   
     
     
      }