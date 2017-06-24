let db = require('./db')
let axios = require('axios')

const UNKNOWN_AREA = '\u672a\u77e5\u5730\u533a'
const QUERY_IP_API = 'https://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip='
function getLocalByIp (ip) {
    return axios.get(QUERY_IP_API + ip).then((res) => {
        let data = res.data
        if (typeof data === 'object' && data.ret === 1) {
            let country = data.country
            return (country !== '\u4e2d\u56fd' ? country : '') +
                (data.province === data.city ? data.city : data.province + data.city)
        } else {
            return UNKNOWN_AREA
        }
    }).catch((err) => {
        return UNKNOWN_AREA
    })
}

const formatComments = async comments => {
    let orignals = [], answerMap = {}
    for (let i = 0; i < comments.length; i++) {
        let comment = comments[i]

        if (comment.comment_parent) {
            let answer = {
                id: comment.comment_ID,
                author: comment.comment_author,
                content: comment.comment_content
            }
            if (!answerMap[comment.comment_parent]) {
                answerMap[comment.comment_parent] = [answer]
            } else {
                answerMap[comment.comment_parent].push(answer)
            }
        } else {
            orignals.push({
                id: comment.comment_ID,
                author: comment.comment_author,
                url: comment.comment_author_url,
                local: comment.comment_author_IP,
                content: comment.comment_content,
                date: comment.comment_date,
            })
        }
    }

    for (let j = 0; j < orignals.length; j++) {
        let orignal = orignals[j]
        orignal.answers = answerMap[orignal.id] || []
        orignal.local = await getLocalByIp(orignal.local)
    }

    return orignals
}

const SORT = {
    '1': 'ASC',
    '-1': 'DESC'
}
const COMMENT_FIELDS = [
    'comment_ID', 'comment_date', 'comment_author', 'comment_author_IP',
    'comment_author_url', 'comment_content', 'comment_parent', 'user_id'
]
function getCommentList (article_id, sort) {
    return new Promise(function (resolve, reject) {
        let connection = db.createConnection()
        let QUERY_COMMENTS = 'SELECT ' + COMMENT_FIELDS + ' FROM wp_comments WHERE ' +
                            'comment_approved=1 AND comment_post_ID='+ article_id +
                            ' ORDER BY comment_date ' + SORT[sort] || SORT['1']

        connection.query(QUERY_COMMENTS, function (error, results) {
            connection.end()

            if (error) {
                reject(error)
                throw error
            }

            resolve(formatComments(results))
        })
    })
}

module.exports = function (query) {
    return new Promise(function (resolve, reject) {
        getCommentList(query.article_id, query.sort).then(function (result) {
            resolve(result)
        }).catch(function (error) {
            reject(error)
        })
    })
}
