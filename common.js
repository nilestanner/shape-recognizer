const distance = (point1, point2) => {
	// ⚡ Bolt Optimization: Replace Math.pow(..., 2) with simple multiplication
	// `dx * dx + dy * dy` is measurably faster than `Math.pow(dx, 2) + Math.pow(dy, 2)`
	// and preserves perfect readability without function call overhead.
	const dx = point1.x - point2.x;
	const dy = point1.y - point2.y;
	return Math.sqrt(dx * dx + dy * dy);
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

const filterValidPoints = (points) => {
	if (!Array.isArray(points)) return [];
	let validPoints = [];
	for (let i = 0; i < points.length; i++) {
		const pt = points[i];
		if (pt && typeof pt.x === 'number' && typeof pt.y === 'number') {
			validPoints.push(pt);
		}
	}
	return validPoints;
};

module.exports = {
  distance,
  isVertical,
	rotate,
	filterValidPoints
};
