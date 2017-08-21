import React from 'react'
import axios from 'axios'
import hljs from 'highlight.js'
import ReactDOM from 'react-dom'
import { imgNodeToRealSrc } from './index'

import config from '../config'
import notFound from '../common/not-found'
import { getApi, prettyDate, getClientHeight } from '../common'

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

const imageToDatasrc = (post) => {
    return post.replace(/<img([\s\S]*?)src\s*=\s*(['"])([\s\S]*?)\2([^>]*)>/gi, '<img$1data-src=$2$3$2$4>')
}

const INIT_STATE = () => {
    return {
        reached: false,
        sortType: SORT_TYPE.DESC
    }
}

export default class extends React.Component {

    static async getInitialProps ({ query, res }) {
        let resArticle = {}

        try {
            resArticle = await axios.get(getApi('article?alias='+ query.alias))
        } catch (e) {}

        if (!resArticle.data) {
            res.statusCode = 404
            res.end(notFound)
            return
        }

        return {
            hasTitle: true,
            article: resArticle.data
        }
    }

    constructor (props) {
        super(props)
        this.state = INIT_STATE()
        this.onScroll = this.onScroll.bind(this)
    }

    // 单页模式下，从其他文章跳转过来需要重置状态
    componentWillReceiveProps (nextProps) {
        this.setState(INIT_STATE())
    }

    componentDidMount () {
        this.onPageReady()
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.onScroll)
    }

    // 单页模式下，更新图片和代码块
    componentDidUpdate () {
        this.onPageReady()
    }

    onPageReady () {
        let dom = ReactDOM.findDOMNode(this)

        this.loadImage(dom)
        this.highlightCode(dom)

        window.addEventListener('scroll', this.onScroll)
        this.commentEl = dom.querySelector('.article-comment')
    }

    highlightCode (dom) {
        setTimeout(() => {
            let nodes = dom.querySelectorAll('pre')
            for (let i = 0; i < nodes.length; i++) {
                hljs.highlightBlock(nodes[i])
            }
        }, 0)
    }

    loadImage (dom) {
        setTimeout(() => {
            let images = dom.querySelectorAll('[data-src]')
            for (let i = 0; i < images.length; i++) {
                imgNodeToRealSrc(images[i])
            }
        }, 0)
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
        const { article, hasTitle } = this.props

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
                                dangerouslySetInnerHTML={{ __html: imageToDatasrc(article.post_content) }}
                            >
                            </div>
                        </div>
                        <div className="article-comment">
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

                    <CommonAside hasTitle={ hasTitle } />
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
                        padding: 20px 0;
                        text-align: justify;
                        font-family: Helvetica, Arial;
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

                    @media (max-width: 768px) {
                        .comment-add {
                            display: none;
                        }
                        .article-title {
                            font-size: 2rem;
                        }
                        .article-content {
                            margin-top: 20px;
                            padding-top: 10px;
                            letter-spacing: 1px;
                        }
                        .article-end-line {
                            margin: 20px 0;
                        }
                    }
                `}</style>

                <style jsx global>{`
                    pre {
                        max-height: 500px;
                        font-size: 1.4rem;
                        border-radius: 2px;
                        position: relative;
                        font-family: 'Roboto Mono', Monaco, courier, monospace;
                    }
                    .hljs.javascript:after {
                        position: absolute;
                        content: 'JS';
                        top: 0;
                        right: .5em;
                        font-weight: bold;
                        font-family: monospace, sans-serif;
                    }
                    .hljs.html:after {
                        position: absolute;
                        content: 'HTML';
                        top: 0;
                        right: .5em;
                        font-weight: bold;
                        font-family: monospace, sans-serif;
                    }
                    .hljs.css:after {
                        position: absolute;
                        content: 'CSS';
                        top: 0;
                        right: .5em;
                        font-weight: bold;
                        font-family: monospace, sans-serif;
                    }
                    .hljs.php:after {
                        position: absolute;
                        content: 'PHP';
                        top: 0;
                        right: .5em;
                        font-weight: bold;
                        font-family: monospace, sans-serif;
                    }
                    .hljs.json:after {
                        position: absolute;
                        content: 'JSON';
                        top: 0;
                        right: .5em;
                        font-weight: bold;
                        font-family: monospace, sans-serif;
                    }
                    .article-content h2 {
                        padding-top: 1em;
                        padding-bottom: .5em;
                        font-weight: 400;
                        font-size: 2.4rem;
                        border-bottom: 1px dashed #999;
                    }
                    .article-content h3 {
                        padding-top: .8em;
                        padding-bottom: .4em;
                        font-weight: 400;
                        font-size: 2rem;
                        border-bottom: 1px dashed #c3c3c3;
                    }
                    .article-content img {
                        border-radius: 2px;
                        max-width: 100%;
                        height: auto;
                        transition: 500ms ease-out;
                    }
                    .article-content img:hover {
                        transform: scale(1.02);
                    }
                    .article-content blockquote {
                        background: #f8f8f8;
                        margin: 0;
                        padding: 0.2rem 2rem;
                        border-left: 5px solid #b4cfff;
                    }
                    .article-content ol li, .article-content ul li {
                        margin: 0.5rem 0;
                    }
                    .article-content code {
                        padding: 0 0.2rem;
                        border-radius: 3px;
                        display: inline-block;
                        background: #eee;
                        vertical-align: middle;
                        font-size: 85%;
                        font-family: 'Roboto Mono', Monaco, courier, monospace;
                    }
                `}</style>

                <style jsx global>{`
                    @media (max-width: 768px) {
                        .hljs.javascript:after,
                        .hljs.html:after,
                        .hljs.css:after,
                        .hljs.php:after,
                        .hljs.json:after {
                            display: none;
                        }
                        pre {
                            font-size: 1.2rem;
                        }
                    }
                `}</style>
            </div>
        )
    }
}
