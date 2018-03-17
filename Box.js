/**
 * 
 * @param {Object} opt 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} globalWidth
 * @param {Number} globalHeight
 * @param {Canvas} context
 */ 
var Box = function(opt, width, height, context, globalWidth, globalHeight){
    this.x = opt.x || Math.random() * globalWidth;
    this.y = opt.y || Math.random() * globalHeight;
    this.color = opt.color;
    this.fontSize = opt.fontSize;
    this.fontFamily = opt.fontFamily;
    this.width = width;
    this.height = height;
    this.context = context;
    return this;
}
Box.prototype.create = function(){
    // this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x,this.y,this.width,this.height);
    // this.context.closePath();
}