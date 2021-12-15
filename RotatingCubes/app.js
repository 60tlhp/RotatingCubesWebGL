

var InitDemo = function(){

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl', { premultipliedAlpha: false});
	//var gl = canvas.getContext('webgl');

	if(!gl){
		console.log('WebGL is not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if(!gl){
		alert('Your browser does not support WebGL');
	}

	var getSourceSynch = function(url) {
		var request = new XMLHttpRequest();
		request.open("GET", url, false);
		request.send(null);
		return (request.status == 200) ? request.responseText: null;
	};

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, getSourceSynch("VertexShader.vs"));
	gl.shaderSource(fragmentShader, getSourceSynch("FragmentShader.vs"));

	var shaderProgram = new Shader();
	shaderProgram.compile(gl, vertexShader, 'vertexShader');
	shaderProgram.compile(gl, fragmentShader, 'fragmentShader');

	var program = shaderProgram.createProgram(gl, vertexShader, fragmentShader);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);


  	var bufferData = new BufferData();
  	var vertIndex = bufferData.setVertexIndex();
  	var texCoordinates = bufferData.setTexCoordinates();
    var vertIndex2 = bufferData.setVertexIndex2();
  	var boxIndex = bufferData.setBoxIndex();
  	var boxIndex2 = bufferData.setBoxIndex2();
  	var vertexNormals = bufferData.setNormals();


	var buffer = new BufferObject();
	var vertbuffer = buffer.setBuffer(gl, gl.ARRAY_BUFFER, vertIndex);
	var boxIndexBufferObject = buffer.setIndexBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, boxIndex);
	var vertbuffer2 = buffer.setBuffer(gl, gl.ARRAY_BUFFER, vertIndex2);
	var boxIndexBufferObject2 = buffer.setIndexBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, boxIndex2);
	var texCoordsBuffer = buffer.setBuffer(gl, gl.ARRAY_BUFFER, texCoordinates);
	var normalbuffer = buffer.setBuffer(gl, gl.ARRAY_BUFFER, vertexNormals);


	var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('tex-image'));
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var texCoordsAttribLocation = gl.getAttribLocation(program, 'texCoords');
	var normalAttribLocation = gl.getAttribLocation(program, 'a_normal');

	
	gl.useProgram(program);

	gl.enable(gl.DEPTH_TEST);	

	gl.blendEquation(gl.FUNC_ADD);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	gl.enable(gl.BLEND);
	

	var worldMat = new Float32Array(16);
	var viewMat = new Float32Array(16);
	var projMat = new Float32Array(16);
	var matrix = new Matrix();

	var worldUniformLoc = gl.getUniformLocation(program, 'world');
	var viewUniformLoc = gl.getUniformLocation(program, 'view');
	var projUniformLoc = gl.getUniformLocation(program, 'projective');
	
	var alphaUniformLoc = gl.getUniformLocation(program, 'alphaVal');
	var samplerUniformLoc = gl.getUniformLocation(program, 'texture');
	var colorUniformLoc = gl.getUniformLocation(program, 'v_color');
	var ambientUniformLoc = gl.getUniformLocation(program, 'ambientLight');

	
	var normalMatUniformLoc = gl.getUniformLocation(program, 'uNormalMatrix');
	var lightWorldPosUniformLoc = gl.getUniformLocation(program, 'lightPosition');

	viewMat = matrix.lookAt(viewMat, [0, -5,-20], [0,-5,0], [0,1,0]);
	projMat = matrix.perspective(projMat, 90, 0.1, 500.0);

	gl.uniformMatrix4fv(viewUniformLoc, gl.FALSE, viewMat);
	gl.uniformMatrix4fv(projUniformLoc, gl.FALSE, projMat);

	var normalMat = new Float32Array(16);

	var whiteColor = new Float32Array([1,1,1,1]);

	var whiteTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, whiteTexture);
	var whitePixel = new Uint8Array([255,255,255,255]);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1,1,0, gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);

	gl.uniform3fv(lightWorldPosUniformLoc, [30,30,30]);
	gl.uniform1f(ambientUniformLoc, 0.1);

	worldMat = matrix.setIdentity();
	
	const bodyElement = document.querySelector("body");
	bodyElement.addEventListener("keydown", KeyDown, false);

	var eyePosZ = -20;
	
	function KeyDown(event){
		if("+" === event.key){
			eyePosZ += 1.0;
			viewMat = matrix.lookAt(viewMat, [0, -5, eyePosZ], [0,-5,0], [0,1,0]);
			gl.uniformMatrix4fv(viewUniformLoc, gl.FALSE, viewMat);
		}
		if("-" === event.key){
			eyePosZ -= 1.0;
			viewMat = matrix.lookAt(viewMat, [0, -5, eyePosZ], [0,-5,0], [0,1,0]);
			gl.uniformMatrix4fv(viewUniformLoc, gl.FALSE, viewMat);
		}
	}

	var geometry = new Geometry();

	var animationloop = function() {
		
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);


		gl.depthMask(true);

		buffer.setObject(gl, normalAttribLocation, normalbuffer, 3, 3);

		//lineCube
		worldMat = matrix.setIdentity();
		gl.uniform4fv(colorUniformLoc, [0.5, 0.6, 1.0, 1.0]);
		gl.bindTexture(gl.TEXTURE_2D, whiteTexture); // activate whiteTexture
		buffer.setObject(gl, positionAttribLocation, vertbuffer2,3,3);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject2);
		geometry.drawGroupOfObjects(gl, gl.LINES, matrix, worldMat, worldUniformLoc, boxIndex2.length, [0,0,0],angle, 0, alphaUniformLoc, normalMat, normalMatUniformLoc);

		//cube
		buffer.setObject(gl, positionAttribLocation, vertbuffer,3, 3);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
		gl.uniform4fv(colorUniformLoc, [0.5, 0.6, 1.0, 1.0]);
		geometry.drawGroupOfObjects(gl, gl.TRIANGLES, matrix, worldMat, worldUniformLoc, boxIndex.length, [8,8,8], angle, 0.75, alphaUniformLoc, normalMat, normalMatUniformLoc);
		
	
		gl.activeTexture(gl.TEXTURE0); //activate texture
		gl.uniform4fv(colorUniformLoc, whiteColor); //send white color
		gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('tex-image'));
		gl.uniform1i(samplerUniformLoc, 0);

		//cube
		buffer.setObject(gl, positionAttribLocation, vertbuffer,3, 3);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
		buffer.setObject(gl, texCoordsAttribLocation, texCoordsBuffer,2, 2);
		geometry.drawGroupOfObjects(gl, gl.TRIANGLES, matrix, worldMat, worldUniformLoc, boxIndex.length, [4,4,4], angle, 0.75, alphaUniformLoc, normalMat, normalMatUniformLoc);
		
		gl.depthMask(false); //transparency 

		//cube
		buffer.setObject(gl, positionAttribLocation, vertbuffer,3, 3);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
		buffer.setObject(gl, texCoordsAttribLocation, texCoordsBuffer,2, 2);
		geometry.drawGroupOfObjects(gl, gl.TRIANGLES, matrix, worldMat, worldUniformLoc, boxIndex.length, [16,16,16], angle, 0, alphaUniformLoc, normalMat, normalMatUniformLoc);
		
		//cube
		gl.uniform4fv(colorUniformLoc, [1.0, 1.0, 1.0, 0.25]);
		buffer.setObject(gl, positionAttribLocation, vertbuffer,3, 3);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
		geometry.drawGroupOfObjects(gl, gl.TRIANGLES, matrix, worldMat, worldUniformLoc, boxIndex.length, [12,12,12], angle, 0.0, alphaUniformLoc, normalMat, normalMatUniformLoc);


		gl.uniform4fv(colorUniformLoc, [1.0, 1.0, 1.0, 0.25]);
		buffer.setObject(gl, positionAttribLocation, vertbuffer,3, 3);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
		geometry.drawGroupOfObjects(gl, gl.TRIANGLES, matrix, worldMat, worldUniformLoc, boxIndex.length, [4,0,4], angle, 0.0, alphaUniformLoc, normalMat, normalMatUniformLoc);
		
		requestAnimationFrame(animationloop);
	};
	requestAnimationFrame(animationloop);
	
};





