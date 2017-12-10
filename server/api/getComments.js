const db = require('../db')
const axios = require('axios')
const { isNumeric } = require('../utils')
const { commentLocal } = require('../../config/server')
const { appkey } = require('./userkey.json')

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
        if (commentLocal) {
            res.local = await getLocal(res.local)
        }
    }

    return results
}
module.exports.formatComments = formatComments

const unknown = '未知地区'
const iplookup = `http://apis.juhe.cn/ip/ip2addr?dtype=json&key=${appkey}`
const getLocal = ip => axios.get(`${iplookup}&ip=${ip}`).then(res => {
    const { result } = res.data
    const errCode = +res.data.error_code
    if (!errCode && result) {
        return result.area || unknown
    }
    return unknown
}).catch(err => err)

module.exports.default = ({ id, sort }) => getCommentList(id, sort).catch(err => err)
