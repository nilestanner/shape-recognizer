# Probe's Journal

## 2024-10-16 - Found bug in sine analyzer while adding coverage
**Learning:** `shapes/sine.js` has a bug where `cur` is referenced instead of `current` on line 65 and 68 when `travelDirection` is `'right'`. This module is currently untested, causing this reference error to go unnoticed.
**Action:** Write tests for `shapes/sine.js`. Ensure I cover the left-to-right and right-to-left drawing paths to expose this bug. Mark the failing right-to-left test as `todo` and document the bug in the PR.

## 2024-10-18 - Missing tests for boundary inputs and environment logic
**Learning:** Found edge case coverage gaps in `index.js` (lines 13-14) which checks `typeof window !== 'undefined'` but had no tests for it. Also discovered that boundary inputs like empty arrays `[]` and single-point arrays `[{x: 1, y: 1}]` had missing test coverage for `shapes/circle.js`, `shapes/line.js`, and `shapes/sine.js`.
**Action:** When working on math/geometry modules, always ensure that edge case inputs like empty, single, and two-element arrays are explicitly tested to document their boundary behavior (e.g. returning NaN, defaults, or throwing). Also write mock integration tests for module/window global assignments.
