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
        x:event.x - canvas.offsetLeft, 
        y:event.y - canvas.offsetTop, 
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

//   d3.select(canvas)
//   .call(d3.zoom()
//   .scaleExtent([1 / 2, 4])
//   .on("zoom", zoomed))

function zoomed(){
    console.log('zoomed --->')
    transform = d3.event.transform;
    render();
}

function render() {
    stats.begin();
    context.clearRect(0, 0, width, height);
    for (var i = 0, n = boxes.length, box; i < n; ++i) {
      box = boxes[i];
      context.beginPath();
      //矢量聚焦
      context.translate(transform.x, transform.y);
      //矢量缩放
      context.scale(transform.k, transform.k);
      box.create();
      context.fillStyle = color(i);
      context.fill();
      if (box.active) {
        context.lineWidth = 2;
        context.stroke();
      }
      stats.end();
    }
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
    minPositionX,
    minPositionY,
    subject;

    for (i = 0; i < n; ++i) {
        box = boxes[i];
        upBoundary = box.y;
        leftBoundary = box.x;
        downBoundary = box.y + box.height;
        rightBoundary = box.x + box.width;
        if(d3.event.x > leftBoundary && d3.event.x < rightBoundary && d3.event.y > upBoundary && d3.event.y < downBoundary){
            console.log('inner');
            if(d3.event.x - leftBoundary < rightBoundary - d3.event.x){
                dx = transform.invertX(d3.event.x) - leftBoundary;
            }else{
                dx = rightBoundary - transform.invertX(d3.event.x);
            }

            if(d3.event.y - upBoundary < downBoundary - d3.event.y){
                dy = transform.invertY(d3.event.y) - upBoundary;
            }else{
                dy = downBoundary - transform.invertY(d3.event.y);
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


