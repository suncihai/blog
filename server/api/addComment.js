const db = require('../db')
const config = require('../../config/server')
const { queryFields, formatComments } = require('./getComments')

const getComment = id => new Promise((resolve, reject) => {
    const connection = db.createConnection()
    const sql = `SELECT ${queryFields} FROM wp_comments WHERE comment_ID = ${id}`
    connection.query(sql, (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        resolve(res)
    })
})

const isNicknameExist = nickname => new Promise((resolve, reject) => {
    const connection = db.createConnection()

    nickname = connection.escape(nickname)
    const sql = `SELECT comment_ID FROM wp_comments WHERE comment_author = ${nickname}`
    connection.query(sql, (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        resolve(res.length !== 0)
    })
})

const getMysqlDate = () => {
    const date = new Date()
    const gmt = date.toISOString().slice(0, 19).replace('T', ' ')
    date.setUTCHours(date.getUTCHours() + 8)
    const local = date.toISOString().slice(0, 19).replace('T', ' ')
    return { gmt, local }
}

const urlRE = /^(http|https):\/\//
const charLimit = config.commentCharLimit
const validate = ({ email, content, nickname, homepage }) => {
    const lengthValid = email.length <= charLimit.email &&
        content.length <= charLimit.content &&
        nickname.length <= charLimit.nickname &&
        homepage.length <= charLimit.homepage

    if (lengthValid && homepage) {
        return urlRE.test(homepage)
    }

    return lengthValid
}

const emojiRE = /\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]/g
const removeEmoji = data => {
    Object.keys(data).forEach(key => {
        if (emojiRE.test(data[key])) {
            data[key] = data[key].replace(emojiRE, '??')
        }
    })
    return data
}

const addComment = data => new Promise(async (resolve, reject) => {
    if (!validate(data)) {
        return resolve({
            success: false,
            result: null,
            message: '提交项不符合要求'
        })
    }

    const { email, content, nickname, homepage, ip, id, ua } = removeEmoji(data)

    const nicknameExist = await isNicknameExist(nickname)

    if (nicknameExist) {
        return resolve({
            success: false,
            result: null,
            message: '该昵称已被占用，请另起一个'
        })
    }

    const { gmt, local } = getMysqlDate()
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

    connection.query(sql, async (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        const insertData = await getComment(res.insertId)
        const data = await formatComments(insertData)

        resolve({
            success: true,
            message: 'ok',
            result: data[0]
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
