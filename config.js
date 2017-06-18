
module.exports = {
    // Listen port for blog server.
    // All the api and pages are serverd in.
    LISTEN_PORT: 4000,

    // The article data query from Wordpress database doesn't have paragraph(<p></p>)
    // So we must add paragraph(<p></p>) by others ways or do by ourselves. We can referred to
    // 1. WordPress: wp-includes/formatting.php wpautop() Line 245 (offical usage)
    // 2. Elgg: https://gist.github.com/hellekin/4021212 and
    //    Elgg: https://github.com/Elgg/Elgg/blob/master/engine/classes/ElggAutoP.php
    // 3. Mine: I just copied the Wordpress's offical implementation and deploied on my server.
    //    Method: POST, param: { post: 'the article data query from Wordpress...' }
    POST_AUTOP_API: 'http://localhost/test.php',
    // POST_AUTOP_API: 'https://api.tangbc.com/autop/',

    // Mysql socket path.
    // The path to a unix domain socket to connect to.
    // See https://github.com/mysqljs/mysql#connection-options
    MYSQL_SOCKET_PATH: '/Applications/MAMP/tmp/mysql/mysql.sock',

    // Category id of wordpress
    CATEGORY: {
        ARTICLE: 1, // 14
        ESSAY: 24, // 15
    },

    COMMENT_PAGE_ID: 2,

    LATEST_TITLE_COUNT: 9,

    LATEST_COMMENT_COUNT: 6,
}
