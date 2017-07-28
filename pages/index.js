import React from 'react'
import axios from 'axios'
import config from '../config'
import monitor from '../monitor'
import ReactDOM from 'react-dom'
import { getApi, errorCatch, createPostLink, prettyDate, isMobile } from '../common'

import CommonHead from '../components/CommonHead'
import CommonFoot from '../components/CommonFoot'
import CommonAside from '../components/CommonAside'
import DocumentHead from '../components/DocumentHead'

const COPY = {
    TITLE: '前端那些事',
    KEYWORDS: '前端开发, JavaScript, CSS, HTML, 前端博客, 唐比昌',
    DESCRIPTION: '记录、分享和总结是一个程序员成长的好习惯，这是我的个人博客，'+
                '主要记录一些与前端开发相关的心得以及一些生活感悟等，无聊、有空、心情好的时候随便写写~',
    CONTINUE: '继续阅读»',
    PUBLISH: '发表于 ',
}

const PageBrief = (props) => (
    <div className="pageins">{ props.children }</div>
)

const CID = config.CATEGORY.ARTICLE

export const imgNodesToRealSrc = imgNodes => {
    for (let i = 0; i < imgNodes.length; i++) {
        let img = imgNodes[i]
        if (img.dataset.src) {
            img.setAttribute('src', img.dataset.src)
            img.removeAttribute('data-src')
        }
    }
}

export default class extends React.Component {

    static async getInitialProps ({ req }) {
        monitor.start('get articles in page index')
        let resArticle = await axios.get(getApi('articles?category_id='+ CID)).catch(errorCatch)
        monitor.end('get articles in page index')
        return {
            brief: '',
            navActive: '',
            title: COPY.TITLE,

            hasTitle: false,
            articles: resArticle.data || [],
            isMobile: isMobile(req.headers)
        }
    }

    componentDidMount () {
        let node = ReactDOM.findDOMNode(this)
        imgNodesToRealSrc(node.querySelectorAll('img'))
    }

    render () {
        const { brief, articles, hasTitle, isMobile } = this.props

        return (
            <div className="blog center">
                <DocumentHead
                    title={ this.props.title }
                    keywords={ COPY.KEYWORDS }
                    description={ COPY.DESCRIPTION }
                />

                <CommonHead active={ this.props.navActive } />

                <div className="global-body center">
                    <div className="global-left">
                        { brief ? <PageBrief>{ brief }</PageBrief> : '' }
                        <div className="list">
                        { articles.map((item) => (
                            <div className="list-item" key={ item.ID }>
                                <div className="article-head">
                                    <a className="article-title" href={ createPostLink(item.post_name) }>{ item.post_title }</a>
                                </div>
                                <div className="article-digest">
                                    { item.post_summary }
                                    { item.no_digest ? '' : ' [...]' }
                                </div>
                                <div className="article-more">
                                    <span className="article-comments constantia">
                                        <i className="global-comments-icon"></i>{ item.comment_count }
                                    </span>
                                    <span className="article-publish constantia">{ prettyDate(item.post_date) }</span>
                                    { item.no_digest ? '' : <a href={ createPostLink(item.post_name) }> { COPY.CONTINUE }</a> }
                                </div>
                                { item.post_thumbnail ? <img className="article-thumbnail" data-src={ item.post_thumbnail }/> : '' }
                            </div>
                        )) }
                        </div>
                    </div>

                    { isMobile ? '' : <CommonAside hasTitle={ hasTitle } /> }
                </div>

                <CommonFoot />

                <style jsx>{`
                    .list-item {
                        padding-bottom: 20px;
                        margin-bottom: 10px;
                        border-bottom: 1px dashed #999;
                    }
                    .list-item:last-child {
                        border: none;
                    }
                    .article-head {
                        height: 50px;
                        line-height: 50px;
                    }
                    .article-title {
                        font-size: 2.4rem;
                        font-weight: 300;
                    }
                    .article-digest {
                        padding: 15px;
                        margin-bottom: 15px;
                        background: #fbfbfb;
                    }
                    .article-more {
                        font-size: 1.4rem;
                    }
                    .article-publish {
                        margin-right: 1em;
                        color: #808080;
                    }
                    .article-comments {
                        position: absolute;
                        height: 100%;
                        right: 0;
                        top: -3px;
                        width: 50px;
                        text-align: right;
                        color: #a5a5a5;
                    }
                    .article-thumbnail {
                        max-width: 100%;
                        margin-top: 15px;
                        border-radius: 2px;
                    }

                    @media (max-width: 1024px) {
                        .article-head {
                            height: auto;
                            padding: .5em 0;
                            line-height: 170%
                        }
                        .article-title {
                            font-size: 1.6rem;
                        }
                        .article-digest {
                            padding: .5em;
                        }
                        .article-thumbnail {
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        )
    }
}
