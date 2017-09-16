import React from 'react'
import axios from 'axios'
import Link from 'next/link'

import config from '../config'
import { getApi, createPostLink, createLinkObject, isMobile } from '../common'

import CommonLoading from './CommonLoading'

const COPY = {
    ABOUT: {
        STATEMENT: '声明：本站所有文章均为本人原创，内容仅代表个人观点，如需转载请注明出处，谢谢合作 :-)'
    },
    FLINK: {
        TITLE: '友情链接：',
        NOTYET: '（欢迎同行博客交换友链~）'
    },
    COMMENTED: '评论了',
    LATEST: '最新：',
    SOURCE: '博客源代码',
    ICP: '桂 ICP 备 12002316 号'
}

const TAB_TYPE = {
    ARTICLE: {
        TYPE: 1,
        TEXT: '文章'
    },
    COMMENT: {
        TYPE: 2,
        TEXT: '评论'
    }
}

const FRIEND_LINKS = [
    {
        TITLE: '兔耳日记',
        LINK: 'http://www.tuer.me',
    }
]

const TitleList = (titles = []) => (
    <ul className="ul-clear-list">
        { titles.map((article, index) => {
            return (
                <li className="title-name" key={ article.ID }>
                    <span className="title-index constantia">{ index + 1 }. </span>
                    <Link prefetch as={ createPostLink(article.post_name) } href={ createLinkObject(article.post_name) }>
                        <a className="title-link" title={ article.post_title }>{ article.post_title }</a>
                    </Link>
                </li>
            )
        }) }

        <style jsx>{`
            .title-name {
                display: block;
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                height: 40px;
                line-height: 40px;
            }
        `}</style>
    </ul>
)

const COMMENT_CONTENT_LIMIT = 36
const getCommentShort = comment => {
    if (comment.length > COMMENT_CONTENT_LIMIT) {
        comment = comment.substr(0, COMMENT_CONTENT_LIMIT) + '……'
    }
    return comment
}
const CommentList = (comments = []) => (
    <ul className="ul-clear-list">
        { comments.map((comment, index) => {
            return (
                <li className="list" key={ comment.comment_ID }>
                    <span className="author">{ comment.comment_author }</span>
                    <span> { COPY.COMMENTED } </span>
                    <Link prefetch as={ createPostLink(comment.post_name) } href={ createLinkObject(comment.post_name) } >
                        <a className="link">{ comment.post_title }</a>
                    </Link>
                    <span>：</span>
                    <span className="content">{ getCommentShort(comment.comment_content) }</span>
                </li>
            )
        }) }

        <style jsx>{`
            .list {
                margin-top: 12px;
                padding-bottom: 12px;
                border-bottom: 1px dashed #e3e3e3;
            }
            .list:last-child {
                border: none;
            }
            .author {
                color: #a52a2a;
                font-weight: 500;
            }
            .content {
                color: #666;
                font-style: italic;
            }
        `}</style>
    </ul>
)

const API_TITLES = getApi('titles?limit='+ config.LATEST_TITLE_COUNT)
const API_COMMENTS = getApi('latestcomments?limit='+ config.LATEST_COMMENT_COUNT)

export default class CommonAside extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            titles: [],
            comments: [],
            error: '',
            tabType: TAB_TYPE.ARTICLE.TYPE
        }
    }

    componentDidMount () {
        this._isMounted = true

        if (isMobile()) {
            return
        }

        if (this.props.hasTitle) {
            this.loadTitleList()
        }
        this.loadCommentList()
    }

    componentWillUnmount () {
        this._isMounted = false
    }

    componentWillMount () {
        if (!this.props.hasTitle) {
            this.setState({
                tabType: TAB_TYPE.COMMENT.TYPE
            })
        }
    }

    eventClickTab (tabType) {
        this.setState({ tabType })
    }

    getTabHead (Tab) {
        let klass = 'tab-head-item ' + (this.state.tabType === Tab.TYPE ? 'active' : '')
        return (
            <div className={ klass } onClick={ this.eventClickTab.bind(this, Tab.TYPE) }>
                { Tab.TEXT }

                <style jsx>{`
                    .tab-head-item {
                        width: 60px;
                        cursor: pointer;
                        text-align: center;
                        display: inline-block;
                    }
                    .tab-head-item.active {
                        background: #fff;
                    }
                `}</style>
            </div>
        )
    }

    loadTitleList () {
        axios.get(API_TITLES).then(res => {
            if (this._isMounted) {
                this.setState({
                    titles: res.data
                })
            }
        }).catch(this.loadError.bind(this))
    }

    loadCommentList () {
        axios.get(API_COMMENTS).then(res => {
            if (this._isMounted) {
                this.setState({
                    comments: res.data
                })
            }
        }).catch(this.loadError.bind(this))
    }

    loadError (err) {
        if (this._isMounted) {
            this.setState({
                error: err.message
            })
        }
    }

    getTabContent () {
        const hasTitle = this.props.hasTitle
        const { tabType, comments, titles, error } = this.state

        let slot = <CommonLoading />
        if (hasTitle && tabType === TAB_TYPE.ARTICLE.TYPE && titles.length) {
            slot = TitleList(titles)
        } else if (comments.length) {
            slot = CommentList(comments)
        }

        return (
            <div className="tab-content-item">
                { error ? error : slot }

                <style jsx>{`
                    .tab-content-item {
                        padding: 10px;
                    }
                `}</style>
            </div>
        )
    }

    render () {
        return (
            <div className="global-right">
                <div className="common-aside">
                    <div className="about center">
                        <div className="item-content">
                            <p>{ COPY.ABOUT.MAIN }</p>
                            <p className="site-statement">{ COPY.ABOUT.STATEMENT }</p>
                        </div>
                    </div>
                    <div className="recent center">
                        <div className="item-content recent-content">
                            <div className="tab-head">
                                <div className="tab-head-inst">{ COPY.LATEST }</div>
                                { this.props.hasTitle ? this.getTabHead(TAB_TYPE.ARTICLE) : '' }
                                { this.getTabHead(TAB_TYPE.COMMENT) }
                            </div>
                            <div className="tab-content">
                                { this.getTabContent() }
                            </div>
                        </div>
                    </div>
                    <div className="foot center">
                        <div className="friend-link">
                            <div className="friend-link-head">{ COPY.FLINK.TITLE }</div>
                            { FRIEND_LINKS.length ?
                                <ul className="friend-link-content">
                                { FRIEND_LINKS.map(flink => {
                                    return (
                                        <li key={ flink.LINK }>
                                            <a
                                                target="_blank"
                                                href={ flink.LINK }
                                                rel="noopener noreferrer"
                                                className="friend-link-item"
                                            >{ flink.TITLE }</a>
                                        </li>
                                    )
                                }) }
                                </ul> : COPY.FLINK.NOTYET
                            }
                        </div>
                        <div className="footnote">
                            <span>Powered by</span>
                            <a rel="nofollow noopener noreferrer" href="https://github.com/zeit/next.js"> next.js </a>
                            <a rel="nofollow noopener noreferrer" href="https://github.com/tangbc/blog">{ COPY.SOURCE }</a>
                            <br />
                            <span>© { (new Date).getFullYear() } TANG - </span>
                            <a rel="nofollow noopener" href="http://www.miitbeian.gov.cn">{ COPY.ICP }</a>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .about, .contact, .recent, .foot {
                        padding-bottom: 30px;
                    }
                    .site-statement {
                        font-style: italic;
                        font-weight: bold;
                    }
                    .contact-list {
                        margin: 0;
                        padding: 0;
                        list-style-type: none;
                    }
                    .contact-list-item {
                        width: 25%;
                        text-align: center;
                        display: inline-block;
                        transition: all 500ms ease-out;
                    }
                    .contact-list-item:hover{
                        opacity: .7;
                    }
                    .contact-list-item img {
                        vertical-align: middle;
                    }

                    .tab-head {
                        height: 35px;
                        line-height: 35px;
                        user-select: none;
                        background: #f8f8f8;
                    }
                    .tab-head-inst {
                        padding: 0 10px;
                        color: #808080;
                        display: inline-block;
                    }

                    .foot {
                        color: #9b9b9b;
                        font-size: 1.3rem;
                    }
                    .footnote {
                        text-decoration: underline;
                    }
                    .footnote a {
                        color: #9b9b9b;
                        text-decoration: underline;
                    }
                    .friend-link {
                        padding-bottom: 10px;
                    }
                    .friend-link-item {
                        color: #9b9b9b;
                        text-decoration: none;
                    }

                    .item-head {
                        height: 35px;
                        line-height: 35px;
                    }
                    .item-head-title {
                        margin: 0;
                        padding: 0;
                        background: #fff;
                        font-size: 1.6rem;
                        padding-right: 10px;
                        font-weight: inherit;
                        display: inline-block;
                    }
                    .item-content {
                        padding: 10px;
                        font-size: 1.5rem;
                        border-radius: 1px;
                        border: 1px solid #e3e3e3;
                        border-bottom: 3px solid #6495ed;
                        box-shadow: 1px 1px 5px #e3e3e3;
                        background: rgba(255, 255, 240, .1);
                    }
                    .item-content.recent-content {
                        padding: 0;
                    }
                `}</style>
            </div>
        )
    }
}

