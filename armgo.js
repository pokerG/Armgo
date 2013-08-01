// Preferences
var Fz = 20;

// Global Variables
var c = eid("canvas");
var cxt = c.getContext("2d");
var ctime;				// main game timer
var Mission;			// Mission Canvas Object
var ns = eid("ns");		// debug message
var state = [];			// the state of stage

var ms = {
	down : false
};

var CELL = {
	x : 30,
	y : 30
}

var BAG = {
	x : 580,
	y : 300,
	r : 300,
	c : 200
}

var GOALM = {
	x : 40,
	y : 100
}

var STATE = {
	x : GOALM.x + CELL.x * 8.5,
	y : 100
}

var arm = new ARM();
var cope = new COPE(1);
var missionList = new MISSIONLIST();

function COPE(v){
	this.x = 50;
	this.y = 50;
	this.width = 40;
	this.height = this.width;
	this.value = v;
}

function ARM(){
	this.leftz = STATE.x - CELL.x - 12;
	this.topz = STATE.y;
	this.bottonz = STATE.y + CELL.y * 12;
	this.x = this.leftz;
	this.y = this.topz;
	this.r = 1;
	this.speed = 6;
	this.color = '#00ff00';
	this.hand = 0;
	this.right = function(){
		var i = 6;
		while ( i>0 && state[this.r-1][i-1] != 0 ) i--;
		this.goRight(STATE.x+CELL.x*i);
	}
	this.left = function(){
		this.x -= this.speed ;
		if ( this.x > this.leftz ){
			setTimeout('arm.left()',Fz);
		}
	}
	this.up = function(){
		if ( this.r == 1 ) return ;
		this.y -= this.speed ;
		if (this.y > (STATE.y+CELL.y*(this.r-2)*2) ) {
			setTimeout('arm.up()',Fz);
		}else {
			this.r --;
		}
	}
	this.down = function(){
		if ( this.r == 6 ) return ;
		this.y += this.speed ;
		if ( this.y < ( STATE.y+CELL.y*(this.r*2))) {
			setTimeout('arm.down()',Fz);
		}else {
			this.r ++ ;
		}
	}
	this.goRight = function(x){
		this.x 	+= this.speed ;
		if ( this.x + (this.hand > 0)*CELL.x  < x ){
			setTimeout('arm.goRight('+x+')',Fz);
		}if ( this.x + (this.hand > 0)*CELL.x  == x ){
			
			var i = 6;
			while ( i>0 && state[this.r-1][i-1] != 0 ) i--;	// i <- first CELL	
			
			// fall
			if (i>0 && this.hand>0 ){
				state[this.r-1][i-1] = this.hand;
				this.hand = 0;
			}
			else 
			// catch
			if (i<6 && this.hand==0 && state[this.r-1][i] != 0){
				this.hand = state[this.r-1][i];
				state[this.r-1][i] = 0;
			}
			
			this.left();
			setTimeout('checkAns()',200);
		}
	}
}

function MISSIONLIST(){
	this.tot = 1;
	this.startRow = 100;
	this.endRow = c.width;
	this.startCol = 100;
	this.endCol = c.height;
	this.show = function(){
		alert(this.startRow);
		cxt.fillStyle = '#000';
		cxt.fillRect(0,0,c.width,c.height);
		/*
		for ( i=this.startCol; i<this.endCol; i+=cope.height*2){
			for ( j=this.startRow; j<this.endRow; j+=cope.width*2){
				drawCope(j,i,1);
			}
		}
		*/
		for ( i=100; i<300; i+=cope.height*2){
			for ( j=100; j<500; j+=cope.width*2){
				drawCope(j,i,1);
			}
		}
	}
}

function eid(x){
	return document.getElementById(x);
}

function ename(x){
	return document.getElementsByName(x)[0];
}

function initVal(v){
	Mission = v;
	for ( i=0; i<6; i++){
		state[i] = [];
		for ( j=0; j<6; j++){
			state[i][j] = startM[Mission][i][j];
		}
	}
	flashMap(v);
}

function flashMap(){
	cxt.clearRect(0,0,c.width,c.height);
	drawBg();
	drawGoal();
	drawState();
	drawArm();
	drawBAG();
	setTimeout('flashMap()',Fz);
}

function drawHello(){
	cxt.fillStyle = "#000";
	cxt.fillRect(0,0,c.width,c.height);
	var gradient=cxt.createLinearGradient(0,c.height/2-35,0,c.height/2+35);
	gradient.addColorStop("0","#fff");
	gradient.addColorStop("1.0","#777");
	cxt.fillStyle = gradient;
	cxt.font = "50px Arial Black";
	cxt.fillText("ArmGo",c.width/2-100,c.height/2);
	
	var kk = eid("GoMission");
	kk.style.left = c.width/2-100;
	kk.style.top = c.height/2;
	kk.addEventListener('click',missionList.show,false);
	
	initVal(1);
	flashMap();
}

function drawBg(){
	cxt.fillStyle = '#999966';
	cxt.fillRect(0,0,c.width,c.height);
	cxt.fillStyle = "#5E4925";
	cxt.fillRect(GOALM.x+CELL.x*6,GOALM.y-35,15,500);
	for ( i=1; i<7; i++){
		cxt.fillRect(GOALM.x,GOALM.y+CELL.y*(i*2-1),CELL.x*6,15);
	}
	cxt.fillRect(STATE.x+CELL.x*6,STATE.y-35,15,500);
	for ( i=1; i<7; i++){
		cxt.fillRect(STATE.x,STATE.y+CELL.y*(i*2-1),CELL.x*6,15);
	}
}

function drawGoal(){
	var x = GOALM.x;
	var y = GOALM.y;
	var g = Goal[Mission];
	cxt.fillStyle = '#000';
	cxt.fillText("Goal",x,y-20);
	for ( i=0; i<6; i++ ){
		for ( j=0; j<6; j++){
			cxt.fillStyle = color[g[i][j]];
			cxt.strokeStyle = color[g[i][j]];
			if ( g[i][j] != 0){
				cxt.fillRect(j*CELL.x+x,i*CELL.y*2+y,CELL.x,CELL.y);
			}else {
				cxt.strokeRect(j*CELL.x+x,i*CELL.y*2+y,CELL.x,CELL.y);
			}
		}
	}
}

function drawState(){
	var x = STATE.x;
	var y = STATE.y;
	var g = state;
	for ( i=0; i<6; i++ ){
		for ( j=0; j<6; j++){
			cxt.fillStyle = color[g[i][j]];
			cxt.strokeStyle = color[g[i][j]];
			if ( g[i][j] != 0){
				cxt.fillRect(j*CELL.x+x,i*CELL.y*2+y,CELL.x,CELL.y);
			}else {
				cxt.strokeRect(j*CELL.x+x,i*CELL.y*2+y,CELL.x,CELL.y);
			}
		}
	}
}

function drawArm(){
	var x = arm.x;
	var y = arm.y;
	cxt.beginPath();
	cxt.moveTo(x,y);
	cxt.lineTo(x,y+30);
	cxt.lineTo(x-2,y+30);
	cxt.lineTo(x-6,y+15);
	cxt.lineTo(x-2,y);
	cxt.closePath();
	cxt.fillStyle = arm.color;
	cxt.fill();
	cxt.fillRect(240,y+11,x-240,8);
	cxt.fillRect(240,STATE.y-40,6,400);
	//drawCope(x,y,2);
	if ( arm.hand != 0 ) drawCell(arm.x,arm.y,arm.hand);
}

function drawBAG(){
	var x = BAG.x;
	var y = BAG.y;
	cxt.fillStyle = "#178512";
	cxt.fillRect(x,y,BAG.r,BAG.c);
	cxt.fillStyle = "#095206";
	cxt.fillRect(x+20,y+20,BAG.r-40,BAG.c-40);
	for (i=1; i<4; i++){
		drawCope(x+40+(i-1)*cope.width*1.5,y+40,i);
	}
}

function drawAuthor(){
		
}

function drawCope(x,y,v,r,c){
	var img = new Image();
	img.src="img/"+imgfile[v];
	if ( r == undefined ){
		cxt.drawImage(img,x,y,cope.width,cope.height);
	}else {
		cxt.drawImage(img,x,y,r,c);
	}
}

function drawCell(x,y,v){
	cxt.fillStyle = color[v];
	cxt.fillRect(x,y,CELL.x,CELL.y);
}

function checkAns(){
	if ( state.toString() == Goal[Mission].toString()){
		alert("WIN");
	}
}

function Wmove(e){
	ns.innerHTML = (e.clientX - c.offsetLeft) + "," + (e.clientY - c.offsetTop);
	if (ms.down){
		var copi = eid("cope1");
		copi.style.left = e.clientX - cope.width/2;
		copi.style.top = e.clientY - cope.height/2;
	}

}

function Wdown(e){
}
	
function Wup(e){
	ms.down = false;
}

function Cdown (e) {
	ms.down = true;
}

window.addEventListener('mousedown',Wdown,false);
window.addEventListener('mouseup',Wup,false);
window.addEventListener('mousemove',Wmove,false);

eid("cope1").addEventListener('mousedown',Cdown,false);

window.onload = function(){
	drawHello();
}