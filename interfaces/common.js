
module.exports = {

    toChineseDate: function (str) {
        let year, month, day
        [year, month, day] = str.split(' ')[0].split('-')
        return `${year} 年 ${parseInt(month)} 月 ${parseInt(day)} 日`
    },

    removeHTMLTag (post) {
        return post.replace(/<(?:.|\n)*?>/gm, '')
    },

    getThumbnail (post) {
        let matches = post.match(/<img.*src=[\"](.*?)[\"].*?>/)
        return matches && matches[1] || ''
    },

    getChineseWord: function (post, limit) {
        post = post.replace(/[^\u4E00-\u9FA5]/g, '')
        if (limit) {
            post = post.substr(0, limit)
        }
        return post
    },

    getPostDesc (post, limit) {
        let desc, char = '\u3002'
        let sentences = post.split(char)

        if (sentences.lenth === 1) {
            desc = post.substr(0, limit)
        } else {
            let sentence1 = sentences[0]
            let sentence2 = sentences[1]

            if (sentence1.lenth < limit && sentence1.lenth > limit * 0.7) {
                desc = sentence1
            } else {
                desc = sentence1 + char + sentence2 + char
                if (desc.length > limit * 1.5) {
                    desc = desc.substr(0, limit)
                }
            }
        }

        return desc
    }
}
