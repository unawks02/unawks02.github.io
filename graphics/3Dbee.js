//Project 5 Sage Fritz

function setup() {
    var observerCanvas = document.getElementById('observerCanvas');
    var cameraCanvas = document.getElementById('cameraCanvas');
    var observerContext = observerCanvas.getContext('2d');
    var cameraContext = cameraCanvas.getContext('2d');
    var slider = document.getElementById('slider');
    slider.value = 0;
	var tParam = 0;
	var flutter = 0;
	var flutterCount = 0;

    var context = cameraContext; // default to drawing in the camera window

    function draw() {
      
    // clear both canvas instances
	observerCanvas.width = observerCanvas.width;
	cameraCanvas.width = cameraCanvas.width;

	// use the sliders to get the angles
    var viewAngle = slider.value*0.02*Math.PI;
     
	function moveToTx(loc,Tx)
	{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}
	
    function drawCamera(color,TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);
        context.beginPath();
	    context.strokeStyle = color;
        // Twelve edges of a cropped pyramid
        moveToTx([-3,-3,-2],Tx);lineToTx([3,-3,-2],Tx);
        lineToTx([3,3,-2],Tx);lineToTx([-3,3,-2],Tx);
        moveToTx([3,-3,-2],Tx);lineToTx([2,-2,0],Tx);
        lineToTx([2,2,0],Tx);lineToTx([3,3,-2],Tx);
        moveToTx([2,-2,0],Tx);lineToTx([-2,-2,0],Tx);
        lineToTx([-2,2,0],Tx);lineToTx([2,2,0],Tx);
        moveToTx([-2,-2,0],Tx);lineToTx([-3,-3,-2],Tx);
        lineToTx([-3,3,-2],Tx);lineToTx([-2,2,0],Tx);
        context.stroke();
    }

    function drawUVWAxes(color,TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);

        context.strokeStyle=color;
	    context.beginPath();
	    // Axes
	    moveToTx([1.2,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,1.2,0],Tx);
        moveToTx([0,0,0],Tx);lineToTx([0,0,1.2],Tx);
	    // Arrowheads
	    moveToTx([1.1,.05,0],Tx);lineToTx([1.2,0,0],Tx);lineToTx([1.1,-.05,0],Tx);
	    moveToTx([.05,1.1,0],Tx);lineToTx([0,1.2,0],Tx);lineToTx([-.05,1.1,0],Tx);
      	moveToTx([.05,0,1.1],Tx);lineToTx([0,0,1.2],Tx);lineToTx([-.05,0,1.1],Tx);
	    // U-label
        moveToTx([1.3,.05,0],Tx);lineToTx([1.3,-.035,0],Tx);lineToTx([1.35,-.05,0],Tx);
        lineToTx([1.4,-.035,0],Tx);lineToTx([1.4,.05,0],Tx);
        // V-label
        moveToTx([-.05,1.4,0],Tx);lineToTx([0,1.3,0],Tx);lineToTx([.05,1.4,0],Tx);
	    // W-label
	    moveToTx([-.1,0,1.3],Tx);lineToTx([-.05,0,1.4],Tx);lineToTx([-0,0,1.3],Tx);
	    lineToTx([.05,0,1.4],Tx);lineToTx([.1,0,1.3],Tx);

	    context.stroke();
	}

    function drawUpVector(color,vecUp,Tx) {
	    context.strokeStyle=color;
	    context.beginPath();
	    // A single line segment in the "up" direction
	    moveToTx([0,0,0],Tx);
        lineToTx(vecUp,Tx);
	    context.stroke();
    }
    
	var Tangent = function(t) {
		var vect = dcomp(t);
		return vect;
	}
	
	var dBspline = function(t){
		return [
		(1./6.)*(-3*t*t+6*t-3),
		(1./6.)*(9*t*t-12*t),
		(1./6.)*(-9*t*t+6*t+3),
		(1./6.)*3*t*t
	    ];
	}
	
	var Bspline = function(t) {
	    return [
		(1./6.)*(-t*t*t+3*t*t-3*t+1),
		(1./6.)*(3*t*t*t-6*t*t+4),
		(1./6.)*(-3*t*t*t+3*t*t+3*t+1),
		(1./6.)*t*t*t
	    ];
	}
	
	function Cubic(basis,P,t){
	    var b = basis(t);
	    var result=vec3.create();
	    vec3.scale(result,P[0],b[0]);
	    vec3.scaleAndAdd(result,result,P[1],b[1]);
	    vec3.scaleAndAdd(result,result,P[2],b[2]);
	    vec3.scaleAndAdd(result,result,P[3],b[3]);
	    return result;
	}
	
	var p0=[0,0,0];
	var p1=[150, -120,-50];
	var p2=[250, 0,-100];
	var p3=[150, 120,50];
	var p4=[-150, -120,-50];
	var p5=[-250, 0,100];
	var p6=[-150, 120,50];

	var P0 = [p6, p0, p1, p2];
	var P1 = [p0, p1, p2, p3];
	var P2 = [p1, p2, p3, p0];
	var P3 = [p2, p3, p0, p4];
	var P4 = [p3, p0, p4, p5];
	var P5 = [p0, p4, p5, p6];
	var P6 = [p4, p5, p6, p0];
	var P7 = [p5, p6, p0, p1];
	
	var C0 = function(t_) {return Cubic(Bspline,P0,t_);};
	var C1 = function(t_) {return Cubic(Bspline,P1,t_);};
	var C2 = function(t_) {return Cubic(Bspline,P2,t_);};
	var C3 = function(t_) {return Cubic(Bspline,P3,t_);};
	var C4 = function(t_) {return Cubic(Bspline,P4,t_);};
	var C5 = function(t_) {return Cubic(Bspline,P5,t_);};
	var C6 = function(t_) {return Cubic(Bspline,P6,t_);};
	var C7 = function(t_) {return Cubic(Bspline,P7,t_);};

	var Ccomp = function(t) {
            if (t<1){
		var u = t;
		return C0(u);
            } else if (t<2){
		var u = t-1.0;
		return C1(u);
		    } else if (t<3){
		var u = t-2.0;
		return C2(u);
		    } else if (t<4){
		var u = t-3.0;
		return C3(u);
		    } else if (t<5){
		var u = t-4.0;
		return C4(u);
		    } else if (t<6){
		var u = t-5.0;
		return C5(u);
		    } else if (t<7){
		var u = t-6.0;
		return C6(u);
            } else {
		var u = t-7.0;
		return C7(u);
            }          
	}
	
	var d0 = function(t_) {return Cubic(dBspline,P0,t_);};
	var d1 = function(t_) {return Cubic(dBspline,P1,t_);};
	var d2 = function(t_) {return Cubic(dBspline,P2,t_);};
	var d3 = function(t_) {return Cubic(dBspline,P3,t_);};
	var d4 = function(t_) {return Cubic(dBspline,P4,t_);};
	var d5 = function(t_) {return Cubic(dBspline,P5,t_);};
	var d6 = function(t_) {return Cubic(dBspline,P6,t_);};
	var d7 = function(t_) {return Cubic(dBspline,P7,t_);};
	
	var dcomp = function(t) {
            if (t<1){
		var u = t;
		return d0(u);
            } else if (t<2){
		var u = t - 1.0;
		return d1(u);
		    } else if (t<3){
		var u = t - 2.0;
		return d2(u);
		    } else if (t<4){
		var u = t - 3.0;
		return d3(u);
		    } else if (t<5){
		var u = t - 4.0;
		return d4(u);
		    } else if (t<6){
		var u = t - 5.0;
		return d5(u);
		    } else if (t<7){
		var u = t - 6.0;
		return d6(u);
            } else {
		var u = t - 7.0;
		return d7(u);
            }          
	}
	
	function infinity(Tx, color){
		drawTrajectory(0.0,1.0,100,C0,Tx,color);
		drawTrajectory(0.0,1.0,100,C1,Tx,color);
		drawTrajectory(0.0,1.0,100,C2,Tx,color);
		drawTrajectory(0.0,1.0,100,C3,Tx,color);
		drawTrajectory(0.0,1.0,100,C4,Tx,color);
		drawTrajectory(0.0,1.0,100,C5,Tx,color);
		drawTrajectory(0.0,1.0,100,C6,Tx,color);
		drawTrajectory(0.0,1.0,100,C7,Tx,color);
	}
	

    var CameraCurve = function(angle) {
        var distance = 120.0;
        var eye = vec3.create();
        eye[0] = distance*Math.sin(viewAngle);
        eye[1] = 40;
        eye[2] = distance*Math.cos(viewAngle);  
        return [eye[0],eye[1],eye[2]];
    }

    function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
        moveToTx(C(t_begin),Tx);
        for(var i=1;i<=intervals;i++){
            var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
            lineToTx(C(t),Tx);
        }
        context.stroke();
	}
	
	function background(color, Tx) {
		context.beginPath();
		context.fillStyle = color;
		moveToTx([-400,0,-400], Tx);
		lineToTx([400, 0, -400], Tx);
		lineToTx([400, 0, 400], Tx);
		lineToTx([-400, 0, 400], Tx);
		context.closePath();
		context.fill();
	}
	
	function flowers(Tx){
		colors = ["#dbb6e0", "#b57dbd", "#a15cab", "#bb7cc4"];
		let index = 0;
		for (let i = -300; i < 300; (i = i + 100)){
			for (let j = -300; j < 200; (j = j + 150)){
				let color = colors[index];
				index = (index + 1) % 3;
				plants(i, j, color, Tx);
			}
	   }
	}
	
	function plants(i, j, color, Tx){
		context.beginPath();
		context.strokeStyle = "black";
		context.fillStyle = color;
		moveToTx([i + 25, 0, j], Tx);
		lineToTx([i + 25, 60,j], Tx); //stem
		
		lineToTx([i + 45, 80,j], Tx);
		lineToTx([i + 35, 100,j], Tx);
		lineToTx([i + 25, 60,j], Tx);
		
		lineToTx([i + 40, 80,j-12], Tx);
		lineToTx([i + 35, 100,j], Tx);
		lineToTx([i + 25, 60,j], Tx);
		
		lineToTx([i + 40, 80,j+12], Tx);
		lineToTx([i + 35, 100,j], Tx);
		lineToTx([i + 25, 60,j], Tx);
		
		lineToTx([i + 5, 80,j], Tx);
		lineToTx([i + 15, 100,j], Tx);
		lineToTx([i + 25, 60,j], Tx);
		
		lineToTx([i, 80,j -12], Tx);
		lineToTx([i + 15, 100,j], Tx);
		lineToTx([i + 25, 60,j], Tx);
		
		lineToTx([i, 80,j +12], Tx);
		lineToTx([i + 15, 100,j], Tx);
		lineToTx([i + 25, 60,j], Tx);
		context.closePath();
		context.fill();
		context.stroke();
		
		context.beginPath();
		context.strokeStyle = "black";
		context.fillStyle = color;
		moveToTx([i + 75, 0, j+50], Tx);
		lineToTx([i + 75, 40, j+50], Tx); //stem
		
		lineToTx([i + 95, 60, j+50], Tx);
		lineToTx([i + 85, 80, j+50], Tx);
		lineToTx([i + 75, 40, j+50], Tx);
		
		lineToTx([i + 90, 60, j+50-12], Tx);
		lineToTx([i + 85, 80, j+50], Tx);
		lineToTx([i + 75, 40, j+50], Tx);
		lineToTx([i + 90, 60, j+50+12], Tx);
		lineToTx([i + 85, 80, j+50], Tx);
		lineToTx([i + 75, 40, j+50], Tx);
		
		lineToTx([i + 55, 60, j+50], Tx);
		lineToTx([i + 65, 80, j+50], Tx);
		lineToTx([i + 75, 40, j+50], Tx);
		lineToTx([i + 50, 60, j+50-12], Tx);
		lineToTx([i + 65, 80, j+50], Tx);
		lineToTx([i + 75, 40, j+50], Tx);
		lineToTx([i + 50, 60, j+50+12], Tx);
		lineToTx([i + 65, 80, j+50], Tx);
		lineToTx([i + 75, 40, j+50], Tx);
		context.closePath();
		context.fill();
		context.stroke();
	}
	
	function bee(Tx, color, x) {
		context.lineWidth = x;
		context.fillStyle = color;
		context.strokeStyle = "black";
		//base is rectangle
		context.beginPath();
		moveToTx([-30, -15, 0], Tx);
		lineToTx([30, -15, 0], Tx);
		lineToTx([30, 15, 0], Tx);
		lineToTx([-30, 15, 0], Tx);
		lineToTx([-30, -15, 0], Tx);
		
		context.closePath();
		context.fill();
		context.stroke();
		
		//draw stripes
		context.strokeStyle = "black";
		context.lineWidth = 5 * x;
		context.beginPath();
		moveToTx([0, -15,0], Tx);
		lineToTx([0, 15,0], Tx);
		moveToTx([-20, -15,0], Tx);
		lineToTx([-20, 15,0], Tx);
		context.stroke();
		
		context.fillStyle = "black";
		context.beginPath();
		moveToTx([-30, 5,0], Tx);
		lineToTx([-35, 0,0], Tx);
		lineToTx([-30, -5,0], Tx);
		context.closePath();
		context.fill();
		
		context.lineWidth = (x + x/2);
		context.beginPath();
		moveToTx([20, 5,0], Tx);
		lineToTx([20, 10,0], Tx);
		moveToTx([30, -10,0], Tx);
		lineToTx([25, -10,0], Tx);
		lineToTx([20, -5,0], Tx);
		context.stroke();
	}
	
	function wing(Tx, x){
		context.fillStyle = "white";
		context.strokeStyle = "black";
		context.lineWidth=2;
		//triangle set onto bee's top middle 
		context.beginPath();
		moveToTx([0, 15, 0], Tx);
		lineToTx([-25, 20, 5 * x], Tx);
		lineToTx([-25, 25, 20 * x], Tx);
		lineToTx([0, 15, 0], Tx);
		
		context.closePath();
		context.fill();
		context.stroke();
	}
	
	function sky(color, Tx){
		context.beginPath();
		context.fillStyle = color;
		moveToTx([-400,400,-400], Tx);
		lineToTx([400, 400, -400], Tx);
		lineToTx([400, -50, -400], Tx);
		lineToTx([-400, -50, -400], Tx);
		context.closePath();
		context.fill();
		context.beginPath();
		context.fillStyle = color;
		moveToTx([-400,400,-400], Tx);
		lineToTx([-400, 400, 400], Tx);
		lineToTx([-400, -50, 400], Tx);
		lineToTx([-400, -50, -400], Tx);
		context.closePath();
		context.fill();
	}
	
    // create two lookAt transforms; one for the camera
    // and one for the "external observer"

    // Create Camera (lookAt) transform
     var eyeCamera = CameraCurve(viewAngle);
    var targetCamera = vec3.fromValues(0,0,0); // Aim at the origin of the world coords
    var upCamera = vec3.fromValues(0,100,0); // Y-axis of world coords to be vertical
	var TlookAtCamera = mat4.create();
    mat4.lookAt(TlookAtCamera, eyeCamera, targetCamera, upCamera);
      
    // Create Camera (lookAt) transform
    var eyeObserver = vec3.fromValues(500,300,500);
    var targetObserver = vec3.fromValues(0,0,0); // Observer still looks at origin
    var upObserver = vec3.fromValues(0,1,0); // Y-axis of world coords to be vertical
	var TlookAtObserver = mat4.create();
    mat4.lookAt(TlookAtObserver, eyeObserver, targetObserver, upObserver);
      
    // Create ViewPort transform (assumed the same for both canvas instances)
    var Tviewport = mat4.create();
	mat4.fromTranslation(Tviewport,[250,300,0]);  // Move the center of the
                                                  // "lookAt" transform (where
                                                  // the camera points) to the
                                                  // canvas coordinates (200,300)
	mat4.scale(Tviewport,Tviewport,[100,-100,1]); // Flip the Y-axis,
                                                  // scale everything by 100x
    // make sure you understand these    

    context = cameraContext;

    // Create Camera projection transform
    // (orthographic for now)
    var TprojectionCamera = mat4.create();
    mat4.ortho(TprojectionCamera,-100,100,-100,100,-1,1);
    //mat4.perspective(TprojectionCamera,Math.PI/4,1,-1,1); // Use for perspective teaser!

    // Create Observer projection transform
    var TprojectionObserver = mat4.create();
    mat4.ortho(TprojectionObserver,-120,120,-120,120,-1,1);
     
    // Create transform t_VP_PROJ_CAM that incorporates
    // Viewport, projection and camera transforms
    var tVP_PROJ_VIEW_Camera = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_Camera,Tviewport,TprojectionCamera);
    mat4.multiply(tVP_PROJ_VIEW_Camera,tVP_PROJ_VIEW_Camera,TlookAtCamera);
    var tVP_PROJ_VIEW_Observer = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_Observer,Tviewport,TprojectionObserver);
    mat4.multiply(tVP_PROJ_VIEW_Observer,tVP_PROJ_VIEW_Observer,TlookAtObserver);
      
	// Create model(ing) transform
    // (from moving object to world)
    var Tmodel = mat4.create();
	mat4.fromTranslation(Tmodel,Ccomp(tParam));

    // Create transform t_VP_PROJ_VIEW_MOD that incorporates
    // Viewport, projection, camera, and modeling transform
    var tVP_PROJ_VIEW_MOD_Camera = mat4.create();
	mat4.multiply(tVP_PROJ_VIEW_MOD_Camera, tVP_PROJ_VIEW_Camera, Tmodel);
    var tVP_PROJ_VIEW_MOD1_Observer = mat4.create();
	mat4.multiply(tVP_PROJ_VIEW_MOD1_Observer, tVP_PROJ_VIEW_Observer, Tmodel);
    var tVP_PROJ_VIEW_MOD2_Observer = mat4.create();
    mat4.translate(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_Observer, eyeCamera);
	var TlookFromCamera = mat4.create();
    mat4.invert(TlookFromCamera,TlookAtCamera);
    mat4.multiply(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_MOD2_Observer, TlookFromCamera);

    // Draw the following in the Camera window
    context = cameraContext;
	var TskyC = mat4.clone(tVP_PROJ_VIEW_Camera);
	mat4.rotate(TskyC, TskyC, viewAngle, [0,400,0]);
	sky("#628ab3", TskyC);
	background("#9ed9b6", tVP_PROJ_VIEW_Camera);
	//tried having this rotate with camera, couldn't get it to work
	flowers(tVP_PROJ_VIEW_Camera);
	var TinfinityC = mat4.create();
	mat4.translate(TinfinityC, tVP_PROJ_VIEW_Camera, [0, 200, 0]);
	infinity(TinfinityC,"#dbb6e0");
	var TbeeToPath = mat4.create();
	mat4.fromTranslation(TbeeToPath, Ccomp(tParam));
	
	var TbeeC = mat4.create();
	mat4.multiply(TbeeC, TinfinityC, TbeeToPath);
	var tan = Tangent(tParam); 
	var angle = Math.atan2(tan[1], tan[0]);
	mat4.rotateZ(TbeeC, TbeeC, angle);
	bee(TbeeC, "#fcef65", 2);
	
	var TwingC = mat4.create();
	mat4.copy(TwingC, TbeeC);
	mat4.rotateY(TwingC, TwingC, -flutter);
	wing(TwingC, 1);
	mat4.rotateY(TwingC, TwingC, flutter);
	mat4.rotateY(TwingC, TwingC, flutter);
	wing(TwingC, -1);
      
    // Draw the following in the Observer window
    context = observerContext;
	sky("#628ab3", tVP_PROJ_VIEW_Observer);
	background("#9ed9b6", tVP_PROJ_VIEW_Observer);
	flowers(tVP_PROJ_VIEW_Observer);	
	// tried drawing this didnt work 
    var TinfinityO = mat4.create();
	mat4.translate(TinfinityO, tVP_PROJ_VIEW_Observer, [0, 200, 0]);
    infinity(TinfinityO,"#b57dbd");
    drawCamera("purple",tVP_PROJ_VIEW_MOD2_Observer,10.0); 
	drawUVWAxes("purple",tVP_PROJ_VIEW_MOD2_Observer,100.0);	
	var TbeeO = mat4.create();
	mat4.multiply(TbeeO, TinfinityO, TbeeToPath);
	mat4.rotateZ(TbeeO, TbeeO, angle);
	bee(TbeeO, "#fcef65", 2);
	
	var TwingO= mat4.create();
	mat4.copy(TwingO, TbeeO);
	mat4.rotateY(TwingO, TwingO, -flutter);
	wing(TwingO, 1);
	mat4.rotateY(TwingO, TwingO, flutter);
	mat4.rotateY(TwingO, TwingO, flutter);
	wing(TwingO, -1);
	
	if (flutterCount < 5){
		flutter = flutter + 0.1;
	} else if (flutterCount < 15){
		flutter = flutter - 0.1;
	} else if (flutterCount < 20){
		flutter = flutter + 0.1;
	} else {
		flutterCount = 0;
		flutter = 0;
	}
	flutterCount++;
	tParam = (tParam + 0.01) % 8;
    window.requestAnimationFrame(draw);
	}
    window.requestAnimationFrame(draw);
  
}
window.onload = setup;