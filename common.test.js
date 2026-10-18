const { describe, it } = require('node:test');
const assert = require('node:assert');
const common = require('./common.js');

describe('common', () => {
  describe('distance', () => {
    it('returns 0 for identical points', () => {
      assert.strictEqual(common.distance({ x: 3, y: 4 }, { x: 3, y: 4 }), 0);
    });

    it('computes the 3-4-5 triangle hypotenuse', () => {
      assert.strictEqual(common.distance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
    });

    it('is symmetric and handles negative coordinates', () => {
      const a = { x: -2, y: -3 };
      const b = { x: 1, y: 1 };
      assert.strictEqual(common.distance(a, b), 5);
      assert.strictEqual(common.distance(b, a), 5);
    });
  });

  describe('isVertical', () => {
    it('returns undefined for no points', () => {
      assert.strictEqual(common.isVertical([]), undefined);
    });

    it('is true when the y span is larger than the x span', () => {
      assert.strictEqual(common.isVertical([{ x: 0, y: 0 }, { x: 1, y: 10 }]), true);
    });

    it('is false when the x span is larger than the y span', () => {
      assert.strictEqual(common.isVertical([{ x: 0, y: 0 }, { x: 10, y: 1 }]), false);
    });

    it('is false for a perfect diagonal (tie)', () => {
      assert.strictEqual(common.isVertical([{ x: 0, y: 0 }, { x: 5, y: 5 }]), false);
    });

    it('only compares first and last points', () => {
      const pts = [{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 10, y: 1 }];
      assert.strictEqual(common.isVertical(pts), false);
    });
  });

  describe('rotate', () => {
    it('rotating by 0 returns the (rounded) point', () => {
      assert.deepStrictEqual(common.rotate({ x: 0, y: 0 }, { x: 5, y: 7 }, 0), { x: 5, y: 7 });
    });

    it('rotating the pivot about itself leaves it in place', () => {
      assert.deepStrictEqual(common.rotate({ x: 4, y: 4 }, { x: 4, y: 4 }, 1.234), { x: 4, y: 4 });
    });

    it('rotates by a quarter turn about the origin (y-down screen convention)', () => {
      // newX = cos*dx + sin*dy, newY = cos*dy - sin*dx
      assert.deepStrictEqual(common.rotate({ x: 0, y: 0 }, { x: 10, y: 0 }, Math.PI / 2), { x: 0, y: -10 });
    });

    it('rotates about a non-origin pivot', () => {
      assert.deepStrictEqual(common.rotate({ x: 10, y: 10 }, { x: 20, y: 10 }, Math.PI), { x: 0, y: 10 });
    });

    it('rotating by an angle then its negative round-trips', () => {
      const pivot = { x: 2, y: 3 };
      const p = { x: 50, y: 40 };
      const back = common.rotate(pivot, common.rotate(pivot, p, 0.5), -0.5);
      assert.ok(Math.abs(back.x - p.x) <= 1 && Math.abs(back.y - p.y) <= 1);
    });
  });
});
