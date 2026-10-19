const common = require('../common.js');

const analyzeCircle = (points, tolerance) => {
	if (tolerance === undefined) {
		tolerance = 0.5;
	}
	let maxx = -Infinity, minx = Infinity;
	let maxy = -Infinity, miny = Infinity;

	// Optimization: Single pass loop for bounding box limits instead of multiple
	// .map() operations and Math.max.apply / Math.min.apply which allocate intermediate
	// arrays and can exceed max call stack size limits on large array sizes.
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

	// Optimization: Single pass to calculate all distances instead of
	// .map() followed by .reduce() which allocated an intermediate distance array.
	let totalDistance = 0;
	for (let i = 0; i < points.length; i++) {
		const pt = points[i];
		pt.d = common.distance(pt, center);
		totalDistance += pt.d;
	}
	const averageDistance = totalDistance / points.length;

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
