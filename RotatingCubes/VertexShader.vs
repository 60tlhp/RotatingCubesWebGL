
precision mediump float; 
uniform mat4 world;
uniform mat4 view;
uniform mat4 projective;
uniform vec3 lightPosition;
uniform mat4 uNormalMatrix;

attribute vec3 vertPosition;
attribute vec2 texCoords;
attribute vec3 a_normal;

varying vec2 coords;
varying vec3 v_normal;
varying vec3 surfaceLight; 



void main(){
	coords = texCoords;
	v_normal = (uNormalMatrix * vec4(a_normal, 0.0)).xyz;
	vec3 surfacePostion  = (world * vec4(vertPosition, 1.0)).xyz;
	surfaceLight = lightPosition - surfacePostion;
	gl_Position = projective * view * world * vec4(vertPosition, 1.0); 
}