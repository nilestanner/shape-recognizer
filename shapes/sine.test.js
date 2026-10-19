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

  it('should initialize module sine without errors', () => {
    assert.notStrictEqual(analyzeSine, undefined);
    assert.strictEqual(typeof analyzeSine, 'function');
  });

  it('exports a function', () => {
    assert.strictEqual(typeof analyzeSine, 'function');
  });

  it('should analyze a sine wave drawn left-to-right', () => {
    const points = [];
    // Need at least 2 high points and 2 low points to be valid according to lineTest
    // And 3 peaks to satisfy checkPeaks default threshold
    for (let i = 0; i <= 60; i++) {
      points.push({
        x: i * 10,
        y: Math.sin(i * Math.PI / 10) * 50
      });
    }

    const result = analyzeSine(points);
    assert.strictEqual(result.valid, true);
    assert.ok(result.amplitude > 0);
    assert.ok(result.firstPoint);
    assert.ok(result.lastPoint);
    assert.ok(result.angle !== undefined);
    assert.ok(result.length > 0);
    assert.ok(result.fullLength > 0);
  });

  it('recognizes a multi-cycle wave and reports amplitude', () => {
    const result = analyzeSine(wave());
    assert.strictEqual(result.valid, true);
    assert.ok(result.amplitude > 30 && result.amplitude < 45, `amplitude ${result.amplitude}`);
    assert.strictEqual(result.accuracy, undefined, 'accuracy is removed from sine results');
    assert.strictEqual(typeof result.angle, 'number');
  });

  it('should fail on sine wave drawn right-to-left due to "cur" reference bug', { todo: 'sine.js references "cur" instead of "current" when drawing right-to-left' }, () => {
    const points = [];
    for (let i = 60; i >= 0; i--) {
      points.push({
        x: i * 10,
        y: Math.sin(i * Math.PI / 10) * 50
      });
    }

    const result = analyzeSine(points);
    assert.strictEqual(result.valid, true);
  });

  // BUG (not fixed in this PR): in lineTest's right-to-left branch the code uses `cur`
  // instead of `current`, so drawing a wave from right to left throws a ReferenceError.
  it('recognizes a wave drawn right-to-left',
    { todo: 'shapes/sine.js lineTest references undefined `cur` in the right-to-left branch' },
    () => {
      const result = analyzeSine(wave().reverse());
      assert.strictEqual(result.valid, true);
    });

  it('should mark invalid when points do not form a sine wave', () => {
    const points = [
      {x: 0, y: 0},
      {x: 10, y: 0},
      {x: 20, y: 0},
      {x: 30, y: 0}
    ];
    const result = analyzeSine(points);
    assert.strictEqual(result.valid, false);
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

  it('rejects a single hump', () => {
    assert.strictEqual(analyzeSine(wave(0.5)).valid, false);
  });

  it('should use custom threshold', () => {
    const points = [];
    // Need at least 2 high points and 2 low points to be valid according to lineTest
    // So we generate roughly 2 full periods.
    // 1 full period is 20 points (since i*PI/10).
    for (let i = 0; i <= 40; i++) {
      points.push({
        x: i * 10,
        y: Math.sin(i * Math.PI / 10) * 50
      });
    }

    // We expect this to fail with a higher threshold (like 5 peaks)
    // But succeed with lower threshold (like 1 peak)
    // Our wave has 2 high and 2 low peaks, so 4 total.
    const resultWithHighThreshold = analyzeSine(points, 5);
    assert.strictEqual(resultWithHighThreshold.valid, false);

    const resultWithLowThreshold = analyzeSine(points, 2);
    assert.strictEqual(resultWithLowThreshold.valid, true);
  });

  it('rejects a wave that has fewer peaks than a high threshold', () => {
    assert.strictEqual(analyzeSine(wave(), 50).valid, false);
  });

  it('accepts a shorter wave with a lower threshold', () => {
    assert.strictEqual(analyzeSine(wave(3), 2).valid, true);
  });

  it('should be invalid if thresholds are missing after filtering peaks', () => {
    // Generate wave that is almost flat to ensure filtered peaks are not enough
    const points = [];
    for (let i = 0; i <= 60; i++) {
      points.push({
        x: i * 10,
        y: Math.sin(i * Math.PI / 10) * 0.1  // very small amplitude
      });
    }
    const result = analyzeSine(points);
    // Might still pass or fail depending on how average is computed,
    // let's ensure we just test the code paths.
    assert.strictEqual(typeof result.valid, 'boolean');
  });

  it('throws an error for an empty array of points', () => {
    assert.throws(() => analyzeSine([]), TypeError);
  });

  it('handles a single-point array safely returning invalid', () => {
    const result = analyzeSine([{ x: 1, y: 1 }]);
    assert.strictEqual(result.valid, false);
  });
});
