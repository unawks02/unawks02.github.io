function start() {

    // Get canvas, WebGL context, twgl.m4
    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");

    // Sliders at center
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
	var slider3 = document.getElementById('slider3');
    slider3.value = 0;

    // Read shader source
    var vertexSource = document.getElementById("vertexShader").text;
    var fragmentSource = document.getElementById("fragmentShader").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);	    
    
    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);
    
    shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
   
    // this gives us access to the matrix uniform
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
    shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram,"uMVn");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

    // vertex positions
    var vertexPos1 = new Float32Array(
        [  0, 1, 0,  -1, -1, 1,  1,-1, 1]);
	var vertexPos2 = new Float32Array(
        [  0, 1, 0,   1,-1, 1,   1,-1,-1]);
	var vertexPos3 = new Float32Array(		
        [  0, 1, 0,   1, -1,-1,  -1, -1,-1]);
	var vertexPos4 = new Float32Array(	
        [  0, 1, 0,  -1, -1,-1,  -1,-1,1]);
	var vertexPos5 = new Float32Array(	
        [ -1,-1,1,   1,-1,1,   1,-1, -1,  -1,-1, -1]);

    // vertex normals
    var vertexNormals1 = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1]);
	var vertexNormals2 = new Float32Array(	
        [  1, 0, 0,   1, 0, 0,   1, 0, 0]);
	var vertexNormals3 = new Float32Array(	
        [  0, 0, -1,   0, 0, -1,   0, 0, -1]);
	var vertexNormals4 = new Float32Array(	
        [ -1, 0, 0,  -1, 0, 0,  -1, 0, 0]);
	var vertexNormals5 = new Float32Array(	
        [  0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0]);

    // vertex colors
    var vertexColors1 = new Float32Array(
        [  1, 1, 1,   0.7, 0.2, 0.2,   0.7, 0.2, 0.2]);
	var vertexColors2 = new Float32Array(		
        [  1, 1, 1,   0.7, 0.2, 0.2,   0.7, 0.2, 0.2]);
	 var vertexColors3 = new Float32Array(	
        [  1, 1, 1,   0.7, 0.2, 0.2,   0.7, 0.2, 0.2]);
	 var vertexColors4 = new Float32Array(	
        [  1, 1, 1,   0.7, 0.2, 0.2,   0.7, 0.2, 0.2]);
	 var vertexColors5 = new Float32Array(	
        [  0, 0, 0,   0, 0, 0,   0, 0, 0,   0, 0, 0]);

    // element index array
    var triangleIndices1 = new Uint8Array(
        [ 0, 1, 2 ]);
	var triangleIndices2 = new Uint8Array(
        [ 0, 1, 2 ]);
	var triangleIndices3 = new Uint8Array(
        [ 0, 1, 2 ]);
	var triangleIndices4 = new Uint8Array(
        [ 0, 1, 2 ]);
	var triangleIndices5 = new Uint8Array(
        [ 0, 1, 2,   0, 2, 3]);

    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
	//TO DO: make separate buffers for each shape
    var trianglePosBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos1, gl.STATIC_DRAW);
    trianglePosBuffer1.itemSize = 3;
    trianglePosBuffer1.numItems = 3;
	
	var trianglePosBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos2, gl.STATIC_DRAW);
    trianglePosBuffer2.itemSize = 3;
    trianglePosBuffer2.numItems = 3;
	
	var trianglePosBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos3, gl.STATIC_DRAW);
    trianglePosBuffer3.itemSize = 3;
    trianglePosBuffer3.numItems = 3;
	
	var trianglePosBuffer4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer4);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos4, gl.STATIC_DRAW);
    trianglePosBuffer4.itemSize = 3;
    trianglePosBuffer4.numItems = 3;
	
	var trianglePosBuffer5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer5);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos5, gl.STATIC_DRAW);
    trianglePosBuffer5.itemSize = 3;
    trianglePosBuffer5.numItems = 4;
    
    // a buffer for normals
    var triangleNormalBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals1, gl.STATIC_DRAW);
    triangleNormalBuffer1.itemSize = 3;
    triangleNormalBuffer1.numItems = 3;
	
	var triangleNormalBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals2, gl.STATIC_DRAW);
    triangleNormalBuffer2.itemSize = 3;
    triangleNormalBuffer2.numItems = 3;
	
	var triangleNormalBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals3, gl.STATIC_DRAW);
    triangleNormalBuffer3.itemSize = 3;
    triangleNormalBuffer3.numItems = 3;
	
	var triangleNormalBuffer4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer4);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals4, gl.STATIC_DRAW);
    triangleNormalBuffer4.itemSize = 3;
    triangleNormalBuffer4.numItems = 3;
	
	var triangleNormalBuffer5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer5);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals5, gl.STATIC_DRAW);
    triangleNormalBuffer5.itemSize = 3;
    triangleNormalBuffer5.numItems = 4;
    
    // a buffer for colors
    var colorBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors1, gl.STATIC_DRAW);
    colorBuffer1.itemSize = 3;
    colorBuffer1.numItems = 3;
	
	var colorBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors2, gl.STATIC_DRAW);
    colorBuffer2.itemSize = 3;
    colorBuffer2.numItems = 3;
	
	var colorBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer3);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors3, gl.STATIC_DRAW);
    colorBuffer3.itemSize = 3;
    colorBuffer3.numItems = 3;
	
	var colorBuffer4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer4);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors4, gl.STATIC_DRAW);
    colorBuffer4.itemSize = 3;
    colorBuffer4.numItems = 3;
	
	var colorBuffer5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer5);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors5, gl.STATIC_DRAW);
    colorBuffer5.itemSize = 3;
    colorBuffer5.numItems = 4;

    // a buffer for indices
    var indexBuffer1 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer1);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices1, gl.STATIC_DRAW);
	var indexBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices2, gl.STATIC_DRAW);
	var indexBuffer3 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer3);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices3, gl.STATIC_DRAW);
	var indexBuffer4 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer4);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices4, gl.STATIC_DRAW);
	var indexBuffer5 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer5);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices5, gl.STATIC_DRAW);

    // Scene (re-)draw routine
    function draw() {
    
        // Translate slider values to angles in the [-pi,pi] interval
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;
		var angle3 = slider3.value*0.01*Math.PI;
    
        // Circle around the y-axis
        var eye = [400*Math.sin(angle1),100.0,400.0*Math.cos(angle1)];
        var target = [0,-20,0];
        var up = [0,1,0];
    
        var tModel = mat4.create();
        mat4.fromScaling(tModel,[100,100,100]);
        mat4.rotate(tModel,tModel,angle2,[1,1,1]);
      
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);      

        var tProjection = mat4.create();
        mat4.perspective(tProjection,Math.PI/4,1,10,1000);
      
        var tMV = mat4.create();
        var tMVn = mat3.create();
        var tMVP = mat4.create();
        mat4.multiply(tMV,tCamera,tModel); // "modelView" matrix
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,tProjection,tMV);
      
        // Clear screen, prepare for rendering
        gl.clearColor(0.3, 0.4, 0.3, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVmatrix,false,tMV);
        gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix,false,tMVn);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
                 
		gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer5);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer5.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer5);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer5.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer5);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer5.itemSize,
          gl.FLOAT,false, 0, 0);
        // Do the drawing for each part of shape
        gl.drawElements(gl.TRIANGLES, triangleIndices5.length, gl.UNSIGNED_BYTE, 0);
		
		//rotate side
		var Trot1 = mat4.create();
		mat4.translate(Trot1, Trot1, [0, -1, 1]);
		mat4.rotateX(Trot1, Trot1, angle3);
		mat4.multiply(tMVP,tMVP,Trot1); //rotate 1st side
		mat4.translate(tMVP,tMVP, [0, 1, -1]); 
		gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer1);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer1.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer1);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer1.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer1);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer1.itemSize,
          gl.FLOAT,false, 0, 0);
        // Do the drawing for each part of shape
        gl.drawElements(gl.TRIANGLES, triangleIndices1.length, gl.UNSIGNED_BYTE, 0);
		
		//undo transforms from last side
		mat4.translate(tMVP,tMVP, [0, -1, 1]);
		mat4.rotateX(tMVP, tMVP, -angle3);
		mat4.translate(tMVP,tMVP, [0, 1, -1]); 
		gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		
		//rotate side
		var Trot2 = mat4.create();
		mat4.translate(Trot2, Trot2, [1, -1, 0]);
		mat4.rotateZ(Trot2, Trot2, -angle3);
		mat4.multiply(tMVP,tMVP,Trot2); 
		mat4.translate(tMVP,tMVP, [-1, 1, 0]); 
		gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer2);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer2.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer2);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer2.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer2.itemSize,
          gl.FLOAT,false, 0, 0);
        // Do the drawing for each part of shape
        gl.drawElements(gl.TRIANGLES, triangleIndices2.length, gl.UNSIGNED_BYTE, 0);

		//undo transforms from last side
		mat4.translate(tMVP,tMVP, [1, -1, 0]);
		mat4.rotateZ(tMVP, tMVP, angle3);
		mat4.translate(tMVP,tMVP, [-1, 1, 0]); 
		gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		
		//rotate side
		var Trot3 = mat4.create();
		mat4.translate(Trot3, Trot3, [0, -1, -1]);
		mat4.rotateX(Trot3, Trot3, -angle3);
		mat4.multiply(tMVP,tMVP,Trot3); 
		mat4.translate(tMVP,tMVP, [0, 1, 1]); 
		gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);

		gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer3);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer3.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer3);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer3.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer3);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer3.itemSize,
          gl.FLOAT,false, 0, 0);
        // Do the drawing for each part of shape
        gl.drawElements(gl.TRIANGLES, triangleIndices3.length, gl.UNSIGNED_BYTE, 0);
		
		//undo transforms from last side
		mat4.translate(tMVP,tMVP, [0, -1, -1]);
		mat4.rotateX(tMVP, tMVP, angle3);
		mat4.translate(tMVP,tMVP, [0, 1, 1]); 
		gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		
		//rotate side
		var Trot4 = mat4.create();
		mat4.translate(Trot4, Trot4, [-1, -1, 0]);
		mat4.rotateZ(Trot4, Trot4, angle3);
		mat4.multiply(tMVP,tMVP,Trot4); 
		mat4.translate(tMVP,tMVP, [1, 1, 0]); 
		gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer4);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer4.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer4);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer4.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer4);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer4.itemSize,
          gl.FLOAT,false, 0, 0);
        // Do the drawing for each part of shape
        gl.drawElements(gl.TRIANGLES, triangleIndices4.length, gl.UNSIGNED_BYTE, 0);
		
		//undo transforms from last side
		mat4.translate(tMVP,tMVP, [-1, -1, 0]);
		mat4.rotateZ(tMVP, tMVP, angle3);
		mat4.translate(tMVP,tMVP, [1, 1, 0]); 
		gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);

    }

    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
	slider3.addEventListener("input",draw);
    draw();
}

window.onload=start;