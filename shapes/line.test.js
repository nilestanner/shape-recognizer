const { describe, it } = require('node:test');
const assert = require('node:assert');
const analyzeLine = require('./line');

describe('shapes/line', () => {
  it('should initialize module line without errors', () => {
    assert.notStrictEqual(analyzeLine, undefined);
    assert.strictEqual(typeof analyzeLine, 'function');
  });

  it('should return empty arrays when points array is empty', () => {
    const result = analyzeLine([]);
    assert.deepStrictEqual(result, [[], []]);
  });

  it('should correctly analyze a horizontal line', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 5, y: 0 },
      { x: 10, y: 0 }
    ];
    const result = analyzeLine(points);

    assert.ok(result);
    assert.strictEqual(result.accuracy, 1);
    assert.deepStrictEqual(result.firstPoint, { x: 0, y: 0 });
    assert.deepStrictEqual(result.lastPoint, { x: 10, y: 0 });
    assert.strictEqual(result.angle, 0);
    assert.strictEqual(result.length, 10);
    assert.strictEqual(result.fullLength, 10);
  });

  it('should correctly analyze a vertical line', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 0, y: 5 },
      { x: 0, y: 10 }
    ];
    const result = analyzeLine(points);

    assert.ok(result);
    assert.strictEqual(result.accuracy, 1);
    assert.deepStrictEqual(result.firstPoint, { x: 0, y: 0 });
    assert.deepStrictEqual(result.lastPoint, { x: 0, y: 10 });
    assert.ok(Math.abs(result.angle - Math.PI / 2) < 1e-9);
    assert.strictEqual(result.length, 10);
    assert.strictEqual(result.fullLength, 10);
  });

  it('should correctly analyze a diagonal line', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 10 }
    ];
    const result = analyzeLine(points);

    assert.ok(result);
    assert.strictEqual(result.accuracy, 1);
    assert.ok(Math.abs(result.firstPoint.x - 0) < 1e-9);
    assert.ok(Math.abs(result.firstPoint.y - 0) < 1e-9);
    assert.ok(Math.abs(result.lastPoint.x - 10) < 1e-9);
    assert.ok(Math.abs(result.lastPoint.y - 10) < 1e-9);
    assert.ok(Math.abs(result.angle - Math.PI / 4) < 1e-9);
    assert.ok(Math.abs(result.length - 10 * Math.SQRT2) < 1e-9);
    assert.ok(Math.abs(result.fullLength - 10 * Math.SQRT2) < 1e-9);
  });

  it('should analyze a line with noise and compute accuracy correctly', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 0 }
    ];
    const result = analyzeLine(points);

    assert.ok(result);
    assert.ok(result.accuracy < 1);
    assert.ok(Math.abs(result.accuracy - (10 / (10 * Math.SQRT2))) < 1e-9);
    assert.strictEqual(result.angle, 0);
    assert.strictEqual(result.length, 10);
  });

  it('should handle negative coordinates and offset lines', () => {
    const points = [
      { x: -10, y: -5 },
      { x: 0, y: -5 },
      { x: 10, y: -5 }
    ];
    const result = analyzeLine(points);

    assert.ok(result);
    assert.strictEqual(result.accuracy, 1);
    assert.deepStrictEqual(result.firstPoint, { x: -10, y: -5 });
    assert.deepStrictEqual(result.lastPoint, { x: 10, y: -5 });
    assert.strictEqual(result.length, 20);
    assert.strictEqual(result.fullLength, 20);
    assert.strictEqual(result.angle, 0);
  });
});
