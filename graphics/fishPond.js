//Sage Fritz fishPond.js for CS 559
//fish pond with lily pads

function setup() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
	var tParam = 0;
	var wiggle = 0;
	var wiggleCount = 0;
	var move = 0;

    function draw() {
	canvas.width = canvas.width;
	function moveToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.lineTo(res[0],res[1]);}
	
	function background(color) {
		context.beginPath();
		context.fillStyle = color;
		context.rect(0, 0, 500, 500);
		context.fill();
	}
		
	function drawFish(color, color2, Tx) {
	    context.beginPath();
	    context.fillStyle = color;
		moveToTx([60,5],Tx);
	    lineToTx([60,-5],Tx);
	    lineToTx([30,-30],Tx);
		lineToTx([-20,-10],Tx);
		lineToTx([-20,10],Tx);
		lineToTx([30,30],Tx);
	    context.closePath();
	    context.fill();
		moveToTx([25, -25], Tx);
	    lineToTx([5, -40], Tx);
		lineToTx([20, -10], Tx);
		context.closePath();
		context.fill();
		moveToTx([25, 25], Tx);
		lineToTx([5, 40], Tx);
		lineToTx([20,10], Tx);
		context.closePath();
		context.fill();
		
		context.beginPath();
		context.fillStyle = color2;
		moveToTx([60,5],Tx);
		lineToTx([30, 30], Tx);
		lineToTx([-20, 10], Tx);
		lineToTx([-20, 0], Tx);
		lineToTx([10, 15], Tx);
		lineToTx([32, 5], Tx);
		context.closePath();
		moveToTx([30, -30], Tx);
		lineToTx([5, -20], Tx);
		lineToTx([10, -10], Tx);
		context.closePath();
		context.fill();
		
		context.beginPath();
		context.strokeStyle = "black";
		context.lineWidth = 5;
		moveToTx([50,10],Tx);
	    lineToTx([45,12],Tx);
		context.closePath();
		moveToTx([50,-10],Tx);
	    lineToTx([45,-12],Tx);
		context.closePath();
		context.stroke();
	}
	function drawTail(color, color2, Tx) {
	    context.beginPath();
	    context.fillStyle = color;
	    moveToTx([-15,10], Tx);
		lineToTx([-50,55],Tx);
		lineToTx([-40,15],Tx);
		lineToTx([-32,0],Tx);
		lineToTx([-40,-15],Tx);
		lineToTx([-50,-55],Tx);
		lineToTx([-15,-10],Tx);
	    context.closePath();
	    context.fill();
		
		context.beginPath();
		context.fillStyle = color2;
		moveToTx([-15,-10],Tx);
		lineToTx([-50, -55], Tx);
		lineToTx([-25, -5], Tx);
		context.closePath();
		context.fill();
	}
	
	var Rstart = 150.0;
	var Circle = function(t) {
	    var R = Rstart;
	    var x = R * Math.cos(2.0 * Math.PI * t);
	    var y = R * Math.sin(2.0 * Math.PI * t);
	    return [x,y];
	}
	var Tangent = function(t) {
		var R = Rstart;
		var x = -1 * R * 2.0 * Math.PI * Math.sin(2.0 * Math.PI * t);
		var y = R * 2.0 * Math.PI * Math.cos(2.0 * Math.PI * t);
		return [x,y];
	}
	
	function lilyPad(color, color2, Tx){
		context.beginPath();
		context.fillStyle = color; 
	    drawTrajectory(0,1.0,100,Circle,Tx, color);
		context.closePath();
		context.fill();
		context.beginPath();
		context.strokeStyle = color2; 
	    moveToTx([0,0], Tx);
		lineToTx([0, 50], Tx);
		context.closePath();
		context.stroke();
	}
	
	function bubble(color, color2, Tx){
		context.beginPath();
		context.strokeStyle = color;
		drawTrajectory(0, 1.0, 100, Circle, Tx, color);
		context.closePath();
		context.stroke();
		context.beginPath();
		context.strokeStyle = color2;
		moveToTx([0, 15], Tx);
		lineToTx([7, 7], Tx);
		context.closePath();
		context.stroke();
	}
	
	function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
	    context.fillStyle=color;
	    context.beginPath();
            moveToTx(C(t_begin),Tx);
            for(var i=1;i<=intervals;i++){
		var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
		lineToTx(C(t),Tx);
            }
            context.fill();
	}

	background("#3a6abd");
	
	var Tpath = mat3.create();
	mat3.fromTranslation(Tpath,[250,250]);
	mat3.scale(Tpath,Tpath,[1.3,-1]); // Flip the Y-axis
	mat3.rotate(Tpath, Tpath, 180);
	drawTrajectory(0,1.0,100,Circle,Tpath,"#2d5fb5");
	
	var Tback = mat3.create();
	mat3.fromTranslation(Tback, [100 + move, 100]);
	drawFish("#36445c", "#556580", Tback);
	drawTail("#36445c", "#556580", Tback);
	
	mat3.fromTranslation(Tback, [25 + move, 250]);
	drawFish("#36445c", "#556580", Tback);
	drawTail("#36445c", "#556580", Tback);
	
	mat3.fromTranslation(Tback, [400 + move, 260]);
	drawFish("#36445c", "#556580", Tback);
	drawTail("#36445c", "#556580", Tback);
	
	mat3.fromTranslation(Tback, [250 + move, 420]);
	drawFish("#36445c", "#556580", Tback);
	drawTail("#36445c", "#556580", Tback);
	
	mat3.fromTranslation(Tback, [(-200) + move, 380]);
	drawFish("#36445c", "#556580", Tback);
	drawTail("#36445c", "#556580", Tback);
	
	mat3.fromTranslation(Tback, [(-300) + move, 200]);
	drawFish("#36445c", "#556580", Tback);
	drawTail("#36445c", "#556580", Tback);
	
	move = (move % 400) + 0.5;
	
	var TfishToPath = mat3.create();
	mat3.fromTranslation(TfishToPath, Circle(tParam));
	mat3.scale(TfishToPath,TfishToPath,[0.77,1]);
	
	var Tfish = mat3.create();
	mat3.multiply(Tfish, Tpath, TfishToPath);
	var tan = Tangent(tParam);
	var angle = Math.atan2(tan[1], tan[0]);
	mat3.rotate(Tfish, Tfish, angle);
	mat3.scale(Tfish, Tfish, [1.5, 1.3]);
	drawFish("white", "orange", Tfish);
	var Ttail = mat3.create();
	mat3.rotate(Ttail, Tfish, wiggle);
	drawTail("white", "orange", Ttail);
	
	var Tfish2 = mat3.create();
	mat3.fromTranslation(Tfish2, [140, 50]);
	mat3.multiply(Tfish2, Tfish2, Tfish); 
	mat3.scale(Tfish2, Tfish2, [0.5, -0.5]);
	drawFish("white", "orange", Tfish2);
	var Ttail2 = mat3.create();
	mat3.rotate(Ttail2, Tfish2, wiggle);
	drawTail("white", "orange", Ttail2);
	
	var Tfish3 = mat3.create();
	mat3.rotate(Tpath, Tpath, 180);
	mat3.multiply(Tfish3, Tpath, TfishToPath);
	mat3.rotate(Tfish3, Tfish3, angle);
	mat3.scale(Tfish3, Tfish3, [1, 0.9]);
	drawFish("white", "orange", Tfish3);
	var Ttail3 = mat3.create();
	mat3.rotate(Ttail3, Tfish3, wiggle);
	drawTail("white", "orange", Ttail3);
	
	tParam = tParam + 0.001;
	if (wiggleCount < 20){
	       wiggle = wiggle + 0.01;
		   wiggleCount++;		    
	   }
	   else if (wiggleCount < 60){
	       wiggle = wiggle - 0.01;
		   wiggleCount++;
	   }
	   else if (wiggleCount < 80){
	       wiggle = wiggle + 0.01;
		   wiggleCount++;
	   }
	   else{
		   wiggleCount = 0;
	   }
	   
	Rstart = 15;
	var Tbubble = mat3.create();
	mat3.fromTranslation(Tbubble, Circle((tParam * 5)));
	mat3.multiply(Tbubble, Tbubble, Tfish);
	mat3.rotate(Tbubble, Tbubble, -angle);
	mat3.translate(Tbubble, Tbubble, [0,50]);
	mat3.scale(Tbubble,Tbubble,[1,0.77]);
	bubble("#7093cf", "#bad0f5", Tbubble);
	mat3.translate(Tbubble, Tbubble, [30,30]);
	mat3.scale(Tbubble,Tbubble,[0.4,0.4]);
	bubble("#93aedb", "#c0d6fa", Tbubble);
	
	var Tbubble2 = mat3.create();
	mat3.fromTranslation(Tbubble2, Circle((tParam * 4)));
	mat3.multiply(Tbubble2, Tbubble2, Tfish3);
	mat3.rotate(Tbubble2, Tbubble2, -angle);
	mat3.translate(Tbubble2, Tbubble2, [0,50]);
	mat3.scale(Tbubble2,Tbubble2,[1,0.77]);
	bubble("#7093cf", "#bad0f5", Tbubble2);
	
	Rstart = 50;
	
	var Tlily = mat3.create();
	mat3.translate(Tlily, Tlily, [40,400]);
	mat3.scale(Tlily,Tlily,[1,0.77]);
	mat3.rotate(Tlily, Tlily, angle);
	lilyPad("#508c3f", "#93d182", Tlily);
	mat3.translate(Tlily, Tlily, [100,100]);
	mat3.scale(Tlily,Tlily,[0.3,0.3]);
	lilyPad("#508c3f", "#93d182", Tlily);
	
	var Tlily2 = mat3.create();;
	mat3.fromTranslation(Tlily2, Circle(tParam));
	mat3.multiply(Tlily2, Tlily2, Tfish);
	mat3.fromTranslation(Tlily2, [200, 200])
	mat3.rotate(Tlily2, Tlily2, -angle);
	mat3.scale(Tlily2,Tlily2,[1.2,1.2]);
	lilyPad("#68a656", "#93d182", Tlily2);
	mat3.fromTranslation(Tlily2, [350, 350]);
	mat3.scale(Tlily2,Tlily2,[1.5,1.5]);
	mat3.rotate(Tlily2, Tlily2, angle);
	lilyPad("#68a656", "#93d182", Tlily2);
	mat3.translate(Tlily2, Tlily2, [50,50]);
	mat3.scale(Tlily2,Tlily2,[0.3,0.3]);
	lilyPad("#508c3f", "#93d182", Tlily2);
	
    window.requestAnimationFrame(draw);
	}
    window.requestAnimationFrame(draw);
}
window.onload = setup;