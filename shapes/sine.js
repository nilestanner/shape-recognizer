const common = require('../common.js');
const analyzeLine = require('./line.js');

const analyzeSine = (points, threshold) => {
	// SECURITY: Ensure points are valid to prevent TypeErrors (DoS) on malformed inputs like [null]
	points = common.filterValidPoints(points);

	if (points.length === 0) {
		return { valid: false };
	}
	if (threshold === undefined) {
		threshold = 3;
	}
	let line = analyzeLine(points);
	delete line.accuracy;
	const translatedPoints = points.map((pt) => {
		return common.rotate(points[0], pt, line.angle);
	});
	const lineTestResult = lineTest(translatedPoints);
	if(!lineTestResult.valid){
		line.valid = false;
	} else if (checkPeaks(lineTestResult.criticalPoints, threshold)){
		//find amplitude
		// ⚡ Bolt Optimization: Replace reduce with standard for loops
		// Avoids creating and invoking callback functions for each element
		let sumHigh = 0;
		const highLen = lineTestResult.highPts.length;
		for (let i = 0; i < highLen; i++) {
			sumHigh += lineTestResult.highPts[i].y;
		}
		const avehigh = sumHigh / highLen;

		let sumLow = 0;
		const lowLen = lineTestResult.lowPts.length;
		for (let i = 0; i < lowLen; i++) {
			sumLow += lineTestResult.lowPts[i].y;
		}
		const avelow = sumLow / lowLen;

		line.amplitude = Math.abs(avehigh - avelow) / 2;
		//find period
		line.valid = true;
	} else {
		line.valid = false;
	}
  return line;
};

const lineTest = (points) => {
	let prev = {x:0,y:0};
	let direction = 'up';
	let highpts = [];
	let lowpts =[];
	let travelDirection = '';
	//checks for direction
	if(points[0].x < points[points.length-1].x){
		travelDirection = 'left';
	} else if(points[0].x > points[points.length-1].x){
		travelDirection = 'right';
	}
	let valid = points.every((current) => {
		let result;
		if(travelDirection === 'left') {
			result = current.x + 1 >= prev.x;
			if(direction === 'up' && current.y < prev.y ){
				direction = 'down';
				current.type='high';
				highpts.push(current);
			} else if(direction === 'down' && current.y > prev.y){
				direction = 'up';
				current.type='low';
				lowpts.push(current);
			}
		}
		else if(travelDirection === 'right'){
			result = current.x - 1 <= prev.x;
			if(prev.x === 0){
				result = true;
			}
			if(direction === 'up' && current.y < prev.y ){
				direction = 'down';
				current.type='high';
				highpts.push(current);
			} else if(direction === 'down' && current.y > prev.y){
				direction = 'up';
				current.type='low';
				lowpts.push(current);
			}
		}
		prev = current;
		return result;
	});
	// ⚡ Bolt Optimization: Replace map().reduce() with single pass for loop
	let sumY = 0;
	for (let i = 0; i < points.length; i++) {
		sumY += points[i].y;
	}
	const averageHeight = sumY / points.length;

	highpts = highpts.filter((highPoint) => {
		return highPoint.y > averageHeight;
	});
	lowpts = lowpts.filter((lowPoint) => {
		return lowPoint.y < averageHeight;
	});
	if(valid && (lowpts.length < 2 || highpts.length < 2)){
		valid = false;
	}
	var testResult = {
		criticalPoints:highpts.concat(lowpts),
		highPts:highpts,
		lowPts:lowpts,
		valid:valid
	};
	return testResult;
};

const checkPeaks = (points, threshold) => {
	var prevType = null;
	var peakCount = 0;
	points.sort((a,b) => {
		return a.x - b.x;
	});
	// ⚡ Bolt Optimization: Replace forEach with standard for loop
	// Avoids callback overhead
	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		if(point.type !== prevType && prevType !== null){
			peakCount++;
		}
		prevType = point.type;
	}
	return peakCount >= threshold;
};

module.exports = analyzeSine;
