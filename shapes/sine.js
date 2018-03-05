const common = require('../common.js');
const analyzeLine = require('./line.js');

const analyzeSine = (points, threshold) => {
	if (threshold === undefined) {
		threshold = 3;
	}
	let line = analyzeLine(points);
	delete line.accuracy;
	const translatedPoints = points.map((pt) => {
		return common.rotate(points[0], pt, line.angle);
	});
	const lineTestResult = lineTest(translatedPoints);
	console.log(lineTestResult);
	if(!lineTestResult.valid){
		line.valid = false;
	} else if (checkPeaks(lineTestResult.criticalPoints, threshold)){
		//find amplitude
		const avehigh = lineTestResult.highPts.reduce((a,b) =>{
			return a + b.y;
		},0) / lineTestResult.highPts.length;
		const avelow = lineTestResult.lowPts.reduce((a,b) =>{
			return a + b.y;
		},0) / lineTestResult.lowPts.length;
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
			if(direction === 'up' && cur.y < prev.y ){
				direction = 'down';
				current.type='high';
				highpts.push(current);
			} else if(direction === 'down' && cur.y > prev.y){
				direction = 'up';
				current.type='low';
				lowpts.push(current);
			}
		}
		prev = current;
		return result;
	});
	const averageHeight = points.map((point) =>{
		return point.y;
	}).reduce((a,b) => {
		return a + b;
	},0) / points.length;

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
	}).forEach((point) => {
		if(point.type !== prevType && prevType !== null){
			peakCount++;
		}
		prevType = point.type;
	});
	return peakCount >= threshold;
};

module.exports = analyzeSine;
