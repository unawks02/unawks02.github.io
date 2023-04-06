//Sage Fritz starship.js for CS 559
//starship robot moves across screen to person then opens

function setup() {
	var canvas = document.getElementById('myCanvas');
	var counter = 0;
	var move = 0;
	var wheels = 0;
	var flag = 0;
	var flagCount = 0;


	function draw(){
	   var context = canvas.getContext('2d');
	   context.lineWidth = 2;

	   function Background(){
		 //draw sky
		 context.fillStyle = "#3c486e"; //sky color
		 context.beginPath();
		 context.rect(0,0,1000,400); //x,y,width,height
		 context.fill();
		  
		 //draw ground
		 context.fillStyle = "#a7a8a8"; //ground color
		 context.beginPath();
		 context.rect(0,380,1000,400);		 //x,y,width,height
		 context.fill();
		 
		 context.strokeStyle = "black";
		 context.beginPath();
		 context.moveTo(0,380);
		 context.lineTo(1000, 380);
		 context.stroke();
		 
		 context.fillStyle = "#a5aab8";
		 context.beginPath();
		 context.arc(140, 100, 30, 0, 2 * Math.PI);
		 context.arc(180, 100, 50, 0, 2 * Math.PI);
		 context.arc(220, 100, 30, 0, 2 * Math.PI);
		 context.fill();
		 context.beginPath();
		 context.arc(500, 150, 30, 0, 2 * Math.PI);
		 context.arc(550, 150, 60, 0, 2 * Math.PI);
		 context.arc(600, 150, 30, 0, 2 * Math.PI);
		 context.fill();
		 context.beginPath();
		 context.arc(800, 60, 20, 0, 2 * Math.PI);
		 context.arc(830, 60, 40, 0, 2 * Math.PI);
		 context.arc(860, 60, 20, 0, 2 * Math.PI);
		 context.fill();
	   }

	   function DrawBody(){
		 //draw shape of body
		 context.strokeStyle = "black";
		 context.fillStyle = "white";
		 context.beginPath();
		 context.moveTo(840,350);
		 context.lineTo(960, 350);
		 context.lineTo(970, 340);
		 context.lineTo(970, 240);
		 context.lineTo(830, 240);
		 context.lineTo(830, 340);
		 context.closePath();
		 context.fill();
		 context.stroke();
		 
		 context.fillStyle = "black";
		 context.beginPath();
		 context.rect(830, 240, 40, 30);
		 context.rect(830, 240, 140, 10);
		 context.fill();
		 
		 context.fillStyle ="yellow";
		 context.strokeStyle = "black";
		 context.beginPath();
		 context.rect(830, 320, 10, 20);
		 context.stroke();
		 context.fill();
		 
		 context.fillStyle ="yellow";
		 context.strokeStyle = "black";
		 context.beginPath();
		 context.moveTo(820, 330);
		 context.lineTo(820,320);
		 context.lineTo(710, 310);
		 context.lineTo(710, 360);
		 context.closePath();
		 context.stroke();
		 context.fill();
		 
		 context.fillStyle= "#525050"; //a dark grey
		 context.strokeStype = "black";
		 context.beginPath();
		 context.moveTo(830,340);
		 context.lineTo(845,310);
		 context.lineTo(970, 310);
		 context.lineTo(970, 340);
		 context.lineTo(960, 350);
		 context.lineTo(840, 350);
		 context.closePath();
		 context.fill();
		 context.stroke();
	   }
	   
	   function Wheel(x){
		 context.fillStyle = "black";
		 context.beginPath();
		 context.arc(x, 0, 25, 0, 2 * Math.PI); //center x,y, radius, 0, 2* Math.PI)
		 context.fill();
		 context.strokeStyle = "yellow";
		 context.beginPath();
		 context.arc(x, 0, 18, 0, 2 * Math.PI);
		 context.moveTo(x, 0);
		 context.lineTo(x, -20);
		 context.stroke();
	   }
	   
	   function DrawFlag(){
		  //draw 1 flag relative to body
		  context.strokeStyle = "black";
		  context.fillStyle = "orange";
		  context.beginPath();
		  context.moveTo(0, 0)
		  context.lineTo(0, -150);
		  context.lineTo(50, -130);
		  context.lineTo(0, -100);
		  context.fill();
		  context.stroke();
		  
		  context.fillStyle ="yellow";
		  context.beginPath();
		  context.rect(3, -142, 5, 30);
		  context.fill();
	   }
	   
	   function DrawTop(){
		 //draw top relative to body
		 context.strokeStyle = "black";
		 context.fillStyle = "white";
		 context.beginPath();
		 context.moveTo(970, 240);
		 context.lineTo(960, 230);
		 context.lineTo(840, 230);
		 context.lineTo(830, 240);
		 context.closePath();
		 context.fill();
		 context.stroke();

	   }

	   Background();
	   context.save();
	  if (counter < 250){
		   move = (move + 4);
		   counter++;
	   }
	   else{
		   for(var i = 0; i < counter; i++){
			   context.restore();
		   }
		   counter = 0;
		   move = 0;}
	   context.translate((0 - move), 0);
	   DrawBody();
	   context.save();

	   context.translate(845, 355);
	   context.rotate(wheels);
	   Wheel(0);
	   context.restore();
	   context.save();
	   context.translate(895, 355);
	   context.rotate(wheels);
	   Wheel(0);
	   context.restore();
	   context.save();
	   context.translate(940, 355);
	   context.rotate(wheels);
	   Wheel(0);
	   context.restore();
	   context.save();
	   
	   wheels = wheels + 0.3;
	   context.restore(); //restore body
	   context.save(); //re-save body
	   
	   //rotate to bounce left and right 
	   context.translate(940, 230);
	   context.rotate(flag);
	   if (flagCount < 20){
	       flag = flag + 0.02;
		   flagCount++;		    
	   }
	   else if (flagCount < 40){
	       flag = flag - 0.02;
		   flagCount++;
	   }
	   else if (flagCount < 50){
	       flag = flag + 0.01;
		   flagCount++;
	   }
	   else if (flagCount < 60){
	       flag = flag - 0.01;
		   flagCount++;
	   }
	   else{
		   flagCount = 0;
	   }
	   DrawFlag();
	   context.restore();
	   DrawTop();
	   context.restore();
	   
	   window.requestAnimationFrame(draw); 
	   }
	   window.requestAnimationFrame(draw);
}
window.onload = setup;