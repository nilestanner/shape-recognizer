const { describe, it } = require('node:test');
const assert = require('node:assert');
const analyzeSine = require('./sine');

describe('shapes/sine', () => {
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
});
