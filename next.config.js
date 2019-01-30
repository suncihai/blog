const path = require('path')

// https://github.com/zeit/next.js#custom-configuration
module.exports = {
    distDir: 'build',

    webpack: (config, { dev }) => {
        if (dev) {
            config.module.rules.push({
                test: /\.js$/,
                exclude: [
                    path.resolve(__dirname, 'static'),
                    path.resolve(__dirname, 'node_modules')
                ],
                loader: 'eslint-loader',
                options: {
                    // eslint options (if necessary)
                }
            })
        }
        return config
    }
}
