const path = require('path')

// https://github.com/zeit/next.js#custom-configuration
module.exports = {
    webpack: (config, { dev }) => {
        if (dev) {
            config.module.rules.push({
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'components'),
                    path.resolve(__dirname, 'config'),
                    path.resolve(__dirname, 'pages'),
                    path.resolve(__dirname, 'server')
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
