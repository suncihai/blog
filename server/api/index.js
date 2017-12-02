const getArticle = require('./getArticle')
const getArticleList = require('./getArticleList')
const getComments = require('./getComments')
const addComment = require('./addComment')
const search = require('./search')

module.exports = {
    article: getArticle,
    articles: getArticleList,
    comments: getComments.default,
    comment: addComment,
    search: search
}
