## 2024-05-24 - Array Map Redundancy Optimization
**Learning:** In highly mathematical / statistical loop iterations, calling `.map()` to create temporary parallel arrays before reducing/looping them can add unnecessary O(N) allocation overhead that is easily avoided by directly accessing properties (`array[i].x`) inside a single `for` loop.
**Action:** Always check if we can calculate statistical variables (like linear regression variables) in a single pass without prior extraction/map layers.
