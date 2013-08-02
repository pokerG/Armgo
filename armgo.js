// Preferences
var Fz = 20;

// Const Variables
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

// Global Variables
var c = eid("canvas");
var cxt = c.getContext("2d");
var ctime;				// arm Go!
var Mission;			// Mission Canvas Object
var ns = eid("ns");		// debug message
var state = [];			// the state of stage

// object
var arm = new ARM();
var cope = new COPE(1);
var missionList = new MISSIONLIST();
var runs = new RUNS();

function COPE(v){
	this.x = 50;
	this.y = 50;
	this.width = 35;
	this.height = this.width;
	this.value = v;
}

function ARM(){
	this.leftz = STATE.x - CELL.x - 12;
	this.topz = STATE.y;
	this.bottonz = STATE.y + CELL.y * 12;
	this.speed = 6;
	this.color = '#00ff00';
	this.init = function(){
		this.x = this.leftz;
		this.y = this.topz;
		this.r = 1;
		this.hand = 0;
	}
	this.init();
	this.done = function(v,i){
		if ( runs.tasks[v][i+1] != 0 ) runs.run(v,i+1);
	}
	this.right = function(v,ii){
		var i = 6;
		while ( i>0 && state[this.r-1][i-1] != 0 ) i--;
		this.goRight(STATE.x+CELL.x*i,v,ii);
	}
	this.left = function(v,i){
		this.x -= this.speed ;
		if ( this.x > this.leftz ){
			setTimeout('arm.left('+v+','+i +')',Fz);
			//sleep(Fz);this.left();
		}else {
			this.done(v,i);
		}
	}
	this.up = function(v,i){
		if ( this.r == 1 ) return ;
		this.y -= this.speed ;
		if (this.y > (STATE.y+CELL.y*(this.r-2)*2) ) {
			setTimeout('arm.up('+v+','+i+')',Fz);
			//sleep(Fz);this.up();
		}else {
			this.r --;
			this.done(v,i);
		}
	}
	this.down = function(v,i){
		if ( this.r == 6 ) return ;
		this.y += this.speed ;
		if ( this.y < ( STATE.y+CELL.y*(this.r*2))) {
			setTimeout('arm.down('+v+','+i+')',Fz);
			//sleep(Fz);this.down();
		}else {
			this.r ++ ;
			this.done(v,i);
		}
	}
	this.goRight = function(x,v,ii){
		this.x 	+= this.speed ;
		if ( this.x + (this.hand > 0)*CELL.x  < x ){
			setTimeout('arm.goRight('+x+','+v+','+ii+')',Fz);
			//sleep(Fz);this.goRight(x);
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
			
			this.left(v,ii);
			setTimeout('checkAns()',200);
		}
	}
}

function MISSIONLIST(){
	this.tot = Goal.length-1;
	this.x = 90;
	this.y = 150;
	this.r = 80;
	this.c = 80;
	this.show = function(){
		clearTimeout(ctime);
		cxt.fillStyle = '#000';
		cxt.fillRect(0,0,c.width,c.height);
		cxt.fillStyle = '#fff';
		cxt.font = "40px Arial";
		cxt.fillText("Mission:",this.x,this.y-50);
		for ( i=1; i<=this.tot; i++){
			var x = this.x + ((i-1)%5)*this.r*2;
			var y = this.y + Math.floor((i-1)/5)*this.c*2;
			drawCope(x,y,i+3,this.r,this.c);
		}
		c.onclick = function(e){
			missionList.selectMission(e)
		}
	}
	this.selectMission = function(e){
		initVal(getClickId(e,missionList.x,missionList.y,missionList.r*2,missionList.c*2,5));
	}
}

function RUNS(){
	this.init = function(){
		this.tasks=[[1,5,1,0,0,0,0,0],[3,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
		this.ifs=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
	}
	this.init();
	this.x = STATE.x + CELL.x*8;
	this.y = STATE.y - CELL.y;
	this.r = 300;
	this.c = 300;
	this.draw = function(){
		for ( i=0; i<4; i++){
			for ( j=1; j<9; j++){
				drawCope(this.x+cope.width*j,this.y+cope.height*i*1.7,this.tasks[i][j-1],cope.width,cope.height);
				if ( i==3 && j==5 ) break;
			}
			drawCope(this.x,this.y+cope.height*i*1.7,i+4,cope.width,cope.height);
		}
	}
	this.run = function(v,i){
		ns.innerHTML = v + ',' + i ;
			switch( this.tasks[v][i] ){
				case 1 :
					arm.right(v,i);
					break;
				case 2 :
					arm.up(v,i);
					break;
				case 3 :
					arm.down(v,i);
					break;
				case 4 :
					this.run(0,0);
					break;
				case 5 :
					this.run(1,0);
					break;
				case 6 :
					this.run(2,0);
					break;
				case 7 :
					this.run(3,0);
					break;
			}
	}
}

function getClickId(e,x,y,r,c,m){	// ID of (e.x,e.y) in Map: start(x,y),per(r,c), there are m in one line 
	var i = Math.floor(( e.clientX - eid("canvas").offsetLeft - x ) / r ) + 1;
	var j = Math.floor(( e.clientY - eid("canvas").offsetTop - y ) / c )+ 1;
	eid("canvas").style.cursor = 'default';
	var ttt = (j-1)*m+i ;
	if ( ttt > 0 && ttt <= missionList.tot ){
		eid("canvas").onclick = function() { null; };
		return ttt;
	}else{
		return getClickId(e,missionList.x,missionList.y,missionList.r*2,missionList.c*2,5);
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
	arm.init();
	ctime = setInterval('flashMap()',Fz);
}

function flashMap(){
	cxt.clearRect(0,0,c.width,c.height);
	drawBg();
	drawGoal();
	drawState();
	drawArm();
	drawBAG();
	runs.draw();
}

function drawHello(){
	cxt.fillStyle = "#000";
	cxt.fillRect(0,0,c.width,c.height);
	var gradient=cxt.createLinearGradient(0,c.height/2-35,0,c.height/2+35);
	gradient.addColorStop("0","#fff");
	gradient.addColorStop("1.0","#777");
	cxt.fillStyle = gradient;
	cxt.font = "80px Arial Black";
	cxt.fillText("ArmGo",c.width/2-150,c.height/2);
	
	cxt.font = "20px Arial Black";
	cxt.fillText("click here",c.width/2-60,c.height/2+50);
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
	cxt.font = '30px Arial';
	cxt.fillText("GOAL:",x,y-20);
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
				//cxt.strokeRect(j*CELL.x+x,i*CELL.y*2+y,CELL.x,CELL.y);
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
		clearTimeout(ctime);
		alert("WIN");
		missionList.show();
	}
}

function sleep(s){
	flashMap();
	var startTime = new Date().getTime();
	while ( new Date().getTime() < startTime + s ) ;
}

function Wmove(e){
	//ns.innerHTML = (e.clientX - c.offsetLeft) + "," + (e.clientY - c.offsetTop);
}

function Wdown(e){
}
	
function Wup(e){

}

function Cdown (e) {

}

window.addEventListener('mousemove',Wmove,false);

window.onload = function(){
	//initVal(1);
	drawHello();
	c.onclick = function(){
		c.onclick = function(){};	
		missionList.show();
	}
}