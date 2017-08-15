let db = require('../db')

const validate = data => {
    if (!data.author.length) {
        return '\u6635\u79f0\u4e0d\u80fd\u4e3a\u7a7a'
    }
    if (data.author.length > 20) {
        return '\u6635\u79f0\u4e0d\u80fd\u8d85\u8fc7\u0020\u0032\u0030\u0020\u4e2a\u5b57\u7b26'+
             ' ('+ data.author.length +')'
    }
    if (!data.content.length) {
        return '\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a'
    }
    if (data.content.length > 300) {
        return '\u5185\u5bb9\u4e0d\u80fd\u8d85\u8fc7\u0020\u0033\u0030\u0030\u0020\u4e2a\u5b57\u7b26'+
                ' ('+ data.content.length +')'
    }
    if (data.email && !(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(data.email)) {
        return '\u90ae\u7bb1\u683c\u5f0f\u4e0d\u6b63\u786e'
    }
}

function addComment (data) {
    return new Promise(function (resolve, reject) {
        let novalid = validate(data)
        if (novalid) {
            resolve({
                result: null,
                success: false,
                message: novalid
            })
            return
        }

        let { author, content, email, url, post_id, ua, ip, gmt_date, local_date } = data
        let sets = {
            comment_post_ID: post_id,
            comment_author: author,
            comment_author_email: email,
            comment_author_url: url,
            comment_content: content,
            comment_approved: 0,
            comment_date: local_date,
            comment_date_gmt: gmt_date,
            comment_author_IP: ip,
            comment_agent: ua,
            comment_parent: 0,
        }

        let connection = db.createConnection()

        let fileds = [], values = []
        for (let filed in sets) {
            fileds.push(filed)
            values.push(connection.escape(sets[filed]))
        }

        let INSERT_QUERY = 'INSERT INTO wp_comments ('+ fileds +') VALUES ('+ values +')'

        connection.query(INSERT_QUERY, function (error, result) {
            connection.end()

            if (error) {
                reject(error)
                throw error
            }

            resolve({
                result: 'ok',
                success: true,
                message: '',
            })
        })
    })
}

const getMysqlDate = () => {
    let date = new Date
    let gmt_date = date.toISOString().slice(0, 19).replace('T', ' ')
    date.setUTCHours(date.getUTCHours() + 8)
    let local_date = date.toISOString().slice(0, 19).replace('T', ' ')
    return { gmt_date, local_date }
}

module.exports = function (query, request) {
    return new Promise(function (resolve, reject) {
        let bodyString = ''

        request.on('data', function (data) {
            bodyString += data
        })

        request.on('end', function () {
            let body = JSON.parse(bodyString)
            let { gmt_date, local_date } = getMysqlDate()

            body.gmt_date = gmt_date
            body.local_date = local_date
            body.ua = request.headers['user-agent']
            body.ip = request.headers['x-forwarded-for'] ||
                    request.connection.remoteAddress ||
                    request.socket.remoteAddress ||
                    request.connection.socket.remoteAddress

            addComment(body).then(function (result) {
                resolve(result)
            }).catch(function (error) {
                reject(error)
            })
        })

    })
}

