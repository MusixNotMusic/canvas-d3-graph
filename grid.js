/**
 * 
 *  
 * 
 * 
 * **/

 var Grid = function(width,height,matchCanvas,offset){
    this.width = width;
    this.height = height;
    this.matchCanvas = matchCanvas;
    this.offset = offset;
 }
 Grid.prototype.attch = function(){
     var canvas = document.createElement('canvas');
     document.body.appendChild(canvas);
     canvas.width = this.width;
     canvas.height = this.height;
    //  canvas.style = {
        // position: 'absolute',
        // top: this.matchCanvas.offsetTop,
        // left: this.matchCanvas.offsetLeft,
    //  }
     this.context =  canvas.getContext('2d');
     this.context.beginPath();
     this.context.lineWidth = "0.5"; 
     this.context.strokeStyle = "#999";
     this.draw();
    //  this.context.closePath();  
     //绘制已定义的路径  
     this.context.stroke(); 
 }

 Grid.prototype.draw = function(){
    for(var row = 1; row <= this.width ; row+= this.offset ){
        this.context.moveTo(row ,1);
        this.context.lineTo(row, this.height-1);
        if((row + this.offset) > this.width ){
            this.context.moveTo(this.width-1 ,0);
            this.context.lineTo(this.width-1, this.height);
        }
    }

    for(var col = 1; col <= this.height; col+= this.offset ){
        this.context.moveTo(1 ,col);
        this.context.lineTo(this.width-1,col);
        if((col + this.offset) > this.height ){
            this.context.moveTo(0 ,this.height-1);
            this.context.lineTo(this.width, this.height-1);
        }
    }
}