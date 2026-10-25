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
## 2023-10-25 - Unhandled Exception / DoS in sine analyzer
**Vulnerability:** Denial of Service (DoS) via Unhandled Exception. The `analyzeSine` function in `shapes/sine.js` did not validate if the `points` array was empty before accessing `points[0].x`, leading to a `TypeError` crash.
**Learning:** Functions processing user-supplied arrays must validate the array length before accessing specific indices.
**Prevention:** Add input validation (e.g., `if (!points || points.length === 0) return { valid: false };`) at the beginning of exported module functions handling array inputs.

## 2024-10-23 - Missing input validation for non-array inputs (DoS risk)
**Vulnerability:** Unhandled TypeErrors could occur when shape analysis modules (`shapes/circle.js`, `shapes/line.js`, `shapes/sine.js`) were passed invalid input types such as `null`, `undefined`, or `{}` instead of arrays. This could crash the backend node process, leading to a Denial of Service (DoS).
**Learning:** Functions that process arrays must use `Array.isArray(points)` to validate input types strictly before accessing array-specific properties (`length`) or entering loops, rather than just using loose truthiness checks (e.g. `!points`). Furthermore, graceful fallbacks must match the expected structural return types to prevent cascading TypeErrors downstream.
**Prevention:** Implement `Array.isArray` checks at the beginning of all modules exported to handle arrays, and write tests specifically asserting that the module gracefully handles non-array input by returning the functionally accurate default structure without throwing an error.
## 2026-10-25 - Prevent Unhandled TypeErrors in Shape Recognition\n**Vulnerability:** Application crashes due to unhandled TypeErrors when evaluating malformed coordinate objects (like `[null]`) because  checks were insufficient.\n**Learning:** Just verifying that an input is an array does not guarantee the elements possess the required schema structure ( and  number properties), which is dangerous for Node applications handling remote user input without strict bounds.\n**Prevention:** Added  to strictly assert element structures before mathematically querying coordinates.\n
## 2026-10-25 - Prevent Unhandled TypeErrors in Shape Recognition
**Vulnerability:** Application crashes due to unhandled TypeErrors when evaluating malformed coordinate objects (like `[null]`) because `Array.isArray()` checks were insufficient.
**Learning:** Just verifying that an input is an array does not guarantee the elements possess the required schema structure (`x` and `y` number properties), which is dangerous for Node applications handling remote user input without strict bounds.
**Prevention:** Added `common.filterValidPoints` to strictly assert element structures before mathematically querying coordinates.
