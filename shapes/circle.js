const common = require('../common.js');

const analyzeCircle = (points, tolerance = 0.5) => {
	const xs = points.map(obj => obj.x);
	const maxx = Math.max.apply(null,xs);
	const minx = Math.min.apply(null,xs);
	const ys = points.map(obj => obj.y);
	const maxy = Math.max.apply(null,ys);
	const miny = Math.min.apply(null,ys);
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
		totalDist += Math.pow(Math.abs((pt.d - avedist) / avedist), tolerance);
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
		radius:avedist,
		center
	};
	return result;
}
