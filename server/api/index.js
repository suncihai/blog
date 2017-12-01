const getArticle = require('./getArticle')
const getArticleList = require('./getArticleList')
const getComments = require('./getComments')
const addComment = require('./addComment')

module.exports = {
    article: getArticle,
    articles: getArticleList,
    comments: getComments,
    comment: addComment
}
