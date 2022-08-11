precision mediump float;

//uniform sampler2D uTexture; not needed, but could be used as shown below
uniform bool uNdviColorPalette;
uniform bool uHeatColorPalette;
uniform bool uChange;
uniform sampler2D uNDVIColorMap;
uniform sampler2D uHeatColorMap;

varying float vCurrentColor;
varying float vPastColor;
//varying vec2 vUv; not needed, but could be used as shown below


  void main()
    { 
      if (uChange){

        if(vCurrentColor < vPastColor)
        { float colorDiff = vPastColor - vCurrentColor;
          gl_FragColor=vec4(colorDiff,0.0,0.0,colorDiff);
          return;
        }

        if(vCurrentColor > vPastColor )
        { float colorDiff = vCurrentColor - vPastColor;
          gl_FragColor=vec4(0.0,colorDiff,0.0,colorDiff);
          return;      
        }

        if(vCurrentColor== vPastColor)
        {     
          gl_FragColor=vec4(1.0,1.0,1.0,0.2); 
          return;    
        }
      }

      if(uNdviColorPalette)
        {
        //vec4 textureNDVI = texture2D(uTexture, vUv); alternate calculation using the texture
        //would need to pass textureNDVI.r instead of vColorPassed in the next line
          float u = (vCurrentColor * (600.0 - 1.0) + 0.5) / 600.0;
          gl_FragColor = texture2D(uNDVIColorMap, vec2(u, 0.5));
          return;
        }

      if(uHeatColorPalette)
        {
        //vec4 textureHeat= texture2D(uTexture,vUv); alternate calculation using the texture
        //would need to pass textureHeat.r instead of vColorPassed in the next line        
          float u = (vCurrentColor  * (600.0 - 1.0) + 0.5) / 600.0;
          gl_FragColor = texture2D(uHeatColorMap, vec2(u, 0.5));
          return;
        }

      if(uNdviColorPalette == false && uHeatColorPalette == false && uChange == false) 
        {
          //vec4 textureC = texture2D(uTexture,vUv); 
          //textureC.a=1.0;
          //gl_FragColor=textureC; alternate calculation using the texture
          gl_FragColor=vec4( vCurrentColor , vCurrentColor , vCurrentColor ,1.0);
          return;
        }

    }