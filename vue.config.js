module.exports = {
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://94.191.52.38:100',
                    ws: true,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': ''
                    }
                },
            }
        }
    }