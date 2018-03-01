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
	const valuesX = correctedPoints.map(obj => obj.x);
	const valuesY = correctedPoints.map(obj => obj.y);

	let sumX = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumXX = 0;
	let count = 0;
	let x = 0;
	let y = 0;
	let valuesLength = valuesX.length;
	if (valuesLength === 0) {
		return [ [], [] ];
	}
	for (let v = 0; v < valuesLength; v++) {
		x = valuesX[v];
		y = valuesY[v];
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
		x: valuesX[0],
		y: valuesX[0] * m + b
	};
	const lastpoint = {
		x: valuesX[valuesX.length - 1],
		y: valuesX[valuesX.length - 1] * m + b
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

modules.export = analyzeLine;
