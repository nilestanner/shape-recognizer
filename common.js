const distance = (point1, point2) => {
	return Math.sqrt( Math.pow(point1.x-point2.x, 2) + Math.pow(point1.y-point2.y, 2) );
};

const isVertical = (points) => {
	return Math.abs(points[0].x - points[points.length - 1].x) <  Math.abs(points[0].y - points[points.length - 1].y);
};

module.exports = {
  distance,
  isVertical
};
