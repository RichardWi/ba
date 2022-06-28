#include <color_vertex>
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uFrequencyG;
uniform vec4 uColor;


attribute vec3 position;
attribute vec2 uv;
attribute vec4 color;
attribute vec3 normal;

varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vColor;
varying vec3 vNormal;

void main()
{   vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vUv = uv;
    vPosition = position;
    vColor = color;
    vNormal = normal;
    

}