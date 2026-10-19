const common = require('../common.js');

const analyzeLine = (points) => {
	const vertical = common.isVertical(points);
	let correctedPoints = points;
	if(vertical){
		correctedPoints = points.map((pt) => {
			return {
        x: pt.y,
        y: pt.x
      };
		});
	}
	let sumX = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumXX = 0;
	let count = 0;
	let x = 0;
	let y = 0;
	let pointsLength = correctedPoints.length;
	if (pointsLength === 0) {
		return [ [], [] ];
	}
	for (let v = 0; v < pointsLength; v++) {
		x = correctedPoints[v].x;
		y = correctedPoints[v].y;
		sumX += x;
		sumY += y;
		sumXX += x*x;
		sumXY += x*y;
		count++;
	}
	const m = (count*sumXY - sumX*sumY) / (count*sumXX - sumX*sumX);
	const b = (sumY/count) - (m*sumX)/count;
	let totalDist = 0;
	let prev = null;
	let allDistance = 0;
	correctedPoints.forEach((pt) => {
		if(prev){
			allDistance += common.distance(pt,prev);
		}
		prev = pt;
	});
	const firstPoint = {
		x: correctedPoints[0].x,
		y: correctedPoints[0].x * m + b
	};
	const lastpoint = {
		x: correctedPoints[pointsLength - 1].x,
		y: correctedPoints[pointsLength - 1].x * m + b
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
