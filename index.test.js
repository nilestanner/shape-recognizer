const { describe, it } = require('node:test');
const assert = require('node:assert');
const analyzer = require('./index.js');

describe('index', () => {
  it('exports the three analyzers', () => {
    assert.deepStrictEqual(Object.keys(analyzer).sort(), ['analyzeCircle', 'analyzeLine', 'analyzeSine']);
    for (const fn of Object.values(analyzer)) {
      assert.strictEqual(typeof fn, 'function');
    }
  });

  it('exports the same functions as the shape modules', () => {
    assert.strictEqual(analyzer.analyzeCircle, require('./shapes/circle.js'));
    assert.strictEqual(analyzer.analyzeLine, require('./shapes/line.js'));
    assert.strictEqual(analyzer.analyzeSine, require('./shapes/sine.js'));
  });
});
