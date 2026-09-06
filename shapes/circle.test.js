const { describe, it } = require('node:test');
const assert = require('node:assert');
const analyzeCircle = require('./circle');

describe('shapes/circle', () => {
  it('should initialize module circle without errors', () => {
    assert.notStrictEqual(analyzeCircle, undefined);
    assert.strictEqual(typeof analyzeCircle, 'function');
  });

  it('should correctly analyze a perfect circle with default tolerance', () => {
    const points = [
      { x: 0, y: 10 },
      { x: 10, y: 0 },
      { x: 0, y: -10 },
      { x: -10, y: 0 }
    ];
    const result = analyzeCircle(points);

    assert.ok(result);
    assert.deepStrictEqual(result.center, { x: 0, y: 0 });
    assert.strictEqual(result.radius, 10);
    assert.strictEqual(result.accuracy, 1);
    assert.ok(result.lowWeakPoint);
    assert.ok(result.highWeakPoint);
  });

  it('should analyze a circle with custom tolerance', () => {
    const points = [
      { x: 0, y: 12 },
      { x: 0, y: -12 },
      { x: 8, y: 0 },
      { x: -8, y: 0 }
    ];
    const result = analyzeCircle(points, 1);

    assert.deepStrictEqual(result.center, { x: 0, y: 0 });
    assert.strictEqual(result.radius, 10);
    assert.ok(Math.abs(result.accuracy - 0.8) < 1e-9);
  });

  it('should identify high and low weak points', () => {
    const p1 = { x: 0, y: 15 };
    const p2 = { x: 0, y: -15 };
    const p3 = { x: 5, y: 0 };
    const p4 = { x: -5, y: 0 };
    const points = [p1, p2, p3, p4];
    const result = analyzeCircle(points);

    assert.strictEqual(result.highWeakPoint, p1);
    assert.strictEqual(result.lowWeakPoint, p3);
    assert.strictEqual(result.highWeakPoint.d, 15);
    assert.strictEqual(result.lowWeakPoint.d, 5);
  });

  it('should correctly calculate center and radius for an offset circle', () => {
    const points = [
      { x: 10, y: 25 },
      { x: 15, y: 20 },
      { x: 10, y: 15 },
      { x: 5, y: 20 }
    ];
    const result = analyzeCircle(points);

    assert.deepStrictEqual(result.center, { x: 10, y: 20 });
    assert.strictEqual(result.radius, 5);
    assert.strictEqual(result.accuracy, 1);
  });
});
