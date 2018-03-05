var path;
var allPoints = [];
var textItem = new PointText({
    content: 'Click and drag to draw a line. (circle)',
    point: new Point(20, 30),
    fillColor: 'black',
});

document.getElementById("circleBtn").addEventListener('click', function () {
  switchShape('cirle');
});
document.getElementById("sineBtn").addEventListener('click', function () {
  switchShape('sine');
});
document.getElementById("lineBtn").addEventListener('click', function () {
  switchShape('line');
});

var currentTesting = 'circle';

function switchShape(value){
  currentTesting = value;
  textItem.content = 'Click and drag to draw a line. (' + value + ')';
}

function onMouseDown(event) {
    if (path) {
        path.selected = false;
    }

    path = new Path({
        segments: [event.point],
        strokeColor: 'black',
        fullySelected: true
    });
}

function onMouseDrag(event) {
    path.add(event.point);
    allPoints.push({x:event.point.x,y:event.point.y});
}

function onMouseUp(event) {
    var segmentCount = path.segments.length;
    path.fullySelected = true;
    var newSegmentCount = path.segments.length;
    var difference = segmentCount - newSegmentCount;
    switch(currentTesting){
      case 'circle':
        showCircleResults(analyzer.analyzeCircle(allPoints));

        break;
      case 'sine':
        showSineResults(analyzer.analyzeSine(allPoints));
        break;
      case 'line':
        showLineResults(analyzer.analyzeLine(allPoints));
        break;
    }
    allPoints = [];
}

function showCircleResults (circle) {
  createx(circle.center, 'blue');
  new PointText({
      content: 'accuracy: ' + circle.accuracy * 100,
      point: new Point(circle.center.x + 5, circle.center.y + 5),
      fillColor: 'black',
  });
  createx(circle.highWeakPoint,'red');
  new PointText({
      content: 'high point',
      point: new Point(circle.highWeakPoint.x + 5, circle.highWeakPoint.y + 5),
      fillColor: 'black',
  });
  createx(circle.lowWeakPoint,'red');
  new PointText({
      content: 'low point',
      point: new Point(circle.lowWeakPoint.x + 5, circle.lowWeakPoint.y + 5),
      fillColor: 'black',
  });
  drawLine(circle.center, {
    x: circle.center.x,
    y: circle.center.y + circle.radius
  }, 'blue');
  new PointText({
      content: 'Radius ' + circle.radius,
      point: new Point(circle.center.x + 5, circle.center.y + circle.radius/2),
      fillColor: 'black',
  });
}

function showLineResults (line) {
  console.log(line);
  createx(line.firstPoint,'green');
  createx(line.lastPoint,'green');
  drawLine(line.firstPoint, line.lastPoint, 'green');
  new PointText({
      content: 'Accuracy: ' + line.accuracy + '\nLength: ' + line.length + '\nAngle: ' +line.angle,
      point: new Point(line.firstPoint.x + 5, line.firstPoint.y),
      fillColor: 'black',
  });
}

function showSineResults (sine){
  console.log(sine);
  createx(sine.firstPoint,'green');
  createx(sine.lastPoint,'green');
  drawLine(sine.firstPoint, sine.lastPoint, 'green');
  new PointText({
      content: 'Valid: ' + sine.valid,
      point: new Point(sine.lastPoint.x + 5, sine.lastPoint.y),
      fillColor: 'black',
  });
  // drawLine(sine.firstPoint, rotate(sine.firstPoint, {
  //   x: sine.firstPoint.x,
  //   y: sine.firstPoint.y + sine.amplitude
  // }, sine.angle + Math.PI), 'blue');
}

function createx(point, color){
  var center1 = new Path();
  center1.strokeColor = color;
  center1.add(new Point(point.x + 3,point.y + 3));
  center1.add(new Point(point.x - 3,point.y -3));
  var center2 = new Path();
  center2.strokeColor = color;
  center2.add(new Point(point.x - 3,point.y + 3));
  center2.add(new Point(point.x + 3,point.y - 3));
}

function drawLine(point1, point2, color) {
  var line = new Path();
  line.strokeColor = color;
  line.add(new Point(point1.x, point1.y));
  line.add(new Point(point2.x,point2.y));
}

function createPath(points,color){
  var pt = new Path();
  pt.strokeColor = color;
  points.forEach(function(point){
    pt.add(new Point(point.x,point.y));
  });
}

function rotate(pivotPoint, point, angle) {
	var cos = Math.cos(angle);
	var sin = Math.sin(angle);
	var newX = Math.round((cos * (point.x - pivotPoint.x)) + (sin * (point.y - pivotPoint.y)) + pivotPoint.x);
	var newY = Math.round((cos * (point.y - pivotPoint.y)) - (sin * (point.x - pivotPoint.x)) + pivotPoint.y);
	return {
		x:newX,
		y:newY
	};
}
