let db = require('./db')
let common = require('./common')

const DIGEST_LIMIT = 150

function getArticleIds (category_id) {
    return new Promise(function (resolve, reject) {
        let connection = db.createConnection()
        let QUERY_ARTICLE_IDS = 'SELECT object_id FROM wp_term_relationships ' +
                                'WHERE term_taxonomy_id = ' + connection.escape(category_id)

        connection.query(QUERY_ARTICLE_IDS, function (error, results) {
            connection.end()

            if (error) {
                reject(error)
                return
            }

            let ids = []
            results.forEach(function (rowData) {
                ids.push(rowData.object_id)
            })

            resolve(ids)
        })
    })
}

function getArticleList (ids) {
    return new Promise(function (resolve, reject) {
        if (!ids || !ids.length) {
            resolve([])
            return
        }

        let connection = db.createConnection()
        let SQL_ARTICLE_LIST = 'SELECT ID, post_title, post_name, post_date, post_content, comment_count ' +
                            'FROM wp_posts WHERE ID in('+ ids +') AND post_status=\'publish\' ' +
                            'AND post_type=\'post\' ORDER BY post_date DESC'

        connection.query(SQL_ARTICLE_LIST, function (error, results) {
            connection.end()

            if (error) {
                reject(error)
                return
            }

            // Formating fields
            results.map(function (article) {
                let pureContent = common.removeHTMLTag(article.post_content)

                article.post_date = common.toChineseDate(article.post_date)
                article.no_digest = article.post_content.length <= DIGEST_LIMIT
                article.post_thumbnail = common.getThumbnail(article.post_content)
                article.post_summary = common.getPostDesc(pureContent, DIGEST_LIMIT)

                delete article.post_content

                return article
            })

            resolve(results)
        })
    })
}

module.exports = function (query) {
    return new Promise(function (resolve, reject) {
        getArticleIds(query.category_id).then(getArticleList).then(function (result) {
            resolve(result)
        }).catch(function (err) {
            reject(err)
        })
    })
}
