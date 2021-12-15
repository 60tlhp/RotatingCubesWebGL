var BufferObject = class BufferObjectName {



	setBuffer(gl, target, bufferInfo) {
		var bufferObject = gl.createBuffer();
		gl.bindBuffer(target, bufferObject);
		gl.bufferData(target, new Float32Array(bufferInfo), gl.STATIC_DRAW);
		gl.bindBuffer(target, null);

		return bufferObject;
	}

	setIndexBuffer(gl, target, bufferInfo) {
		var bufferObject = gl.createBuffer();
		gl.bindBuffer(target, bufferObject);
		gl.bufferData(target, new Uint16Array(bufferInfo), gl.STATIC_DRAW);
		gl.bindBuffer(target, null);

		return bufferObject;
	}

	setObject(gl, attribLocation, vertbuffer, sizeOfVertex, numberofElements){

		gl.enableVertexAttribArray(attribLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertbuffer);
		gl.vertexAttribPointer(
			attribLocation, // Attribute location
			numberofElements, // Number of elements per attribute because vec2
			gl.FLOAT, // Type of elements
			gl.FALSE, //Normalized ?
			sizeOfVertex * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
			0 // Offset from the beginning of a single vertex to this attribute
		);
	}
}