## 2024-03-24 - [DoS Vulnerability in Math.pow]
**Vulnerability:** DoS due to `Math.pow(pt.d - averageDistance) / averageDistance, tolerance)` without capping `tolerance`.
**Learning:** High exponent values can result in large output strings, high processing times or Infinity.
**Prevention:** Bound exponents when they're user-provided.

## 2024-03-24 - [DoS Vulnerability via Missing Input Point Validation]
**Vulnerability:** Application crashes (DoS) when array elements are missing or null in `points` due to unhandled TypeErrors from property accesses like `points[i].x`.
**Learning:** Checking `Array.isArray(points)` is insufficient if downstream logic blindly assumes all array elements strictly conform to the expected `{x, y}` object signature.
**Prevention:** Validate array elements strictly (e.g. `typeof pt.x === 'number'`) before extracting properties when handling arbitrary user input.

## 2024-03-24 - [DoS Vulnerability via Missing Input Point Validation]
**Vulnerability:** Application crashes (DoS) when array elements are missing or null in `points` due to unhandled TypeErrors from property accesses like `points[i].x`.
**Learning:** Checking `Array.isArray(points)` is insufficient if downstream logic blindly assumes all array elements strictly conform to the expected `{x, y}` object signature.
**Prevention:** Validate array elements strictly (e.g. `typeof pt.x === 'number'`) before extracting properties when handling arbitrary user input.

