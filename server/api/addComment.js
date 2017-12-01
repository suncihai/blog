const db = require('../db')
const config = require('../../config/server')

const getMysqlDate = () => {
    const date = new Date()
    const gmt = date.toISOString().slice(0, 19).replace('T', ' ')
    date.setUTCHours(date.getUTCHours() + 8)
    const local = date.toISOString().slice(0, 19).replace('T', ' ')
    return { gmt, local }
}

const charLimit = config.commentCharLimit
const validate = data => ((
    data.email.length <= charLimit.email &&
    data.content.length <= charLimit.content &&
    data.nickname.length <= charLimit.nickname &&
    data.homepage.length <= charLimit.homepage
))

const addComment = data => new Promise((resolve, reject) => {
    if (!validate(data)) {
        return resolve({
            success: false,
            message: '提交项长度超出限制'
        })
    }

    const { gmt, local } = getMysqlDate()
    const { email, content, nickname, homepage, ip, id, ua } = data
    const sets = {
        comment_post_ID: id,
        comment_author: nickname,
        comment_author_email: email,
        comment_author_url: homepage,
        comment_content: content,
        comment_approved: 0,
        comment_date: local,
        comment_date_gmt: gmt,
        comment_author_IP: ip,
        comment_agent: ua,
        comment_parent: 0
    }

    const connection = db.createConnection()

    let keys = []
    let values = []
    for (let filed in sets) {
        keys.push(filed)
        values.push(connection.escape(sets[filed]))
    }

    const sql = `INSERT INTO wp_comments (${keys}) VALUES (${values})`

    connection.query(sql, (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        resolve({
            success: true,
            message: 'ok'
        })
    })
})

module.exports = (data, res, method) => {
    if (method !== 'POST') {
        res.statusCode = 403
        res.end('Forbidden')
    } else {
        return addComment(data).catch(err => err)
    }
}
