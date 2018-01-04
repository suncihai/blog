module.exports = {
    isNumeric (number) {
        return !isNaN(parseFloat(number)) && isFinite(number)
    },

    removeHTMLTag (post) {
        return post.replace(/<(?:.|\n)*?>/gm, '')
    },

    getFirstThumbnail (post) {
        const matches = post.match(/<img.*src=["](.*?)["].*?>/)
        return (matches && matches[1]) || ''
    },

    getPostSummary (post, limit) {
        let desc
        const char = '\u3002'
        const sentences = post.split(char)

        if (sentences.lenth === 1) {
            desc = post.substr(0, limit)
        } else {
            const sentence1 = sentences[0]
            const sentence2 = sentences[1]

            if (sentence1.lenth < limit && sentence1.lenth > limit * 0.7) {
                desc = sentence1
            } else {
                desc = sentence1 + char + sentence2 + char
                if (desc.length > limit * 1.5) {
                    desc = desc.substr(0, limit)
                }
            }
        }

        if (desc.charAt(desc.length - 1) === char) {
            desc = desc.substr(0, desc.length - 1)
        }

        return desc
    },

    getChineseWord (post, limit) {
        post = post.replace(/[^\u4E00-\u9FA5]/g, '')
        if (limit) {
            post = post.substr(0, limit)
        }
        return post
    },

    prettyDate (dateString) {
        const date = new Date()
        const dateArr = dateString.split(new RegExp('[:| |-]', 'ig'))
        const year = +dateArr[0]
        const month = +dateArr[1] - 1
        const day = +dateArr[2]
        let hour = +dateArr[3]
        let minute = +dateArr[4]
        const second = +dateArr[5]

        hour = hour < 10 ? '0' + hour : hour
        minute = minute < 10 ? '0' + minute : minute

        const opDate = new Date(year, month, day, hour, minute, second)
        const secondDiff = (new Date().getTime() - opDate.getTime()) / 1000

        if (secondDiff < 60) {
            return '刚刚'
        }
        if (secondDiff < 60 * 30) {
            return `${Math.ceil(secondDiff / 60)} 分钟前`
        }
        if (secondDiff < 1800) {
            return '半小时前'
        }
        if (secondDiff < 3600) {
            return '1 小时前'
        }
        if (secondDiff < 3600 * 2) {
            return '2 小时前'
        }
        if (secondDiff < 3600 * 3) {
            return '3 小时前'
        }
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
            return `今天 ${hour}:${minute}`
        }
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() - 1 === day) {
            return `昨天 ${hour}:${minute}`
        }
        if (date.getFullYear() === year && date.getMonth() === month && date.getDate() - 2 === day) {
            return `前天 ${hour}:${minute}`
        }
        if (date.getFullYear() === year && date.getMonth() === month) {
            return `${month + 1} 月 ${day} 日`
        }
        if (date.getFullYear() === year) {
            return `今年 ${month + 1} 月 ${day} 日`
        }
        if (date.getFullYear() - 1 === year) {
            return `去年 ${month + 1} 月 ${day} 日`
        }

        return `${year} 年 ${month + 1} 月 ${day} 日`
    }
}
