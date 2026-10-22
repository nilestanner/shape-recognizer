const analyzeCircle = require('./shapes/circle.js');
const analyzeLine = require('./shapes/line.js');
const analyzeSine = require('./shapes/sine.js');

try { analyzeCircle(); console.log('Circle OK'); } catch (e) { console.error('Circle failed:', e.message); }
try { analyzeLine(); console.log('Line OK'); } catch (e) { console.error('Line failed:', e.message); }
try { analyzeSine(); console.log('Sine OK'); } catch (e) { console.error('Sine failed:', e.message); }
