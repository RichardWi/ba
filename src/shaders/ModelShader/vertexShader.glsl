#include <color_vertex>
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
//attribute vec2 uv; not needed, but could be in fragment shader, fragment shader still has the code to use it
attribute float pastColor;
attribute float currentColor;

//varying vec2 vUv; not needed, but could be in fragment shader, fragment shader still has the code to use it
varying float  vCurrentColor;
varying float vPastColor;

void main()
{   vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
    //vUv = uv; not needed, but could be in fragment shader, fragment shader still has the code to use it
    
    //current/past Color (0-255) has to be converted to 0-1
    //mulitply by 0.0039215 to get the value in 0-1
    //multiply could be faster than divide
    //is done here for every vertex, could also be done in fragment shader for every pixel
    //is faster as long as the number of vertices is lower than the number of pixels
    //could be slower for different models and on different screens
    vPastColor = pastColor * 0.0039215;
    vCurrentColor = currentColor * 0.0039215;
    

}