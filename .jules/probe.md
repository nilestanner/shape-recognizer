## 2024-10-15 - Uncovered Bug in analyzeSine

**Learning:** When generating tests for `analyzeSine`, drawing from right-to-left (`travelDirection === 'right'`) throws a `ReferenceError` due to a typo where `cur` is used instead of `current`. I must mock out right-to-left line drawing as a failing test instead of fixing it, per instructions.

**Action:** Add a test case testing right-to-left coordinates and mark it as `{ todo: true }` in `sine.test.js`. Do not fix `shapes/sine.js`.
