## 2024-10-18 - Fix DoS vulnerability in analyzeCircle
**Vulnerability:** Denial of Service (DoS) vulnerability via "Maximum call stack size exceeded" in `analyzeCircle()` when passed a large array.
**Learning:** `Math.max.apply` and `Math.min.apply` will throw a call stack exceeded error if the array passed is too large.
**Prevention:** Avoid `Math.max.apply` and `Math.min.apply` with unbounded inputs. Use loop iteration or `reduce` instead.
