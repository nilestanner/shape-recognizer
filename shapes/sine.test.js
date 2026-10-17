const { describe, it, beforeEach, mock } = require('node:test');
const assert = require('node:assert');
const analyzeSine = require('./sine');

// Left-to-right wave sampled every 5px along x.
const wave = (cycles = 3, samples = 60) => {
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    pts.push({ x: i * 5, y: Math.round(50 + 40 * Math.sin((i / samples) * Math.PI * 2 * cycles)) });
  }
  return pts;
};

describe('shapes/sine', () => {
  beforeEach(() => {
    // analyzeSine logs debug output on every call; keep test output clean.
    mock.method(console, 'log', () => {});
  });

  it('exports a function', () => {
    assert.strictEqual(typeof analyzeSine, 'function');
  });

  it('recognizes a multi-cycle wave and reports amplitude', () => {
    const result = analyzeSine(wave());
    assert.strictEqual(result.valid, true);
    assert.ok(result.amplitude > 30 && result.amplitude < 45, `amplitude ${result.amplitude}`);
    assert.strictEqual(result.accuracy, undefined, 'accuracy is removed from sine results');
    assert.strictEqual(typeof result.angle, 'number');
  });

  it('rejects a flat horizontal line', () => {
    const flat = [];
    for (let i = 0; i <= 20; i++) flat.push({ x: i * 5, y: 10 });
    const result = analyzeSine(flat);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.amplitude, undefined);
  });

  it('rejects a straight diagonal line', () => {
    const diag = [];
    for (let i = 0; i <= 20; i++) diag.push({ x: i * 5, y: i * 5 });
    assert.strictEqual(analyzeSine(diag).valid, false);
  });

  it('rejects a wave that has fewer peaks than a high threshold', () => {
    assert.strictEqual(analyzeSine(wave(), 50).valid, false);
  });

  it('accepts a shorter wave with a lower threshold', () => {
    assert.strictEqual(analyzeSine(wave(3), 2).valid, true);
  });

  it('rejects a single hump', () => {
    assert.strictEqual(analyzeSine(wave(0.5)).valid, false);
  });

  // BUG (not fixed in this PR): in lineTest's right-to-left branch the code uses `cur`
  // instead of `current`, so drawing a wave from right to left throws a ReferenceError.
  it('recognizes a wave drawn right-to-left',
    { todo: 'shapes/sine.js lineTest references undefined `cur` in the right-to-left branch' },
    () => {
      const result = analyzeSine(wave().reverse());
      assert.strictEqual(result.valid, true);
    });

  it('throws an error for an empty array of points', () => {
    assert.throws(() => analyzeSine([]), TypeError);
  });

  it('handles a single-point array safely returning invalid', () => {
    const result = analyzeSine([{ x: 1, y: 1 }]);
    assert.strictEqual(result.valid, false);
  });
});
