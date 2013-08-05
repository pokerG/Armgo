function TOOLBAR(){
	this.r = cope.width * 2;
	this.c = 100;
	this.s = 0;
	this.show = function(x,y){
		if ( this.s == 0 ) return ;
		x = x - this.r - 20;
		cxt.fillRect(x,y,this.r + 20,this.c+20);
	}
}