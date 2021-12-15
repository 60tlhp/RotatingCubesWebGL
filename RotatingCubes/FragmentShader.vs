precision mediump float;
uniform float alphaVal;
uniform sampler2D texture;
uniform vec4 v_color;
uniform float ambientLight;

varying vec2 coords;
varying vec3 v_normal;
varying vec3 surfaceLight; 


void main (){

	
	vec3 normal = normalize(v_normal);
	vec3 surfaceToLightDirection = normalize(surfaceLight);
	float light = max(dot(normal, surfaceToLightDirection),0.0);
	light += ambientLight;
	vec4 finaltexture = texture2D(texture, coords);
	gl_FragColor = finaltexture * vec4(v_color.rgb, v_color.a + alphaVal);
	gl_FragColor.rgb *= light;
} 