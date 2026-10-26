## 2024-05-24 - Array Map Redundancy Optimization
**Learning:** In highly mathematical / statistical loop iterations, calling `.map()` to create temporary parallel arrays before reducing/looping them can add unnecessary O(N) allocation overhead that is easily avoided by directly accessing properties (`array[i].x`) inside a single `for` loop.
**Action:** Always check if we can calculate statistical variables (like linear regression variables) in a single pass without prior extraction/map layers.

## $(date +%Y-%m-%d) - Math.pow vs Multiplication in Distance Calculation
**Learning:** In hot path geometry calculations (like computing distances between thousands of points), using `Math.pow(dx, 2)` incurs a significant function call overhead compared to simple multiplication `dx * dx`. Replacing it preserves readability while providing a measurable speed boost across all modules that rely on `common.distance`.
**Action:** Always prefer direct multiplication for small integer powers (e.g., squaring) in performance-critical sections over `Math.pow`.

## 2026-10-23 - Array Reducer & ForEach Loop Optimization
**Learning:** Replacing `.reduce()` and `.forEach()` with standard `for` loops avoids allocating and executing callback functions for every element in an array, offering measurable performance improvements in loop-heavy processing.
**Action:** Use standard `for` loops in mathematical calculations over arrays to reduce overhead and improve execution speed.
## $(date +%Y-%m-%d) - Splitting Loops for Faster Math Operations
**Learning:** `Math.sqrt` is up to 3x faster than `Math.pow(x, 0.5)`. When looping over arrays of points, placing conditional type/tolerance checks *inside* the hot loop can slow down execution. Splitting the loop into separate `if/else` blocks outside the loop to execute the optimized `Math.sqrt` path ensures maximum performance.
**Action:** When working on geometry calculations involving default powers (e.g. `0.5`), split loops rather than using inline ternaries `tolerance === 0.5 ? Math.sqrt(x) : Math.pow(x, tolerance)` to avoid checking the condition on every iteration.

## 2026-10-26 - Preallocating Array in Map Replacements
**Learning:** When replacing `.map()` with a manual loop to prevent unnecessary overhead, using a preallocated array (e.g. `new Array(len)`) instead of `.push()` avoids dynamic array resizing and can be faster. However, in small arrays or depending on engine optimizations, standard loops might be fast enough.
**Action:** When replacing `.map()` that returns a same-length array, always use a pre-allocated array `const res = new Array(len)` and set indices directly.
