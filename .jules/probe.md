# Probe's Journal
## 2024-10-16 - Found bug in sine analyzer while adding coverage
**Learning:** `shapes/sine.js` has a bug where `cur` is referenced instead of `current` on line 65 and 68 when `travelDirection` is `'right'`. This module is currently untested, causing this reference error to go unnoticed.
**Action:** Write tests for `shapes/sine.js`. Ensure I cover the left-to-right and right-to-left drawing paths to expose this bug. Mark the failing right-to-left test as `todo` and document the bug in the PR.
