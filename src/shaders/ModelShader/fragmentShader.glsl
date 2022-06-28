precision mediump float;

uniform sampler2D uTexture;
uniform sampler2D uTextureWhite;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vColor;
varying vec3 vNormal;


  void main()
    {   
      vec4 textureC = texture2D(uTexture,vUv);
      vec4 textureW = texture2D(uTextureWhite,vUv);
      textureC=textureC*uOpacity+textureW*(1.0-uOpacity);
      textureC.a=1.0;
      

   
     
      gl_FragColor=textureC;
      }