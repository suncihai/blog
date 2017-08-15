let siteConfig = {
    // Listen port for blog server.
    LISTEN_PORT: 4000,

    // Product config data.
    CATEGORY: {
        ARTICLE: 14,
        ESSAY: 15,
        COMMENT_PAGE: 539,
    },
    HOST: 'https://www.tangbc.com',

    // Article summary words.
    SUMMARY_LENGTH: 100,

    // Latest titles count aside.
    LATEST_TITLE_COUNT: 9,

    // Latest comment count aside.
    LATEST_COMMENT_COUNT: 6,

    // Is requesting comment author local by ip.
    REQUEST_COMMENT_LOCAL: true,

    // The ssr cache max age (hours).
    // For disable ssr cache, just set to 0.
    SSR_CACHE_MAX_AGE: 0,

    // The pages of using ssr cache.
    SSR_CACHE_PAGES: ['/', '/essay', '/message', '/resume'],

    NAVS: [
        { href: '/', text: '博客首页' },
        { href: '/essay', text: '我的随笔' },
        { href: '/message', text: '给我留言' },
        { href: '/resume', text: '个人简历' }
    ]
}

// For local development database.
if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'development'
) {
    siteConfig.CATEGORY = {
        ARTICLE: 1,
        ESSAY: 24,
        COMMENT_PAGE: 2
    }

    siteConfig.HOST = 'http://localhost:' + siteConfig.LISTEN_PORT

    // The path to a unix domain socket to connect to.
    // See https://github.com/mysqljs/mysql#connection-options
    siteConfig.MYSQL_SOCKET_PATH = '/Applications/MAMP/tmp/mysql/mysql.sock'
}

module.exports = siteConfig
