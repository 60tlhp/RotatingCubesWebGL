 var Matrix = class  MatrixName {


	setIdentity() {

	var identity = [1.0, 0.0, 0.0, 0.0,
					0.0, 1.0, 0.0, 0.0,
					0.0, 0.0, 1.0, 0.0,
					0.0, 0.0, 0.0, 1.0,
					]
		return identity;
	
	}

	translate(out, a, v){
		

		  var i;
		
		  if (a === out) {
		    out[12] = a[0] * v[0] + a[4] * v[1] + a[8] * v[2] + a[12];
		    out[13] = a[1] * v[0] + a[5] * v[1] + a[9] * v[2] + a[13];
		    out[14] = a[2] * v[0] + a[6] * v[1] + a[10] * v[2] + a[14];
		    out[15] = a[3] * v[0] + a[7] * v[1] + a[11] * v[2] + a[15];
		  } 
		  else {
		    for(i=0; i<12; i++){
		    	out[i] = a[i];
		    }
		    out[12] = a[0] * v[0] + a[4] * v[1] + a[8] * v[2] + a[12];
		    out[13] = a[1] * v[0] + a[5] * v[1] + a[9] * v[2] + a[13];
		    out[14] = a[2] * v[0] + a[6] * v[1] + a[10] * v[2] + a[14];
		    out[15] = a[3] * v[0] + a[7] * v[1] + a[11] * v[2] + a[15];
  		}
  	
		  return out;
	}

	xRotate(out, angleInradiant){
		var cos = Math.cos(angleInradiant);
		var sin = Math.sin(angleInradiant);

		out = [1.0, 0.0, 0.0 ,0.0,
			   0.0, cos, sin, 0.0,
			   0.0, -sin, cos, 0.0,
			   0.0, 0.0, 0.0, 1.0,
			  ];

		return out;
	}

	yRotate(out, angleInradiant){
		var cos = Math.cos(angleInradiant);
		var sin = Math.sin(angleInradiant);

		out = [cos, 0.0, -sin,0.0,
			   0.0, 1.0, 0.0, 0.0,
			   sin, 0.0, cos, 0.0,
			   0.0, 0.0, 0.0, 1.0,
			  ];

		return out;
	}		

	zRotate(out,angleInradiant){
		var cos = Math.cos(angleInradiant);
		var sin = Math.sin(angleInradiant);

		out = [cos, sin, 0.0 ,0.0,
			   -sin, cos, 0.0, 0.0,
			   0.0, 0.0, 1.0, 0.0,
			   0.0, 0.0, 0.0, 1.0,
			  ];

		return out;
	}

	lookAt(out, eye, center, up){
		var zAxis = new Float32Array(3);
		var xAxis = new Float32Array(3);
		var yAxis = new Float32Array(3);
		var crossProduct_z_up = new Float32Array(3);
		var crossProduct_x_z = new Float32Array(3);
		var norm1, norm2, norm3;

		
		zAxis[0] = eye[0] - center[0];
		zAxis[1] = eye[1] - center[1];
		zAxis[2] = eye[2] - center[2];
		
		//checkDivisionByZero
		norm1 = Math.sqrt(zAxis[0] * zAxis[0] + zAxis[1] * zAxis[1] + zAxis[2] * zAxis[2]);
		if(norm1 > 0.0) {
			//norm1 = 1/norm1;
			zAxis[0] = zAxis[0] / norm1;
			zAxis[1] = zAxis[1] / norm1;
			zAxis[2] = zAxis[2] / norm1;
		}
		else {
			zAxis[0] = 0.0;
			zAxis[1] = 0.0;
			zAxis[2] = 0.0;
		}
		
		crossProduct_z_up[0] = zAxis[1] * up[2] - zAxis[2] * up[1];
		crossProduct_z_up[1] = zAxis[2] * up[0] - zAxis[0] * up[2];
		crossProduct_z_up[2] = zAxis[0] * up[1] - zAxis[1] * up[0];

		norm2 = Math.sqrt(crossProduct_z_up[0] * crossProduct_z_up[0] + crossProduct_z_up[1] * crossProduct_z_up[1] + crossProduct_z_up[2] * crossProduct_z_up[2]);
		if(norm2 > 0.0){
			//norm2 = 1/norm2;
			xAxis[0] = crossProduct_z_up[0] / norm2;
			xAxis[1] = crossProduct_z_up[1] / norm2;
			xAxis[2] = crossProduct_z_up[1] / norm2;	
		}
		else{
			xAxis[0] = 0.0;
			xAxis[1] = 0.0;
			xAxis[2] = 0.0;	
		}

		crossProduct_x_z[0] = xAxis[1] * zAxis[2] - xAxis[2] * zAxis[1];
		crossProduct_x_z[1] = xAxis[2] * zAxis[0] - xAxis[0] * zAxis[2];
		crossProduct_x_z[2] = xAxis[0] * zAxis[1] - xAxis[1] * zAxis[0];

		norm3 = Math.sqrt(crossProduct_x_z[0] * crossProduct_x_z[0] + crossProduct_x_z[1] * crossProduct_x_z[1] + crossProduct_x_z[2] * crossProduct_x_z[2]);
		
		if(norm3 > 0.0){
			//norm3 = 1/norm3;
			yAxis[0] = crossProduct_x_z[0] / norm3;
			yAxis[1] = crossProduct_x_z[1] / norm3;
			yAxis[2] = crossProduct_x_z[2] / norm3;	
		}
		else{
			yAxis[0] = 0.0;
			yAxis[1] = 0.0;
			yAxis[2] = 0.0;
		}
		 
		out = [xAxis[0], yAxis[0], zAxis[0], 0.0,
			   xAxis[1], yAxis[1], zAxis[1], 0.0,
			   xAxis[2], yAxis[2], zAxis[2], 0.0,
			   eye[0], eye[1], eye[2], 1.0,];

	
	  
		return out;
	}

	perspective(out, fovy, near, far){
		//fovy = fovy * (Math.PI / 180);
		var s = 1/(Math.tan((fovy/2) * (Math.PI/180)));
		var f1 = -(far/(far-near));
		var f2 = -(((far*near) / (far-near)));

		out = [s, 0.0, 0.0, 0.0,
			   0.0, s, 0.0, 0.0,
			   0.0, 0.0, f1, -1.0,
			   0.0, 0.0, f2, 0.0,
			   ];

		return out;


	}

	transpose(out, m){
		out[0] = m[0]
		out[1] = m[4]
		out[2] = m[8]
		out[3] = m[12]
		out[4] = m[1]
		out[5] = m[5]
		out[6] = m[9]
		out[7] = m[13]
		out[8] = m[2]
		out[9] = m[6]
		out[10] = m[10]
		out[11] = m[14]
		out[12] = m[3]
		out[13] = m[7]
		out[14] = m[11]
		out[15] = m[15]

		return out;
	}

	invert(out, m){

		function det3x3(n){
			var det3 = n[0] * n[4] * n[8] + n[1] * n[5] * n[6] + n[2] * n[3] * n[7] - n[6] * n[4] * n[2] - n[7] * n[5] * n[0] - n[8] * n[3] * n[1] ;
			return det3;
		}

		function det4x4(m){
			var a1 = [m[5], m[6], m[7], m[9], m[10], m[11], m[13], m[14], m[15]];
			var a2 = [m[4], m[6], m[7], m[8], m[10], m[11], m[12], m[14], m[15]];
			var a3 = [m[4], m[5], m[7], m[8], m[9], m[11], m[12], m[13], m[15]];
			var a4 = [m[4], m[5], m[6], m[8], m[9], m[10], m[12], m[13], m[14]];

			var det = m[0]* det3x3(a1) + (-1 * m[1] * det3x3(a2)) + m[2] * det3x3(a3) + (-1 * m[3] * det3x3(a4));
			return det;
		}

		function adjoint(n){
			var n11 = [n[5], n[6], n[7], n[9], n[10], n[11], n[13], n[14], n[15]];
			var n12 = [n[4], n[6], n[7], n[8], n[10], n[11], n[12], n[14], n[15]];
			var n13 = [n[4], n[5], n[7], n[8], n[9], n[11], n[12], n[13], n[15]];
			var n14 = [n[4], n[5], n[6], n[8], n[9], n[10], n[12], n[13], n[14]];

			var n21 = [n[1], n[2], n[3], n[9], n[10], n[11], n[13], n[14], n[15]];
			var n22 = [n[0], n[2], n[3], n[8], n[10], n[11], n[12], n[14], n[15]];
			var n23 = [n[0], n[1], n[3], n[8], n[9], n[11], n[12], n[13], n[15]];
			var n24 = [n[0], n[1], n[2], n[8], n[9], n[10], n[12], n[13], n[14]];

			var n31 = [n[1], n[2], n[3], n[5], n[6], n[7], n[13], n[14], n[15]];
			var n32 = [n[0], n[2], n[3], n[4], n[6], n[7], n[12], n[14], n[15]];
			var n33 = [n[0], n[1], n[3], n[4], n[5], n[7], n[12], n[13], n[15]];
			var n34 = [n[0], n[1], n[2], n[4], n[5], n[6], n[12], n[13], n[14]];

			var n41 = [n[1], n[2], n[3], n[5], n[6], n[7], n[9], n[10], n[11]];
			var n42 = [n[0], n[2], n[3], n[4], n[6], n[7], n[8], n[10], n[11]];
			var n43 = [n[0], n[1], n[3], n[4], n[5], n[7], n[8], n[9], n[11]];
			var n44 = [n[0], n[1], n[2], n[4], n[5], n[6], n[8], n[9], n[10]];

			var adjMat = [ det3x3(n11), -1 * det3x3(n12), det3x3(n13), -1 * det3x3(n14), -1 * det3x3(n21), det3x3(n22), -1 * det3x3(n23), det3x3(n24), det3x3(n31), -1 * det3x3(n32), det3x3(n33), -1 * det3x3(n34), -1 * det3x3(n41),det3x3(n42), -1 * det3x3(n43), det3x3(n44)];
			return adjMat;
		}

		var det = det4x4(m);
		var adj = adjoint(m);

		if(det !== 0) {
			var mat = [1/det * adj[0], 1/det * adj[1], 1/det * adj[2], 1/det * adj[3], 1/det * adj[4], 1/det * adj[5], 1/det * adj[6], 1/det * adj[7], 1/det * adj[8], 1/det * adj[9], 1/det * adj[10], 1/det * adj[11], 1/det * adj[12], 1/det * adj[13], 1/det * adj[14], 1/det * adj[15]];
		}

		var invMat = this.transpose(new Float32Array(16), mat);
		return invMat;
	}
}


