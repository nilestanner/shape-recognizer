## 2023-10-25 - Call Stack Overflow / DoS from Math.max.apply()
**Vulnerability:** Denial of Service (DoS) via "Maximum call stack size exceeded". When passing a very large, user-controlled array to `Math.max.apply(null, arr)` or `Math.min.apply(null, arr)`, the engine attempts to push all array elements onto the call stack as individual arguments, causing a stack overflow if the array is large enough (e.g. from a lengthy drawing path).
**Learning:** `Function.prototype.apply()` should not be used with dynamically-sized arrays where the length can exceed typical argument limits (~65k to 120k arguments depending on the JavaScript engine). This creates an easy DoS vector.
**Prevention:** Use `Array.prototype.reduce()` or a standard `for` loop to compute min/max over arrays of unbounded size, which iterates rather than spreading arguments onto the call stack.

## 2024-10-18 - Fix DoS vulnerability in analyzeCircle
**Vulnerability:** Denial of Service (DoS) vulnerability via "Maximum call stack size exceeded" in `analyzeCircle()` when passed a large array.
**Learning:** `Math.max.apply` and `Math.min.apply` will throw a call stack exceeded error if the array passed is too large.
**Prevention:** Avoid `Math.max.apply` and `Math.min.apply` with unbounded inputs. Use loop iteration or `reduce` instead.

## 2024-10-18 - Information Exposure via debug logs
**Vulnerability:** Stray debug statement `console.log(lineTestResult);` in `shapes/sine.js` could inadvertently expose internal line testing results (including raw point data and metadata) if processed on a server backend or clutter the client console.
**Learning:** Development logging, when left in production code, constitutes a minor Information Exposure (CWE-215) risk. Additionally, attempting to explain removed code via lingering in-code comments (e.g. `// SECURITY: Removed...`) is an anti-pattern that borders on "security theater." Code changes should stand on their own or be documented via commit messages.
**Prevention:** Scrub debug logging before code review/production deployment. Rely on version control rather than inline comments for tracking removed statements.
