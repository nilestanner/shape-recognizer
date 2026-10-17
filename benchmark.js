const analyzeCircle = require('./shapes/circle.js');

// Create a large array of points
const points = [];
for (let i = 0; i < 10000; i++) {
  points.push({
    x: Math.random() * 100,
    y: Math.random() * 100
  });
}

console.time('analyzeCircle');
for (let i = 0; i < 1000; i++) {
  try {
    analyzeCircle(points);
  } catch (e) {
    console.error(e);
    break;
  }
}
console.timeEnd('analyzeCircle');
