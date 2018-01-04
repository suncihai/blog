const db = require('../db')
const format = require('../format')
const autop = require('../utils/autop')
const { summaryLength } = require('../../config/server')
const { removeHTMLTag, getChineseWord, prettyDate } = require('../utils')

const getArticle = name => new Promise((resolve, reject) => {
    const connection = db.createConnection()
    const sql = [
        'SELECT ID, post_title, post_date, post_content, comment_count',
        `FROM wp_posts WHERE post_name = ${connection.escape(name)}`,
        'AND post_status="publish"',
        'AND post_type="post" LIMIT 1'
    ].join(' ')

    connection.query(sql, (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        const data = res && res[0]
        if (data) {
            const content = data.post_content
            resolve({
                success: true,
                result: format(data, {
                    content: autop(content, true),
                    date: prettyDate(data.post_date),
                    description: getChineseWord(removeHTMLTag(content), summaryLength)
                })
            })
        } else {
            resolve({
                success: false,
                result: null
            })
        }
    })
})

module.exports = ({ id }) => getArticle(id).catch(err => err)
