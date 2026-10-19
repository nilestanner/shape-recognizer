## 2023-10-25 - Call Stack Overflow / DoS from Math.max.apply()
**Vulnerability:** Denial of Service (DoS) via "Maximum call stack size exceeded". When passing a very large, user-controlled array to `Math.max.apply(null, arr)` or `Math.min.apply(null, arr)`, the engine attempts to push all array elements onto the call stack as individual arguments, causing a stack overflow if the array is large enough (e.g. from a lengthy drawing path).
**Learning:** `Function.prototype.apply()` should not be used with dynamically-sized arrays where the length can exceed typical argument limits (~65k to 120k arguments depending on the JavaScript engine). This creates an easy DoS vector.
**Prevention:** Use `Array.prototype.reduce()` or a standard `for` loop to compute min/max over arrays of unbounded size, which iterates rather than spreading arguments onto the call stack.

## 2024-10-18 - Fix DoS vulnerability in analyzeCircle
**Vulnerability:** Denial of Service (DoS) vulnerability via "Maximum call stack size exceeded" in `analyzeCircle()` when passed a large array.
**Learning:** `Math.max.apply` and `Math.min.apply` will throw a call stack exceeded error if the array passed is too large.
**Prevention:** Avoid `Math.max.apply` and `Math.min.apply` with unbounded inputs. Use loop iteration or `reduce` instead.
