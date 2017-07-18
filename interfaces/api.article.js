let db = require('./db')
let axios = require('axios')
let common = require('./common')
let config = require('../config')
let monitor = require('../monitor')

const SUMMARY_LIMIT = config.SUMMARY_LENGTH

function getArticle (alias) {
    monitor.start('get article by alias')
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
                article.post_id = article.ID
                article.post_summary = common.getPostDesc(common.removeHTMLTag(article.post_content), SUMMARY_LIMIT)

                monitor.end('get article by alias')
                resolve(article)
            } else {
                resolve(null)
            }
        })
    })
}

function getAutopArticle (article) {
    if (!article) {
        return null
    }

    try {
        monitor.start('get autop article')
        return axios.post(config.POST_AUTOP_API, {
            post: article && article.post_content
        }).then(function (response) {
            if (response.data.result) {
                article.post_content = response.data.result
            } else {
                article.post_content = 'No data return'
            }
            monitor.end('get autop article')
            return article
        }).catch(function () {})
    } catch (e) {
        return article
    }
}

module.exports = function (query) {
    return new Promise(function (resolve, reject) {
        getArticle(query.alias).then(getAutopArticle).then(function (result) {
            resolve(result)
        }).catch(function (err) {
            reject(err)
        })
    })
}
