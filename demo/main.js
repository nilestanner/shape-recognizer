var path;
var allPoints = [];
var textItem = new PointText({
    content: 'Click and drag to draw a line.',
    point: new Point(20, 30),
    fillColor: 'black',
});

function onMouseDown(event) {
    // If we produced a path before, deselect it:
    if (path) {
        path.selected = false;
    }

    // Create a new path and set its stroke color to black:
    path = new Path({
        segments: [event.point],
        strokeColor: 'black',
        // Select the path, so we can see its segment points:
        fullySelected: true
    });
    textItem.content = currentTesting;
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
function onMouseDrag(event) {
    path.add(event.point);
    allPoints.push({x:event.point.x,y:event.point.y});
    // Update the content of the text item to show how many
    // segments it has:
}

// When the mouse is released, we simplify the path:
function onMouseUp(event) {
    var segmentCount = path.segments.length;

    // When the mouse is released, simplify it:
    //path.simplify(10);
    console.log(path);

    // Select the path, so we can see its segments:
    path.fullySelected = true;

    var newSegmentCount = path.segments.length;
    var difference = segmentCount - newSegmentCount;
    console.log(currentTesting);
    switch(currentTesting){
      case 'circle':
        analyzer.analyzeCircle(allPoints);
        break;
      case 'sine':
        analyzer.analyzeSine(allPoints);
        break;
      case 'line':
        var final = analyzer.analyzeLine(allPoints);
        var errorText = new PointText({
            content: 'accuracy: ' + final.accuracy * 100,
            point: new Point(final.lastPoint.x, final.lastPoint.y + 5),
            fillColor: 'black',
        });
        break;
    }

    allPoints = [];
}

function createx(point,color){
  var center1 = new Path();
  center1.strokeColor = color;
  center1.add(new Point(point.x + 3,point.y + 3));
  center1.add(new Point(point.x - 3,point.y -3));
  var center2 = new Path();
  center2.strokeColor = color;
  center2.add(new Point(point.x - 3,point.y + 3));
  center2.add(new Point(point.x + 3,point.y - 3));
}

function createPath(points,color){
  var pt = new Path();
  pt.strokeColor = color;
  points.forEach(function(point){
    pt.add(new Point(point.x,point.y));
  });
}
