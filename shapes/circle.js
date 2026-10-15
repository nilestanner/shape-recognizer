const common = require('../common.js');

const analyzeCircle = (points, tolerance) => {
	if (tolerance === undefined) {
		tolerance = 0.5;
	}
	const xs = points.map(obj => obj.x);
	// SECURITY: Use reduce instead of Math.max/min.apply to prevent
	// Call Stack Overflow (DoS) with large user-supplied input arrays.
	const maxx = xs.reduce((max, val) => val > max ? val : max, -Infinity);
	const minx = xs.reduce((min, val) => val < min ? val : min, Infinity);
	const ys = points.map(obj => obj.y);
	const maxy = ys.reduce((max, val) => val > max ? val : max, -Infinity);
	const miny = ys.reduce((min, val) => val < min ? val : min, Infinity);
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
