## 2024-10-15 - Uncovered Bug in analyzeSine

**Learning:** When generating tests for `analyzeSine`, drawing from right-to-left (`travelDirection === 'right'`) throws a `ReferenceError` due to a typo where `cur` is used instead of `current`. I must mock out right-to-left line drawing as a failing test instead of fixing it, per instructions.

**Action:** Add a test case testing right-to-left coordinates and mark it as `{ todo: true }` in `sine.test.js`. Do not fix `shapes/sine.js`.

## 2024-10-18 - Missing tests for boundary inputs and environment logic
**Learning:** Found edge case coverage gaps in `index.js` (lines 13-14) which checks `typeof window !== 'undefined'` but had no tests for it. Also discovered that boundary inputs like empty arrays `[]` and single-point arrays `[{x: 1, y: 1}]` had missing test coverage for `shapes/circle.js`, `shapes/line.js`, and `shapes/sine.js`.
**Action:** When working on math/geometry modules, always ensure that edge case inputs like empty, single, and two-element arrays are explicitly tested to document their boundary behavior (e.g. returning NaN, defaults, or throwing). Also write mock integration tests for module/window global assignments.
