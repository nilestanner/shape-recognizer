# Shape Recognizer

[Demo](https://nilestanner.com/shape-recognizer/demo/)

## Installation

### With node
```
npm install drawn-shape-recognizer --save
```

### Form web

```
<script type="text/javascript" src="https://cdn.rawgit.com/nilestanner/shape-recognizer/master/dist/bundle.js"></script>
```

## Usage

### Node

```
var analyzer = require('drawn-shape-recognizer');
var result = analyzer.analyzeLine(path);
```

### Web
```
var result = analyzer.analyzeLine(path);
```

### Input

Each analyzer requires a path to be passed to the function. A path is just a array of points as detailed below:
```
[
  {x:1, y:1},
  {x:2, y:2},
  {x:3, y:3},
  ...
]
```

## Available analyzers

### Line

`analyzer.analyzeLine(path)`

Params
* **Path**: *required*

Returns: (sample)
```
{
  "accuracy": 0.9885166624155463,
  "firstPoint": {
    "x": 198.26022405480967,
    "y": 202
  },
  "lastPoint": {
    "x": 303.1660125736366,
    "y": 429
  },
  "angle": 2.0036999222120717,
  "length": 250.0684395615665,
  "fullLength": 252.97341872872178
}
```

### Circle

`analyzer.analyzeCircle(path, tolerance)`

Params
* **Path**: *required*
* **Tolerance**: *optional*, defaults to 0.5, higher values will create lower accuracies. Affects accuracy exponentially.

Returns: (sample)
```
{
  "accuracy": 0.7418937280701574,
  "lowWeakPoint": {
    "x": 694,
    "y": 403,
    "d": 74.50167783345553
  },
  "highWeakPoint": {
    "x": 790,
    "y": 299,
    "d": 99.95248871338822
  },
  "radius": 84.4677113911917,
  "center": {
    "x": 694.5,
    "y": 328.5
  }
}
```

### Sine

`analyzer.analyzeSine(path, tolerance)`

Params
* **Path**: *required*
* **Tolerance**: *optional*, defaults to 3. Higher values will require more periods at a rate of 1 period to 2 tolerance.

Returns: (sample)
```
{
  "firstPoint": {
    "x": 213,
    "y": 581.0617894123257
  },
  "lastPoint": {
    "x": 588,
    "y": 537.8485298771301
  },
  "angle": -0.11472930732638137,
  "length": 377.48163637408396,
  "fullLength": 528.6411918841926,
  "amplitude": 23,
  "valid": true
}
```
