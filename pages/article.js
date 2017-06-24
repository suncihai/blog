import React from 'react'
import axios from 'axios'
import hljs from 'highlight.js'
import ReactDOM from 'react-dom'

import config from '../config'
import { getApi, errorCatch, prettyDate } from '../common'

import DocumentHead from '../components/DocumentHead'
import CommonHead from '../components/CommonHead'
import CommonFoot from '../components/CommonFoot'
import CommonAside from '../components/CommonAside'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'

const getClientHeight = () => document.compatMode === 'CSS1Compat' ?
                            document.documentElement.clientHeight : document.body.clientHeight
const SORT_TYPE = {
    ASC: 1,
    DESC: -1
}
const COPY = {
    COMMENT_TOTAL: (count) => '共 '+ count +' 条评论',
    ADD_COMMENT: '我要评论',
    EARLY_COMMENT: '最早评论',
    LATEST_COMMENT: '最新评论',
    COMMENT_TYPE: '评论',
}

const LTC = config.LATEST_TITLE_COUNT
const LCC = config.LATEST_COMMENT_COUNT

export default class extends React.Component {

    static async getInitialProps ({ query, res }) {
        let resTitle = await axios.get(getApi('titles?limit='+ LTC)).catch(errorCatch)
        let resComment = await axios.get(getApi('latestcomments?limit='+ LCC)).catch(errorCatch)
        let resArticle = await axios.get(getApi('article?alias='+ query.alias)).catch(errorCatch)

        if (!resArticle.data) {
            res.statusCode = 404
            res.end('404 Not found')
            return
        }

        return {
            hasTitle: true,
            titles: resTitle.data || [],
            comments: resComment.data || [],
            article: resArticle.data
        }
    }

    constructor (props) {
        super(props)
        this.state = {
            reached: false,
            sortType: SORT_TYPE.ASC
        }
    }

    componentDidMount () {
        this.highlightCode()
        window.addEventListener('scroll', this.onScroll.bind(this))
    }

    highlightCode () {
        let domNode = ReactDOM.findDOMNode(this)
        let nodes = domNode.querySelectorAll('pre')
        for (let i = 0; i < nodes.length; i++) {
            hljs.highlightBlock(nodes[i])
        }
    }

    onScroll () {
        if (
            !this.state.reached &&
            this.commentEl.offsetTop - window.scrollY < getClientHeight()
        ) {
            this.setState({
                reached: true
            })
        }
    }

    onSortTypeChange (evt) {
        this.setState({
            sortType: evt.target.value
        })
    }

    render () {
        const { article, hasTitle, titles, comments } = this.props

        return (
            <div className="blog">
                <DocumentHead
                    title={ article.post_title }
                    description={ article.post_summary }
                />
                <CommonHead />
                <link href="/static/libs/highlight.css" rel="stylesheet" />

                <div className="global-body center">
                    <div className="global-left">
                        <div className="article">
                            <h1 className="article-title">{ article.post_title }</h1>
                            <div className="article-info constantia">
                                <span className="article-date">{ prettyDate(article.post_date) }</span>
                                <span className="article-comments">
                                    <i className="global-comments-icon"></i>{ article.comment_count }
                                </span>
                            </div>
                            <div
                                className="article-content"
                                dangerouslySetInnerHTML={{ __html: article.post_content }}
                            >
                            </div>
                            <div className="article-end-line"></div>
                        </div>
                        <div className="article-comment" ref={ (comment) => { this.commentEl = comment } }>
                            <div className="comment-head">
                                <span className="comment-total constantia">{ COPY.COMMENT_TOTAL(article.comment_count) }</span>
                                <a href="#add-comment" className="comment-add">{ COPY.ADD_COMMENT }</a>
                                <select
                                    className="comment-sort"
                                    onChange={ this.onSortTypeChange.bind(this) }
                                >
                                    <option value={ SORT_TYPE.ASC }>{ COPY.EARLY_COMMENT }</option>
                                    <option value={ SORT_TYPE.DESC }>{ COPY.LATEST_COMMENT }</option>
                                </select>
                            </div>
                            <CommentList
                                toLoad={ this.state.reached }
                                articleId={ article.post_id }
                                sortType={ this.state.sortType }
                                typeName={ COPY.COMMENT_TYPE }
                            />
                            <div className="comment-form" id="add-comment">
                                <CommentForm typeName={ COPY.COMMENT_TYPE } articleId={ article.post_id } />
                            </div>
                        </div>
                    </div>

                    <CommonAside hasTitle={ hasTitle } titles={ titles } comments={ comments } />
                </div>

                <CommonFoot />

                <style jsx>{`
                    .article-title {
                        font-weight: 300;
                        line-height: 150%;
                    }
                    .article-info {
                        color: #808080;
                    }
                    .article-comments {
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    .article-content {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px dashed;
                    }
                    .article-end-line {
                        margin: 30px 0;
                        border-bottom: 1px dashed;
                    }
                    .article-comment {
                    }
                    .comment-total {
                        color: #808080;
                    }
                    .comment-add {
                        position: absolute;
                        right: 7em;
                        top: 0;
                        font-size: 1.4rem;
                        text-decoration: underline;
                        transition: none;
                    }
                    .comment-sort {
                        position: absolute;
                        right: 0;
                        top: 0;
                        font-size: 1.4rem;
                        outline: none;
                        border-color: #dadada;
                        background: #f7f7f7;
                    }
                `}</style>
            </div>
        )
    }
}
