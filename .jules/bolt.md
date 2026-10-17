## 2024-10-17 - Max Call Stack Size Exceeded with Arrays
**Learning:** `Math.max.apply` and `Math.min.apply` will crash with "Maximum call stack size exceeded" on arrays larger than roughly ~100k elements. Array iterations with map and apply for simple tracking are less efficient and can crash the process in JavaScript.
**Action:** Instead of `apply`, use standard `for` loops initialized to `-Infinity` or `Infinity` to track min/max safely across large arrays to avoid crashing and improve iteration speed significantly.
