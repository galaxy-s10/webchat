module.exports = {
    // publicPath: '/webchat/',
    configureWebpack: {
        resolve: {
            alias: {
                'components': '@/components',
                'view': '@/view',
                'router': '@/router',
                'store': '@/store',
                'api': '@/api',
            }
        }
    },
    devServer: {
        proxy: {
            // 本地调试需要反向代理，但是由于上线时项目是静态文件，用不到，只需要直接写接口就行
            '/webchat': {
                target: 'https://www.zhengbeining.com/webchat',
                // target: 'http://localhost:5001',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/webchat': ''
                }
            }
        }
    }
}