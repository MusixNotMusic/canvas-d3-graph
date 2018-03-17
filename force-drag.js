var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
/************/ 

var canvas = document.querySelector("canvas"),
    context = canvas.getContext("2d"),
    width =  window.hasOwnProperty('hasHidpi') ? canvas.width/2 : canvas.width,
    height = window.hasOwnProperty('hasHidpi') ? canvas.height/2 : canvas.height,
    transform = d3.zoomIdentity; //比例缩放

// var grid  =  new Grid(width, height, canvas, 20);
var grid  =  new Grid(width, height, canvas, 5 );

grid.attch();

var color = d3.scaleOrdinal().range(d3.schemeCategory10); 

var boxes = []
// ondblclick 在 zoomed 之前注册
canvas.ondblclick = function(event){
    // console.log('db click')
    var box = new Box({
        x: transform.invertX(event.x), 
        y: transform.invertY(event.y), 
        // x: event.x,
        // y: event.y,
        color:color(Math.random()*20|0)},
        60,
        80,
        context,
        width,
        height
        )
        box.create()
        boxes.push(box)
  }

  d3.select(canvas)
      .call(d3.drag()
        //   .container(canvas)
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
          .on("start.render drag.render end.render", render)
          );

  d3.select(canvas)
  .call(d3.zoom()
  .scaleExtent([1 / 2, 2])
  .on('zoom', zoomed)
//   .on('dblclick',function(){ d3.event.preventDefault();})
 )

function zoomed(){
    console.log('zoomed --->')
    transform = d3.event.transform;
    render();
}

function render() {
    stats.begin();
    context.save();
    context.clearRect(0, 0, width, height);
    context.beginPath()
    //矢量聚焦
    context.translate(transform.x, transform.y);
    //矢量缩放
    context.scale(transform.k, transform.k);
    for (var i = 0, n = boxes.length, box; i < n; ++i) {
      box = boxes[i];
      box.create();
      context.fillStyle = color(i);
      if (box.active) {
        context.lineWidth = 2;
        context.stroke();
      }
    }
    context.fill();
    context.restore();
    stats.end();
  }

  /**
   *  @desciption 识别一个正方形的图形
   *  find 一个Node 与光标 距离很近的 图片
   *  鼠标在 某个Node范围内部开始识别
   *    
   *     ------------
   *    /  .(1)     /
   *   /           /
   *  /           /
   * /___________/
   * 
   * 
   *      ------------
   *    /           /
   *   /        ---/------
   *  /       / .2/      /
   * /_______/___/      /
   *        /          /
   *       /__________/
   * 
   * 
  */

  function dragsubject() {
    // console.log('find a Node')
    var i = 0,
    n = boxes.length,
    dx,
    dy,
    d2,
    s2 = 200*200, // Rect 
    box,
    upBoundary,
    downBoundary,
    leftBoundary,
    rightBoundary,
    transformX = transform.invertX(d3.event.x),
    transformY = transform.invertY(d3.event.y),
    subject;

    for (i = 0; i < n; ++i) {
        box = boxes[i];
        upBoundary = box.y;
        leftBoundary = box.x;
        downBoundary = box.y + box.height;
        rightBoundary = box.x + box.width;
        // transform.invertX(d3.event.x)
        if(transformX > leftBoundary && transformX < rightBoundary && transformY > upBoundary && transformY < downBoundary){
            console.log('inner');
            if(transformX - leftBoundary < rightBoundary - transformX){
                dx = transformX - leftBoundary;
            }else{
                dx = rightBoundary - transformX;
            }

            if(transformY- upBoundary < downBoundary - transformY){
                dy = transformY - upBoundary;
            }else{
                dy = downBoundary - transformY
            }
        }
        d2 = dx * dy;
        console.log('d2 = %s, s2 = %s ',d2, s2, box)
        if (d2 < s2) {
            box.x = transform.applyX(box.x);
            box.y = transform.applyY(box.y);
            subject = box;
            s2 = d2;
        }
    }
    console.log('subject',subject)
    return subject;
  }
// });

function dragstarted() {
    console.log('drag start', d3.event.subject)
    boxes.splice(boxes.indexOf(d3.event.subject), 1);
    boxes.push(d3.event.subject);
    d3.event.subject.active = true;
}

function dragged() {
  d3.event.subject.x = transform.invertX(d3.event.x);
  d3.event.subject.y = transform.invertY(d3.event.y);
}

function dragended() {
  d3.event.subject.active = false;
}


