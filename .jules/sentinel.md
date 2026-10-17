## 2024-05-15 - [DoS via Maximum Call Stack Size Exceeded]
**Vulnerability:** Application crash (DoS) via `Math.max.apply(null, xs)` on large arrays.
**Learning:** `Math.max.apply` pushes the entire array to the call stack as individual arguments. For large coordinate arrays, this triggers a 'Maximum call stack size exceeded' error.
**Prevention:** Always use single-pass `for` loops or `reduce` instead of `Function.prototype.apply` when finding min/max values in potentially large arrays like user drawing telemetry.
