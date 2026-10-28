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

## $(date +%Y-%m-%d) - Array map and every loops overhead
**Learning:** The higher-order array methods `.map()` and `.every()` create execution overhead in loops from allocating and calling callback functions for each element. In a hot-path iteration (like points processing), converting these to standard `for` loops significantly improves execution time without sacrificing code readability. When refactoring `.map()`, creating a pre-allocated array of a specific length using `new Array(points.length)` helps avoid the performance penalty of dynamic array re-allocations.
**Action:** When identifying loops that perform heavy iterations over objects (e.g. hundreds of thousands of point geometry calculations), prefer standard `for` loops combined with pre-allocated arrays where appropriate instead of higher-order functional callbacks.
