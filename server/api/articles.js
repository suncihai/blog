let db = require('../db')
let util = require('../utils')
let config = require('../../config')

const SUMMARY_LIMIT = config.SUMMARY_LENGTH

function getArticleIds (category_id) {
    return new Promise(function (resolve, reject) {
        let categoryId = util.isNumeric(category_id) ? category_id : 0
        let connection = db.createConnection()
        let QUERY_ARTICLE_IDS = 'SELECT object_id FROM wp_term_relationships ' +
                                'WHERE term_taxonomy_id = ' + categoryId

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
                let pureContent = util.removeHTMLTag(article.post_content)

                article.no_digest = article.post_content.length <= SUMMARY_LIMIT
                article.post_thumbnail = util.getThumbnail(article.post_content)
                article.post_summary = util.getPostDesc(pureContent, SUMMARY_LIMIT)

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
