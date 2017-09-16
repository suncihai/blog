import React from 'react'
import axios from 'axios'
import Link from 'next/link'
import config from '../config'
import ReactDOM from 'react-dom'
import { trackEvent } from '../plugins/trace'
import { getApi, createPostLink, createLinkObject, prettyDate, loadImage } from '../common'

import CommonHead from '../components/CommonHead'
import CommonBrief from '../components/CommonBrief'
import CommonFoot from '../components/CommonFoot'
import CommonAside from '../components/CommonAside'
import DocumentHead from '../components/DocumentHead'

export default class extends React.Component {

    static async getInitialProps () {
        let res = {}

        try {
            res = await axios.get(getApi('articles?category_id='+ config.CATEGORY.ARTICLE))
        } catch (e) {}

        return {
            brief: '',
            title: '前端那些事',
            active: '/',
            hasTitle: false,
            articles: res.data || []
        }
    }

    componentDidMount () {
        loadImage(ReactDOM.findDOMNode(this))
    }

    render () {
        const { title, brief, active, articles, hasTitle } = this.props

        return (
            <div className="blog center">
                <DocumentHead title={ title } />

                <CommonHead active={ active } />

                <div className="global-body center">
                    <div className="global-left">
                        { brief ? <CommonBrief>{ brief }</CommonBrief> : '' }
                        <div className="list">
                        { articles.map((item) => (
                            <div className="list-item" key={ item.ID }>
                                <div className="article-head">
                                    <Link prefetch as={ createPostLink(item.post_name) } href={ createLinkObject(item.post_name) }>
                                        <a className="article-title">{ item.post_title }</a>
                                    </Link>
                                </div>
                                <div className="article-digest">
                                    { item.post_summary }
                                    { item.no_digest ? '' : ' ... ' }
                                    { item.no_digest ? '' :
                                        <Link prefetch as={ createPostLink(item.post_name) } href={ createLinkObject(item.post_name) }>
                                            <a title="继续阅读"><i className="icon-arrow-right2" onClick={() => trackEvent('摘要更多', '点击：' + item.post_name)}></i></a>
                                        </Link>
                                    }
                                </div>
                                <div className="article-more constantia">
                                    <span className="article-comments">
                                        <i className="icon-bubble"></i>{ item.comment_count }
                                    </span>
                                    <span className="article-publish">{ prettyDate(item.post_date) }</span>
                                </div>
                                <div className="article-thumbnail">
                                { item.post_thumbnail ? <img className="thumbnail" data-src={ item.post_thumbnail }/> : '' }
                                </div>
                            </div>
                        )) }
                        </div>
                    </div>

                    <CommonAside hasTitle={ hasTitle } />
                </div>

                <CommonFoot />

                <style jsx>{`
                    .list-item {
                        padding-bottom: 2em;
                        margin-bottom: 2em;
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
                    }
                    .article-digest {
                        color: #444;
                        padding: 15px;
                        margin-bottom: 15px;
                        background: #fafafa;
                        text-align: justify;
                        word-break: break-all;
                        border-radius: 2px;
                    }
                    .article-more {
                        font-size: 1.4rem;
                        height: 40px;
                        line-height: 40px;
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
                    .article-comments i {
                        margin-right: 6px;
                    }

                    @media (max-width: 768px) {
                        .article-head {
                            height: auto;
                            padding: .5em 0;
                            line-height: 170%
                        }
                        .article-title {
                            font-size: 1.8rem;
                        }
                        .article-digest {
                            padding: .5em;
                        }
                        .article-thumbnail {
                            width: 100%;
                            text-align: center;
                        }
                        .thumbnail {
                            max-height: 100px;
                        }
                    }
                `}</style>

                <style jsx global>{`
                    .thumbnail {
                        max-width: 100%;
                        margin-top: 15px;
                        border-radius: 2px;
                    }
                `}</style>
            </div>
        )
    }
}
