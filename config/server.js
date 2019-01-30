let serverConfig = {
    // 服务端口
    port: 5501,

    // 服务主机
    host: 'https://www.tangbc.com',

    // 服务端渲染缓存时间（分钟）
    // 关闭服务端渲染缓存设为 0
    cacheMaxage: 0,

    // 一级页面页面（文章页单独处理）
    topPaths: ['/', '/essay', '/about', '/resume'],

    // 需要提供在根目录的静态文件，比如：www.tangbc.com/test.txt
    // 目标文件需放在 /static/rootAssets 目录下，判断依据为 indexOf 为 0
    rootAssets: [
        'MP_verify_6IRzYt9UdhTYwh1a.txt'
    ],

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

    serverConfig.category.essay = 3
    serverConfig.category.article = 2
    serverConfig.category.comment = 539

    serverConfig.ssrCache = 0
    serverConfig.host = `http://${ip}:${serverConfig.port}`

    // https://github.com/mysqljs/mysql#connection-options
    serverConfig.socketPath = '/Applications/MAMP/tmp/mysql/mysql.sock'
}

module.exports = serverConfig
