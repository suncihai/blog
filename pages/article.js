import React from 'react'
import axios from 'axios'
import hljs from 'highlight.js'
import ReactDOM from 'react-dom'
import { imgNodesToRealSrc } from './index'

import notFound from '../404'
import config from '../config'
import monitor from '../monitor'
import { getApi, errorCatch, prettyDate, isMobile, getClientHeight } from '../common'

import DocumentHead from '../components/DocumentHead'
import CommonHead from '../components/CommonHead'
import CommonFoot from '../components/CommonFoot'
import CommonAside from '../components/CommonAside'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'

const SORT_TYPE = {
    ASC: 1,
    DESC: -1
}
const COPY = {
    COMMENT_TOTAL: (count) => '共 '+ count +' 条评论',
    EARLY_COMMENT: '最早评论',
    LATEST_COMMENT: '最新评论',
    COMMENT_TYPE: '评论',
}

const killPostImageSrc = post => {
    return post.replace(/<img([\s\S]*?)src\s*=\s*(['"])([\s\S]*?)\2([^>]*)>/gi,'<img$1data-src=$2$3$2$4>')
}

export default class extends React.Component {

    static async getInitialProps ({ query, res, req }) {
        monitor.start('fetch data in apost')

        let resArticle = await axios.get(getApi('article?alias='+ query.alias)).catch(errorCatch)

        monitor.enddd('fetch data in apost')

        if (!resArticle.data) {
            res.statusCode = 404
            res.end(notFound)
            return
        }

        return {
            hasTitle: true,
            article: resArticle.data,
            isMobile: isMobile(req)
        }
    }

    constructor (props) {
        super(props)
        this.state = {
            reached: false,
            sortType: SORT_TYPE.DESC
        }
    }

    componentDidMount () {
        this.highlightCode()

        let node = ReactDOM.findDOMNode(this)
        imgNodesToRealSrc(node.querySelectorAll('[data-src]'))

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
        const { article, hasTitle, isMobile } = this.props

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
                                dangerouslySetInnerHTML={{ __html: killPostImageSrc(article.post_content) }}
                            >
                            </div>
                            <div className="article-end-line"></div>
                        </div>
                        <div className="article-comment" ref={ (comment) => { this.commentEl = comment } }>
                            <div className="comment-head">
                                <span className="comment-total constantia">{ COPY.COMMENT_TOTAL(article.comment_count) }</span>
                                <select
                                    className="comment-sort"
                                    value={ this.state.sortType }
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
                            <div className="comment-form">
                                <CommentForm typeName={ COPY.COMMENT_TYPE } articleId={ article.post_id } />
                            </div>
                        </div>
                    </div>

                    { isMobile ? '' : <CommonAside hasTitle={ hasTitle } /> }
                </div>

                <CommonFoot />

                <style jsx>{`
                    .article-title {
                        font-weight: 300;
                        line-height: 150%;
                        font-size: 2.8rem;
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
                        border-top: 1px dashed #999;
                        font-family: Helvetica, Arial;
                    }
                    .article-end-line {
                        margin: 30px 0;
                        border-bottom: 1px dashed #999;
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
                        transition: background 500ms ease-out;
                        background: rgba(100, 149, 237, .7);
                        color: #fbf7f0;
                        text-decoration: none;
                        padding: 0 10px;
                        border-radius: 2px;
                    }
                    .comment-add:hover {
                        background: rgba(100, 149, 237, 1);
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

                    @media (max-width: 1024px) {
                        .comment-add {
                            display: none;
                        }
                        .article-title {
                            font-size: 2rem;
                        }
                        .article-content {
                            margin-top: 20px;
                            padding-top: 10px;
                        }
                        .article-end-line {
                            margin: 20px 0;
                        }
                    }
                `}</style>
            </div>
        )
    }
}
