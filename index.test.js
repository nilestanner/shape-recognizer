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

  it('sets analyzer on window if window is defined', () => {
    global.window = {};
    delete require.cache[require.resolve('./index.js')];
    require('./index.js');
    assert.ok(global.window.analyzer);
    assert.strictEqual(typeof global.window.analyzer.analyzeCircle, 'function');
    delete global.window;
  });
});
