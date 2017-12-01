module.exports = {
    isNumeric (number) {
        return !isNaN(parseFloat(number)) && isFinite(number)
    },

    removeHTMLTag (post) {
        return post.replace(/<(?:.|\n)*?>/gm, '')
    },

    getFirstThumbnail (post) {
        let matches = post.match(/<img.*src=["](.*?)["].*?>/)
        return (matches && matches[1]) || ''
    },

    getPostSummary (post, limit) {
        let desc
        let char = '\u3002'
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
    }
}
