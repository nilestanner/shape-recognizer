const analyzeCircle = require('./shapes/circle.js');
const analyzeLine = require('./shapes/line.js');
const analyzeSine = require('./shapes/sine.js');
const analyzer = {
  analyzeCircle,
  analyzeLine,
  analyzeSine
};
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = analyzer;
}
if (typeof window !== 'undefined') {
  window.analyzer = analyzer;
}

analyzer.analyzeLine([]);
