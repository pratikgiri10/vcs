const { type } = require('os');
const path = require('path');

module.exports = {
  entry: './services/socketConnection.js',
  mode: 'production',
    experiments: {
        outputModule: true
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: {
      type: 'module'
    }
  },
};