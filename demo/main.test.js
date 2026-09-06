const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const analyzer = require('../index.js');

class MockPoint {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class MockPointText {
  constructor(opts = {}) {
    this.content = opts.content;
    this.point = opts.point;
    this.fillColor = opts.fillColor;
  }
}

class MockPath {
  constructor(opts = {}) {
    this.segments = opts.segments ? [...opts.segments] : [];
    this.points = [];
    this.strokeColor = opts.strokeColor;
    this.selected = opts.selected;
    this.fullySelected = opts.fullySelected;
  }
  add(pt) {
    this.points.push(pt);
  }
}

function createEnvironment() {
  const listeners = {};
  const elements = {};

  const document = {
    getElementById(id) {
      if (!elements[id]) {
        elements[id] = {
          addEventListener(event, handler) {
            listeners[id + ':' + event] = handler;
          },
        };
      }
      return elements[id];
    },
  };

  const code = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf-8');
  const sandbox = {
    Point: MockPoint,
    PointText: MockPointText,
    Path: MockPath,
    document,
    analyzer,
    Math,
    console: { log: () => {} },
  };

  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);

  return { sandbox, listeners, elements };
}

global.Point = MockPoint;
global.PointText = MockPointText;
global.Path = MockPath;
global.analyzer = analyzer;
const globalListeners = {};
global.document = {
  getElementById(id) {
    return {
      addEventListener(event, handler) {
        globalListeners[id + ':' + event] = handler;
      },
    };
  },
};

describe('demo/main.js', () => {
  it('should initialize module main without errors', () => {
    assert.doesNotThrow(() => {
      require('./main.js');
    });
  });

  describe('shape switching', () => {
    it('should switch shape correctly with switchShape', () => {
      const { sandbox } = createEnvironment();
      assert.strictEqual(sandbox.currentTesting, 'circle');
      assert.strictEqual(sandbox.textItem.content, 'Click and drag to draw a line. (circle)');

      sandbox.switchShape('sine');
      assert.strictEqual(sandbox.currentTesting, 'sine');
      assert.strictEqual(sandbox.textItem.content, 'Click and drag to draw a line. (sine)');

      sandbox.switchShape('line');
      assert.strictEqual(sandbox.currentTesting, 'line');
      assert.strictEqual(sandbox.textItem.content, 'Click and drag to draw a line. (line)');
    });

    it('should handle button click event listeners', () => {
      const { sandbox, listeners } = createEnvironment();

      assert.strictEqual(typeof listeners['circleBtn:click'], 'function');
      assert.strictEqual(typeof listeners['sineBtn:click'], 'function');
      assert.strictEqual(typeof listeners['lineBtn:click'], 'function');

      listeners['sineBtn:click']();
      assert.strictEqual(sandbox.currentTesting, 'sine');
      assert.strictEqual(sandbox.textItem.content, 'Click and drag to draw a line. (sine)');

      listeners['lineBtn:click']();
      assert.strictEqual(sandbox.currentTesting, 'line');
      assert.strictEqual(sandbox.textItem.content, 'Click and drag to draw a line. (line)');

      listeners['circleBtn:click']();
      assert.strictEqual(sandbox.currentTesting, 'circle');
      assert.strictEqual(sandbox.textItem.content, 'Click and drag to draw a line. (circle)');
    });
  });

  describe('mouse events', () => {
    it('should handle onMouseDown, onMouseDrag, and onMouseUp for circle', () => {
      const { sandbox } = createEnvironment();
      sandbox.currentTesting = 'circle';

      sandbox.onMouseDown({ point: new MockPoint(10, 20) });
      assert.ok(sandbox.path);
      assert.strictEqual(sandbox.path.fullySelected, true);

      sandbox.onMouseDown({ point: new MockPoint(15, 25) });

      sandbox.onMouseDrag({ point: new MockPoint(30, 40) });
      sandbox.onMouseDrag({ point: new MockPoint(50, 60) });
      assert.strictEqual(sandbox.allPoints.length, 2);

      assert.doesNotThrow(() => {
        sandbox.onMouseUp({});
      });
      assert.strictEqual(sandbox.allPoints.length, 0);
    });

    it('should handle onMouseUp for sine mode', () => {
      const { sandbox } = createEnvironment();
      sandbox.currentTesting = 'sine';

      sandbox.onMouseDown({ point: new MockPoint(0, 0) });
      sandbox.onMouseDrag({ point: new MockPoint(10, 10) });
      sandbox.onMouseDrag({ point: new MockPoint(20, 20) });

      assert.doesNotThrow(() => {
        sandbox.onMouseUp({});
      });
      assert.strictEqual(sandbox.allPoints.length, 0);
    });

    it('should handle onMouseUp for line mode', () => {
      const { sandbox } = createEnvironment();
      sandbox.currentTesting = 'line';

      sandbox.onMouseDown({ point: new MockPoint(0, 0) });
      sandbox.onMouseDrag({ point: new MockPoint(5, 5) });
      sandbox.onMouseDrag({ point: new MockPoint(10, 10) });

      assert.doesNotThrow(() => {
        sandbox.onMouseUp({});
      });
      assert.strictEqual(sandbox.allPoints.length, 0);
    });
  });

  describe('helper drawing functions', () => {
    it('should execute createx without errors', () => {
      const { sandbox } = createEnvironment();
      assert.doesNotThrow(() => {
        sandbox.createx(new MockPoint(50, 50), 'blue');
      });
    });

    it('should execute drawLine without errors', () => {
      const { sandbox } = createEnvironment();
      assert.doesNotThrow(() => {
        sandbox.drawLine(new MockPoint(0, 0), new MockPoint(100, 100), 'green');
      });
    });

    it('should execute createPath without errors', () => {
      const { sandbox } = createEnvironment();
      assert.doesNotThrow(() => {
        sandbox.createPath([new MockPoint(0, 0), new MockPoint(10, 10), new MockPoint(20, 20)], 'red');
      });
    });
  });

  describe('rotate', () => {
    it('should rotate point around pivot by angle', () => {
      const { sandbox } = createEnvironment();
      const pivot = { x: 0, y: 0 };
      const pt = { x: 10, y: 0 };
      const rotated = sandbox.rotate(pivot, pt, Math.PI / 2);
      assert.strictEqual(rotated.x, 0);
      assert.strictEqual(rotated.y, -10);
    });

    it('should return same point when rotated by 0 radians', () => {
      const { sandbox } = createEnvironment();
      const pivot = { x: 5, y: 5 };
      const pt = { x: 15, y: 5 };
      const rotated = sandbox.rotate(pivot, pt, 0);
      assert.strictEqual(rotated.x, 15);
      assert.strictEqual(rotated.y, 5);
    });
  });
});
