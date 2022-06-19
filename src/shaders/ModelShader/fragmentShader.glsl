precision mediump float;

uniform sampler2D uTexture;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vColor;

  void main()
    {   
      vec4 textureC = texture2D(uTexture,vUv);
         
      textureC.r=vColor.r;//255.0;//0.0+uFrequencyR-uFrequencyG;
      textureC.g=vColor.g;//255.0;//0.0+uFrequencyG; 
      textureC.b=vColor.b;//255.0;//0.0;
     
      gl_FragColor=textureC;
      }