const analyzeCircle = require('./shapes/circle.js');
const points = [];
for (let i = 0; i < 200000; i++) {
  points.push({ x: Math.random() * 100, y: Math.random() * 100 });
}
try {
  analyzeCircle(points);
  console.log("Success");
} catch(e) {
  console.log("Error:", e.message);
}
