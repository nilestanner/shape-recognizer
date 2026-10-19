const common = require('../common.js');

const analyzeCircle = (points, tolerance) => {
	if (tolerance === undefined) {
		tolerance = 0.5;
	}
	let maxx = -Infinity, minx = Infinity;
	let maxy = -Infinity, miny = Infinity;
	for (let i = 0; i < points.length; i++) {
		const x = points[i].x;
		const y = points[i].y;
		if (x > maxx) maxx = x;
		if (x < minx) minx = x;
		if (y > maxy) maxy = y;
		if (y < miny) miny = y;
	}
  const center = {
    x:(maxx + minx)/2,
    y:(maxy + miny)/2
  };
	const distances = points.map((obj) => {
		obj.d = common.distance(obj, center);
		return obj.d;
	});
	const averageDistance = distances.reduce((a,b) => a + b, 0) / points.length;

	let totalDist = 0;
	let maxd = {d:0};
	let mind = {d:Infinity};
	points.forEach((pt) => {
		totalDist += Math.pow(Math.abs((pt.d - averageDistance) / averageDistance), tolerance);
		if(pt.d > maxd.d){
			maxd = pt;
		}
		if(pt.d < mind.d){
			mind = pt;
		}
	});
	totalDist = totalDist / points.length;
	var result = {
		accuracy:1 - totalDist,
		lowWeakPoint: mind,
		highWeakPoint: maxd,
		radius:averageDistance,
		center
	};
	return result;
};

module.exports = analyzeCircle;
