const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'shape-recognizer.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode:'production'
};
