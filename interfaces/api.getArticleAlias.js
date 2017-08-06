let db = require('./db')

function getAliasByArticleId (article_id) {
    return new Promise(function (resolve, reject) {
        let connection = db.createConnection()
        let id = connection.escape(article_id)
        let QUERY_ALIAS = 'SELECT post_name FROM wp_posts WHERE ID = ' + id +
                            ' AND post_status=\'publish\'' +
                            ' AND post_type=\'post\' LIMIT 1'

        connection.query(QUERY_ALIAS, function (error, result) {
            connection.end()

            if (error) {
                reject(error)
                throw error
            }

            let article = result && result[0]
            resolve(article && article.post_name)
        })
    })
}

module.exports = function (query) {
    return new Promise(function (resolve, reject) {
        getAliasByArticleId(query.article_id).then(function (result) {
            resolve(result)
        }).catch(function (err) {
            reject(err)
        })
    })
}
