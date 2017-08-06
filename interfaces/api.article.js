let db = require('./db')
let autop = require('./autop')
let common = require('./common')
let config = require('../config')

const SUMMARY_LIMIT = config.SUMMARY_LENGTH

function getArticle (alias) {
    return new Promise(function (resolve, reject) {
        let connection = db.createConnection()
        let QUERY_ARTICLE = 'SELECT ID, post_title, post_date, post_content, comment_count ' +
                            'FROM wp_posts WHERE ' + 'post_name = ' + connection.escape(alias) +
                            ' AND post_status=\'publish\'' +
                            ' AND post_type=\'post\' LIMIT 1'

        connection.query(QUERY_ARTICLE, function (error, result) {
            connection.end()

            if (error) {
                reject(error)
                throw error
            }

            let article = result && result[0]
            if (article) {
                let content = article.post_content
                let clear = common.removeHTMLTag(content)

                article.post_id = article.ID
                article.post_content = autop(content, true)
                article.post_summary = common.getPostDesc(clear, SUMMARY_LIMIT)

                resolve(article)
            } else {
                resolve(null)
            }
        })
    })
}

module.exports = function (query) {
    return new Promise(function (resolve, reject) {
        getArticle(query.alias).then(function (result) {
            resolve(result)
        }).catch(function (err) {
            reject(err)
        })
    })
}
