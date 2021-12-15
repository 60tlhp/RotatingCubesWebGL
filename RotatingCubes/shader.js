var Shader = class ShaderName {

	compile(gl, shader, shaderName){

		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.error('ERROR compiling shader: ' + shaderName ,  gl.getShaderInfoLog(shader));
			return;
		}
	}


	createProgram(gl, shader1, shader2){

		var program = gl.createProgram();
		gl.attachShader(program, shader1);
		gl.attachShader(program, shader2);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.error('ERROR linking program!', gl.getProgramInfoLog(program));
			return;
		}
		gl.validateProgram(program);
		if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
			console.error('ERROR validating program!', gl.getProgramInfoLog(program));
			return;
		}

		return program;
	}
}