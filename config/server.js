let serverConfig = {
    // 服务端口
    port: 5501,

    // 服务主机
    host: 'https://www.tangbc.com',

    // 服务端渲染缓存时间（分钟）
    // 关闭服务端渲染缓存设为 0
    cacheMaxage: 5,

    // 服务端渲染缓存的页面（文章页单独处理）
    cachePaths: ['/', '/essay', '/about', 'resume'],

    // 数据库字段 id
    category: {
        essay: 4,
        article: 2,
        comment: 539
    },

    // 搜索结果高亮前后字符数
    searchRange: 30,

    // 文章摘要字数
    summaryLength: 80,

    // 评论列表是否加载评论所在地区
    commentLocal: true,

    // 评论字数限制
    commentCharLimit: {
        email: 50,
        content: 300,
        nickname: 12,
        homepage: 100
    }
}

// 开发模式调整为本地数据库
if (process.env.NODE_ENV !== 'production') {
    const ip = (() => {
        const os = require('os')
        const interfaces = os.networkInterfaces()
        const envs = interfaces.en0 || interfaces.eth0 || []
        const env = envs.find(env => env.family === 'IPv4') || {}
        return env.address || 'localhost'
    })()

    serverConfig.category.essay = 24
    serverConfig.category.article = 1
    serverConfig.category.comment = 2

    serverConfig.ssrCache = 0
    serverConfig.host = `http://${ip}:${serverConfig.port}`

    // https://github.com/mysqljs/mysql#connection-options
    serverConfig.socketPath = '/Applications/MAMP/tmp/mysql/mysql.sock'
}

module.exports = serverConfig
