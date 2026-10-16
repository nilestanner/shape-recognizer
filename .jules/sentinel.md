## 2026-10-16 - DoS via Call Stack Overflow
**Vulnerability:** Application crash (DoS) via `RangeError: Maximum call stack size exceeded` triggered by large array inputs.
**Learning:** Using `Math.max.apply(null, array)` spreads the array into individual arguments. JavaScript engines have a hard limit on function arguments (typically around 65,000 to 120,000), causing crashes on large user-provided coordinate datasets.
**Prevention:** Use `Array.prototype.reduce` (e.g., `arr.reduce((a, b) => Math.max(a, b), -Infinity)`) or simple iterative loops instead of `Function.prototype.apply` when finding min/max values in potentially large, unbounded arrays.
