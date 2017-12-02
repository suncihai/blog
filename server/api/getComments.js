const db = require('../db')
const axios = require('axios')
const { isNumeric } = require('../utils')
const { commentLocal } = require('../../config/server')

const getSort = sort => sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

const queryFields = [
    'comment_ID', 'comment_date', 'comment_author', 'comment_author_IP',
    'comment_author_url', 'comment_content', 'comment_parent', 'user_id'
]
module.exports.queryFields = queryFields

const getCommentList = (id, sort = 'DESC') => new Promise((resolve, reject) => {
    const connection = db.createConnection()
    const articleId = isNumeric(id) ? id : 0
    const sql = [
        `SELECT ${queryFields} FROM wp_comments WHERE`,
        `comment_approved=1 AND comment_post_ID = ${articleId}`,
        `ORDER BY comment_date ${getSort(sort)}`
    ].join(' ')

    connection.query(sql, async (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        const result = await formatComments(res || [])

        resolve({
            success: true,
            result: result
        })
    })
})

const formatComments = async comments => {
    let results = []
    let answerMap = {}

    comments.forEach(comment => {
        if (!comment) {
            return
        }

        if (comment.comment_parent) {
            const answer = {
                id: comment.comment_ID,
                date: comment.comment_date,
                author: comment.comment_author,
                content: comment.comment_content
            }

            if (!answerMap[comment.comment_parent]) {
                answerMap[comment.comment_parent] = [answer]
            } else {
                answerMap[comment.comment_parent].push(answer)
            }
        } else {
            results.push({
                id: comment.comment_ID,
                author: comment.comment_author,
                url: comment.comment_author_url,
                local: comment.comment_author_IP,
                content: comment.comment_content,
                date: comment.comment_date
            })
        }
    })

    for (let i = 0; i < results.length; i++) {
        let res = results[i]
        res.answers = answerMap[res.id] || []
        res.local = commentLocal ? await getLocal(res.local) : ''
    }

    return results
}
module.exports.formatComments = formatComments

const unknown = '未知地区'
const iplookup = 'https://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip='
const getLocal = ip => axios.get(iplookup + ip).then(res => {
    let { data } = res
    if (typeof data === 'object' && data.ret === 1) {
        let { country, province, city } = data
        return (country === '中国' ? '' : country) + (province === city ? city : province + city)
    }
    return unknown
}).catch(err => err)

module.exports.default = ({ id, sort }) => getCommentList(id, sort).catch(err => err)
