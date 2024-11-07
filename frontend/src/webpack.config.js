
const path = require('path');

module.exports = {
    entry: {
        device: './services/mediasoupServices/device.js',
    },
    experiments: {
        outputModule: true
      },
    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename: '[name].bundle.js',   
        library: {
            type: 'module'
        }, 
        clean: true,
    },
    optimization: {
        // Ensure exports are properly handled in the bundle
        usedExports: true,
      },
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
    
  
};


