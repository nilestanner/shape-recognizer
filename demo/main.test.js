const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const analyzer = require('../index.js');

let mockPointTexts = [];
let mockPaths = [];

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
    mockPointTexts.push(this);
  }
}

class MockPath {
  constructor(opts = {}) {
    this.segments = opts.segments ? [...opts.segments] : [];
    this.points = [];
    this.strokeColor = opts.strokeColor;
    this.selected = opts.selected;
    this.fullySelected = opts.fullySelected;
    mockPaths.push(this);
  }
  add(pt) {
    this.points.push(pt);
  }
}

function createEnvironment() {
  mockPointTexts = [];
  mockPaths = [];
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
  // Add the filename so that c8 coverage tool tracks the executions
  vm.runInContext(code, sandbox, { filename: path.join(__dirname, 'main.js') });

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
  beforeEach(() => {
    mockPointTexts = [];
    mockPaths = [];
  });

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

      // Verify that calling onMouseUp clears allPoints
      sandbox.onMouseUp({});
      assert.strictEqual(sandbox.allPoints.length, 0);
    });

    it('should handle onMouseUp for sine mode', () => {
      const { sandbox } = createEnvironment();
      sandbox.currentTesting = 'sine';

      sandbox.onMouseDown({ point: new MockPoint(0, 0) });
      sandbox.onMouseDrag({ point: new MockPoint(10, 10) });
      sandbox.onMouseDrag({ point: new MockPoint(20, 20) });

      sandbox.onMouseUp({});
      assert.strictEqual(sandbox.allPoints.length, 0);
    });

    it('should handle onMouseUp for line mode', () => {
      const { sandbox } = createEnvironment();
      sandbox.currentTesting = 'line';

      sandbox.onMouseDown({ point: new MockPoint(0, 0) });
      sandbox.onMouseDrag({ point: new MockPoint(5, 5) });
      sandbox.onMouseDrag({ point: new MockPoint(10, 10) });

      sandbox.onMouseUp({});
      assert.strictEqual(sandbox.allPoints.length, 0);
    });
  });

  describe('helper drawing functions', () => {
    it('should execute createx and create paths', () => {
      const { sandbox } = createEnvironment();
      const initialPathsCount = mockPaths.length;
      sandbox.createx(new MockPoint(50, 50), 'blue');
      assert.strictEqual(mockPaths.length, initialPathsCount + 2);
      assert.strictEqual(mockPaths[mockPaths.length-1].strokeColor, 'blue');
    });

    it('should execute drawLine and create a path', () => {
      const { sandbox } = createEnvironment();
      const initialPathsCount = mockPaths.length;
      sandbox.drawLine(new MockPoint(0, 0), new MockPoint(100, 100), 'green');
      assert.strictEqual(mockPaths.length, initialPathsCount + 1);
      assert.strictEqual(mockPaths[mockPaths.length-1].strokeColor, 'green');
      assert.strictEqual(mockPaths[mockPaths.length-1].points.length, 2);
    });

    it('should execute createPath and add points', () => {
      const { sandbox } = createEnvironment();
      const initialPathsCount = mockPaths.length;
      sandbox.createPath([new MockPoint(0, 0), new MockPoint(10, 10), new MockPoint(20, 20)], 'red');
      assert.strictEqual(mockPaths.length, initialPathsCount + 1);
      assert.strictEqual(mockPaths[mockPaths.length-1].strokeColor, 'red');
      assert.strictEqual(mockPaths[mockPaths.length-1].points.length, 3);
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

  describe('show result functions', () => {
    it('should show circle results with correct text and paths', () => {
      const { sandbox } = createEnvironment();
      const initialTextCount = mockPointTexts.length;
      sandbox.showCircleResults({
        accuracy: 0.9,
        center: { x: 10, y: 10 },
        radius: 5,
        highWeakPoint: { x: 15, y: 15 },
        lowWeakPoint: { x: 5, y: 5 }
      });
      // Should create 4 new PointTexts
      assert.strictEqual(mockPointTexts.length, initialTextCount + 4);
      assert.strictEqual(mockPointTexts[initialTextCount].content, 'accuracy: 90');
      assert.strictEqual(mockPointTexts[initialTextCount + 1].content, 'high point');
      assert.strictEqual(mockPointTexts[initialTextCount + 2].content, 'low point');
      assert.strictEqual(mockPointTexts[initialTextCount + 3].content, 'Radius 5');
    });

    it('should show line results with correct text and paths', () => {
      const { sandbox } = createEnvironment();
      const initialTextCount = mockPointTexts.length;
      sandbox.showLineResults({
        accuracy: 0.9,
        length: 20,
        angle: 0.5,
        firstPoint: { x: 0, y: 0 },
        lastPoint: { x: 20, y: 20 }
      });
      assert.strictEqual(mockPointTexts.length, initialTextCount + 1);
      assert.strictEqual(mockPointTexts[initialTextCount].content, 'Accuracy: 0.9\nLength: 20\nAngle: 0.5');
    });

    it('should show sine results with correct text', () => {
      const { sandbox } = createEnvironment();
      const initialTextCount = mockPointTexts.length;
      sandbox.showSineResults({
        valid: true,
        firstPoint: { x: 0, y: 0 },
        lastPoint: { x: 20, y: 20 }
      });
      assert.strictEqual(mockPointTexts.length, initialTextCount + 1);
      assert.strictEqual(mockPointTexts[initialTextCount].content, 'Valid: true');
    });
  });
});
