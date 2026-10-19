
## 2023-10-18 - Avoid Math.max.apply on Large Arrays
**Learning:** Using `Math.max.apply(null, array)` is an anti-pattern for large arrays as it loads all array elements into the call stack, leading to `Maximum call stack size exceeded` errors. Combined with `.map()`, it can create large temporary arrays that stress the GC and increase memory usage overhead.
**Action:** Replace `Math.max.apply()` or `.map()` loops over large arrays with a single O(n) `for` loop to compute bounding limits and accumulate sums simultaneously. This guarantees safety from call stack limits and improves performance by reducing memory overhead.
