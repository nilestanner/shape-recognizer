## 2024-05-15 - [DoS via Maximum Call Stack Size Exceeded]
**Vulnerability:** Application crash (DoS) via `Math.max.apply(null, xs)` on large arrays.
**Learning:** `Math.max.apply` pushes the entire array to the call stack as individual arguments. For large coordinate arrays, this triggers a 'Maximum call stack size exceeded' error.
**Prevention:** Always use single-pass `for` loops or `reduce` instead of `Function.prototype.apply` when finding min/max values in potentially large arrays like user drawing telemetry.

## 2024-10-18 - Fix DoS vulnerability in analyzeCircle
**Vulnerability:** Denial of Service (DoS) vulnerability via "Maximum call stack size exceeded" in `analyzeCircle()` when passed a large array.
**Learning:** `Math.max.apply` and `Math.min.apply` will throw a call stack exceeded error if the array passed is too large.
**Prevention:** Avoid `Math.max.apply` and `Math.min.apply` with unbounded inputs. Use loop iteration or `reduce` instead.
