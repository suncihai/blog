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

    // Latest titles count aside.
    LATEST_TITLE_COUNT: 9,

    // Latest comment count aside.
    LATEST_COMMENT_COUNT: 6,

    // Is requesting comment author local by ip.
    REQUEST_COMMENT_LOCAL: true,

    // The article data query from Wordpress database doesn't have paragraph(<p></p>)
    // So we must add paragraph(<p></p>) by others ways or do ourselves. We can referred to
    // 1. WordPress: wp-includes/formatting.php wpautop() Line 245 (offical usage)
    // 2. Elgg: https://gist.github.com/hellekin/4021212 and
    //    Elgg: https://github.com/Elgg/Elgg/blob/master/engine/classes/ElggAutoP.php
    // 3. Mine: I just copied the Wordpress's offical implementation and deploied on my server.
    //    Method: POST, param: { post: 'the article data query from Wordpress...' }
    POST_AUTOP_API: 'https://api.tangbc.com/autop/',
}

// For local development database
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
