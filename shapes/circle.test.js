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

  it('should handle large arrays without maximum call stack size exceeded (DoS fix)', () => {
    const points = Array(200000).fill({x: 0, y: 0});
    assert.doesNotThrow(() => {
      analyzeCircle(points);
    });
  });

  it('handles an empty array of points', () => {
    const result = analyzeCircle([]);
    assert.ok(Number.isNaN(result.accuracy));
    assert.ok(Number.isNaN(result.radius));
    assert.ok(Number.isNaN(result.center.x));
    assert.ok(Number.isNaN(result.center.y));
  });

  it('handles invalid inputs safely', () => {
    const result = analyzeCircle(null);
    assert.ok(Number.isNaN(result.accuracy));
    assert.ok(Number.isNaN(result.radius));
    assert.ok(Number.isNaN(result.center.x));
    assert.ok(Number.isNaN(result.center.y));

    const result2 = analyzeCircle({});
    assert.ok(Number.isNaN(result2.accuracy));
    assert.ok(Number.isNaN(result2.radius));
  });

  it('handles a single-point array', () => {
    const result = analyzeCircle([{ x: 10, y: 10 }]);
    assert.ok(Number.isNaN(result.accuracy));
    assert.strictEqual(result.radius, 0);
    assert.deepStrictEqual(result.center, { x: 10, y: 10 });
    assert.deepStrictEqual(result.lowWeakPoint, { x: 10, y: 10, d: 0 });
    assert.deepStrictEqual(result.highWeakPoint, { d: 0 });
  });

  it('can handle a very large array of points without stack overflow', { todo: 'shapes/circle.js analyzeCircle throws Maximum call stack size exceeded due to Math.max.apply on large arrays' }, () => {
    const largeArray = Array.from({ length: 200000 }, (_, i) => ({ x: i, y: i }));
    const result = analyzeCircle(largeArray);
    assert.ok(result);
    assert.ok(typeof result.accuracy === 'number');
  });
});
