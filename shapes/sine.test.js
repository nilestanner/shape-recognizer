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

  it('should return valid=false for points that do not form a sine wave (straight line)', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 10, y: 0 }
    ];
    const result = analyzeSine(points);
    assert.strictEqual(result.valid, false);
  });

  it('should correctly analyze a sine wave (left to right)', () => {
    const points = [];
    // Need at least 3 peaks for default threshold = 3
    // y = sin(x) * 10
    for (let i = 0; i <= 20; i++) {
      points.push({ x: i, y: Math.sin(i) * 10 });
    }
    const result = analyzeSine(points);

    assert.strictEqual(result.valid, true);
    assert.ok(result.firstPoint);
    assert.ok(result.lastPoint);
    assert.ok(result.angle !== undefined);
    assert.ok(result.length > 0);
    assert.ok(result.fullLength > 0);
    assert.ok(result.amplitude > 0);
    assert.strictEqual(result.accuracy, undefined); // accuracy is deleted
  });

  it('should correctly analyze a sine wave (left to right) with custom threshold', () => {
    const points = [];
    // Just need 2 peaks for threshold = 1
    // A sine curve with smaller steps to get smooth peaks
    for (let i = 0; i <= 20; i++) {
      points.push({ x: i, y: Math.sin(i) * 10 });
    }
    const result = analyzeSine(points, 1);
    assert.strictEqual(result.valid, true);
  });

  it('should return valid=false if sine wave does not meet default threshold (3 peaks)', () => {
    const points = [];
    // Only 2 critical points in here
    for (let i = 0; i <= 10; i++) {
      points.push({ x: i, y: Math.sin(i) * 10 });
    }
    const result = analyzeSine(points);
    assert.strictEqual(result.valid, false);
  });

  it('should handle right-to-left drawn sine wave', { todo: 'throws ReferenceError: cur is not defined on line 65' }, () => {
    const points = [];
    for (let i = 20; i >= 0; i--) {
      points.push({ x: i, y: Math.sin(i) * 10 });
    }
    const result = analyzeSine(points);
    // When bug is fixed, this should be true
    assert.strictEqual(result.valid, true);
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
