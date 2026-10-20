const common = require('../common.js');

const analyzeLine = (points) => {
	const vertical = common.isVertical(points);
	let sumX = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumXX = 0;
	let count = 0;
	let pointsLength = points.length;
	if (pointsLength === 0) {
		return [ [], [] ];
	}

	let allDistance = 0;

	// ⚡ Bolt Optimization: Single pass loop replacing multiple .map() and .forEach()
	// Eliminates O(N) allocation of correctedPoints array, combining sums and distances
	for (let v = 0; v < pointsLength; v++) {
		const pt = points[v];
		const x = vertical ? pt.y : pt.x;
		const y = vertical ? pt.x : pt.y;

		sumX += x;
		sumY += y;
		sumXX += x * x;
		sumXY += x * y;
		count++;

		if (v > 0) {
			const prevPt = points[v - 1];
			// Distance is invariant to swapping x and y, so we can use the original points
			allDistance += common.distance(pt, prevPt);
		}
	}

	const m = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
	const b = (sumY / count) - (m * sumX) / count;
	let totalDist = 0;

	const firstX = vertical ? points[0].y : points[0].x;
	const lastX = vertical ? points[pointsLength - 1].y : points[pointsLength - 1].x;

	const firstPoint = {
		x: firstX,
		y: firstX * m + b
	};
	const lastpoint = {
		x: lastX,
		y: lastX * m + b
	};
	const fixedLength = common.distance(firstPoint,lastpoint);
	totalDist =  fixedLength / allDistance ;
	let result = {
		accuracy: totalDist,
		firstPoint: firstPoint,
		lastPoint: lastpoint,
		angle: Math.atan(m),
		length: fixedLength,
		fullLength: allDistance
	};
	//if vertical correct results
	if(vertical){
			result.firstPoint = {
        x: result.firstPoint.y,
        y: result.firstPoint.x
      };
			result.lastPoint = {
        x: result.lastPoint.y,
        y: result.lastPoint.x
      };
			result.angle += Math.PI/2;
	}
	return result;
};

module.exports = analyzeLine;
