const distance = (point1, point2) => {
	return Math.sqrt( Math.pow(point1.x-point2.x, 2) + Math.pow(point1.y-point2.y, 2) );
};

const isVertical = (points) => {
	if (!points.length) {
		return;
	}
	return Math.abs(points[0].x - points[points.length - 1].x) <  Math.abs(points[0].y - points[points.length - 1].y);
};

const rotate = (pivotPoint, point, angle) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	var newX = Math.round((cos * (point.x - pivotPoint.x)) + (sin * (point.y - pivotPoint.y)) + pivotPoint.x);
	var newY = Math.round((cos * (point.y - pivotPoint.y)) - (sin * (point.x - pivotPoint.x)) + pivotPoint.y);
	return {
		x:newX,
		y:newY
	};
};

module.exports = {
  distance,
  isVertical,
	rotate
};
