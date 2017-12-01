let serverConfig = {
    // 服务端口
    port: 4000,

    // 服务主机
    host: 'https://www.tangbc.com',

    // 服务端渲染缓存时间（小时）
    // 关闭服务端渲染缓存设为 0
    ssrCache: 24,

    // 数据库字段 id
    category: {
        essay: 15,
        article: 14,
        comment: 539
    },

    // 文章摘要字数
    summaryLength: 80,

    // 评论列表是否加载评论所在地区
    commentLocal: true,

    // 评论字数限制
    commentCharLimit: {
        email: 50,
        content: 300,
        nickname: 20,
        homepage: 100
    }
}

// 开发模式调整为本地数据库
if (process.env.NODE_ENV !== 'production') {
    serverConfig.category.essay = 24
    serverConfig.category.article = 1
    serverConfig.category.comment = 2

    serverConfig.ssrCache = 0
    serverConfig.host = 'http://localhost:' + serverConfig.port

    // https://github.com/mysqljs/mysql#connection-options
    serverConfig.socketPath = '/Applications/MAMP/tmp/mysql/mysql.sock'
}

module.exports = serverConfig
