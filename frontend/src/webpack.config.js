// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './services/mediaSoupService.js',
    cache: false,
    // experiments: {
    //     outputModule: true
    //   },
    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename: 'bundle.js',        
        // library: {
        //     type: 'module',
        // },
        library: 'library',    // very important line
        libraryTarget: 'umd',    // very important line
        umdNamedDefine: true    
    },
    
    
    // plugins: [
    //     new CleanWebpackPlugin(), // Clears `dist` on each build
    // ],
    // Additional configurations as needed
};


// experiments: {
//   outputModule: true
// },