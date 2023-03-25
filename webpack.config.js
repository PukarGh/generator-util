const path = require('path');
module.exports = {
    entry: './src/index.js',
    mode: 'production',
    target: 'node',
    resolve: {
        extensions: ['.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve('build'),
    },
}