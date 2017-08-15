let db = require('../db')
let util = require('../utils')
let config = require('../../config')
let cpi = config.CATEGORY.COMMENT_PAGE

function getLatestComments (limit) {
    return new Promise(function (resolve, reject) {
        let LIMIT = util.isNumeric(limit) ? limit : 0
        let connection = db.createConnection()
        let QUERY_COMMENTS = 'SELECT comment_ID, comment_author, comment_post_ID, comment_date, comment_content ' +
                            'FROM wp_comments ' +
                            'WHERE comment_post_ID != ' + cpi + ' AND user_id != 1 AND comment_approved=1 ' +
                            'ORDER BY comment_date DESC LIMIT ' + LIMIT

        connection.query(QUERY_COMMENTS, function (error, results) {
            connection.end()

            if (error) {
                reject(error)
                throw error
            }

            resolve(results)
        })
    })
}

function getCommentedArticleTitle (comments) {
    return new Promise(function (resolve, reject) {
        let ids = []
        comments.forEach(function (comment) {
            ids.push(comment.comment_post_ID)
        });

        if (!ids.length) {
            resolve([])
            return
        }

        let connection = db.createConnection()
        let QUERY_TITLES = 'SELECT ID, post_title, post_name FROM wp_posts ' +
                            'WHERE ID in('+ ids +') '
                            // + 'AND post_status=\'publish\' AND post_type=\'post\''

        connection.query(QUERY_TITLES, function (error, results) {
            connection.end()

            if (error) {
                reject(error)
                throw error
            }

            let titleMap = {}
            results.forEach(function (article) {
                titleMap[article.ID] = {
                    name: article.post_name,
                    title: article.post_title
                }
            })

            // Formatting data
            comments.map(function (comment) {
                let t = titleMap[comment.comment_post_ID]
                comment.post_name = t.name
                comment.post_title = t.title
                comment.comment_date = comment.comment_date
                return comment
            })

            resolve(comments)
        })
    })
}

module.exports = function (query) {
    return new Promise(function (resolve, reject) {
        getLatestComments(+query.limit).then(getCommentedArticleTitle).then(function (result) {
            resolve(result)
        }).catch(function (error) {
            reject(error)
        })
    })
}
