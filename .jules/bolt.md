## 2024-10-15 - Stack overflow using Math.max.apply on large arrays
**Learning:** `Math.max.apply(null, arr)` passes array items as arguments to the function. When the array is very large, this causes a "Maximum call stack size exceeded" error. It's also slower due to `map` allocations.
**Action:** Use a simple `for` loop to track min/max manually on arrays of unbounded sizes.
