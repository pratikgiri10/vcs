// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './services/chatService.js',
    cache: false,
    experiments: {
        outputModule: true
      },
    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename: 'bundle.js',
        library: {
            type: 'module',
        },
    },
    
    
    // plugins: [
    //     new CleanWebpackPlugin(), // Clears `dist` on each build
    // ],
    // Additional configurations as needed
};


// experiments: {
//   outputModule: true
// },