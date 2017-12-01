const db = require('../db')
const format = require('../format')
const { isNumeric } = require('../utils')

const getArticleIds = categoryId => new Promise((resolve, reject) => {
    const connection = db.createConnection()
    const cid = isNumeric(categoryId) ? categoryId : 0
    const sql = `SELECT object_id FROM wp_term_relationships WHERE term_taxonomy_id = ${cid}`

    connection.query(sql, (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        resolve((res || []).map(row => row.object_id))
    })
})

const englishSpeed = 1 / 5
const chineseSpeed = 60 / 256
const chineseRE = /[\u4e00-\u9fa5]/g
const englishRE = /\b\w/g
const imagesRE = /<img.*?>/g
const codeRE = /<pre.*?>/g

const getArticleList = ids => new Promise((resolve, reject) => {
    if (!ids.length) {
        resolve([])
    }

    const connection = db.createConnection()
    const sql = [
        'SELECT ID, post_title, post_name, post_date, post_content, comment_count',
        `FROM wp_posts WHERE ID in(${ids}) AND post_status="publish"`,
        'AND post_type=\'post\' ORDER BY post_date DESC'
    ].join(' ')

    connection.query(sql, (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        resolve((res || []).map(row => {
            const content = row.post_content
            const chineseCount = (content.match(chineseRE) || []).length
            const englishCount = (content.match(englishRE) || []).length
            const words = chineseCount * chineseSpeed + englishCount * englishSpeed
            return format(row, {
                codes: (content.match(codeRE) || []).length,
                minutes: Math.max(Math.round(words / 60), 3),
                thumbnails: (content.match(imagesRE) || []).length
            })
        }))
    })
})

module.exports = ({ id }) => getArticleIds(id).then(getArticleList).catch(err => err)
