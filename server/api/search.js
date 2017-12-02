const db = require('../db')
const format = require('../format')
const { removeHTMLTag } = require('../utils')
const { searchRange } = require('../../config/server')

const markRE = /<mark>.*?<\/mark>/g
const getContentMatches = (content) => {
    let matches = []
    const marks = content.match(markRE)
    const splits = content.split(markRE)
    for (let i = 0; i < marks.length; i++) {
        const previousIndex = Math.max(i - 1, 0)
        const nextIndex = Math.min(i + 1, splits.length)

        const nextContnet = splits[nextIndex] || ''
        const previousContent = splits[previousIndex] || ''
        matches.push([
            previousContent.slice(-searchRange),
            marks[i],
            nextContnet.slice(0, searchRange)
        ].join(''))
    }

    if (matches.length > 1) {
        let [m1, m2] = matches
        const i1 = m1.indexOf('<mark>')
        const i2 = m2.indexOf('<mark>')
        const p1 = m1.slice(0, i1)
        const p2 = m2.slice(0, i2)
        if (p1 === p2) {
            matches[1] = m2.replace(p2, '')
        }
    }

    return matches
}

const wrapMarkTag = $1 => `<mark>${$1}</mark>`

const searchWord = word => new Promise((resolve, reject) => {
    word = decodeURIComponent(word)

    if (word.length < 2) {
        return resolve({
            success: false,
            message: '搜索关键词长度至少为两个字符'
        })
    }

    const connection = db.createConnection()

    word = connection.escape(word)
    // @todo 为何 escape 后会带上分号？
    word = word.replace(/(^'*)|('*$)/g, '')

    const sql = [
        'SELECT ID, post_title, post_name, post_date, post_content',
        `FROM wp_posts WHERE (post_title LIKE "%${word}%" OR post_content LIKE "%${word}%")`,
        `AND post_status='publish' AND post_type='post'`
    ].join(' ')

    connection.query(sql, (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        const keywordRE = new RegExp(word, 'ig')
        const results = (res || []).map(row => {
            let title = row.post_title
            let content = removeHTMLTag(row.post_content)

            let titleMatch = keywordRE.test(title)
            if (titleMatch) {
                title = title.replace(keywordRE, wrapMarkTag)
            }

            let contentMatch = keywordRE.test(content)
            if (contentMatch) {
                content = getContentMatches(content.replace(keywordRE, wrapMarkTag))
            }

            return format(row, {
                title,
                content,
                mtitle: titleMatch,
                mcontent: contentMatch
            })
        })

        resolve({
            success: true,
            result: results.filter(result => result.mtitle || result.mcontent)
        })
    })
})

module.exports = ({ id }) => searchWord(id).catch(err => err)
