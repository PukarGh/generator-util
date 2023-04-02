const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
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
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/templates', to: 'templates' },
                { from: 'src/config.json', to: '.' },
            ],
        }),
    ],
}