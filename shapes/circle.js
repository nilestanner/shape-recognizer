const common = require('../common.js');

const analyzeCircle = (points, tolerance) => {
	if (tolerance === undefined) {
		tolerance = 0.5;
	}
	let maxx = -Infinity;
	let minx = Infinity;
	let maxy = -Infinity;
	let miny = Infinity;

	for (let i = 0; i < points.length; i++) {
		const pt = points[i];
		if (pt.x > maxx) maxx = pt.x;
		if (pt.x < minx) minx = pt.x;
		if (pt.y > maxy) maxy = pt.y;
		if (pt.y < miny) miny = pt.y;
	}

	const center = {
		x: (maxx + minx) / 2,
		y: (maxy + miny) / 2
	};

	let sumDistance = 0;
	for (let i = 0; i < points.length; i++) {
		const pt = points[i];
		pt.d = common.distance(pt, center);
		sumDistance += pt.d;
	}
	const averageDistance = sumDistance / points.length;

	let totalDist = 0;
	let maxd = { d: 0 };
	let mind = { d: Infinity };

	for (let i = 0; i < points.length; i++) {
		const pt = points[i];
		totalDist += Math.pow(Math.abs((pt.d - averageDistance) / averageDistance), tolerance);
		if (pt.d > maxd.d) {
			maxd = pt;
		}
		if (pt.d < mind.d) {
			mind = pt;
		}
	}
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
