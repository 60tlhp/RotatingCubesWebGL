var Geometry = class GeomertyName {

	drawGroupOfObjects(gl, glEnum,  matrix, worldMat, worldUniformLoc, length, position, angle, alpha, alphaUniformLoc, normalMat, normalMatUniformLoc) {

		var i; 
		
		for(i=0; i<6; i++){

			worldMat = matrix.setIdentity();
			worldMat = matrix.yRotate(worldMat, angle/4);
			worldMat = matrix.translate(worldMat, worldMat, position);
		
			gl.uniform1f(alphaUniformLoc, alpha);
			gl.uniformMatrix4fv(worldUniformLoc, gl.FALSE, worldMat);
		
			normalMat = matrix.invert(normalMat, worldMat);
			gl.uniformMatrix4fv(normalMatUniformLoc, gl.FALSE, normalMat);
			
			gl.drawElements(glEnum, length, gl.UNSIGNED_SHORT, 0);
			position[0] += 12; 
			position[1] += 0; 
			position[2] += 12;
			angle *= -1; 

		};
	}
}