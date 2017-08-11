import React from 'react'
import axios from 'axios'
import { getApi } from '../common'

export default class Error extends React.Component {

    static getInitialProps ({ req, res, jsonPageRes }) {
        const url = req ? req.url : ''
        const statusCode = res ? res.statusCode : (jsonPageRes ? jsonPageRes.status : null)

        let articleId
        if (url && url.charAt(0) === '/' && url.indexOf('.html') > -1) {
            [articleId] = url.split('.html')
            articleId = +articleId.substr(1)
        }

        return { url, articleId, statusCode }
    }

    componentWillMount () {
        let { articleId } = this.props
        if (articleId) {
            this.getArticleAlias(articleId)
        }
    }

    getArticleAlias (articleId) {
        axios.get(getApi('alias?article_id=' + articleId)).then((res) => {
            let alias = res.data
            if (alias && typeof window !== 'undefined') {
                window.location.href = '/article/' + alias
            }
        }).catch(() => {})
    }

    render () {
        let { url, articleId } = this.props
        let is404 = this.props.statusCode === 404
        let message = is404 ? '您访问的这个页面不存在或被移到了别处' : '似乎出了点差错'

        return (
            <div>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <div className="error">
                    <div className="title">抱歉，{ message } :-(</div>
                    {
                        articleId ?
                        <div className="check-id">
                        { `正在尝试跳转到 ${url && url.pathname} 对应的新地址 ……`}
                        </div> : ''
                    }
                    <div className="op">
                        {
                            is404 ? '' :
                            <a className="refresh" href="javascript:;" onclick="window.location.reload()">
                                刷新重试
                            </a>
                        }
                        <a className="back" href="/">回到首页</a>
                    </div>
                </div>

                <style jsx global>{`
                    html {
                        font-size:  62.5%;
                    }
                    body {
                        position: relative;
                        color: #fffaf0;
                        font-size: 2rem;
                        background: #6495ed;
                    }
                    a {
                        margin: 0 10px;
                        color: #fffaf0;
                        text-decoration: none;
                    }
                    .error {
                        width: 460px;
                        height: 120px;
                        top: 50%;
                        left: 50%;
                        position: fixed;
                        line-height: 500%;
                        margin-left: -230px;
                        margin-top: -60px;
                        text-align: center;
                        font-weight: 200;
                    }
                    .refresh {
                        padding: 5px 10px;
                        border-radius: 2px;
                        border: 1px solid #ffff00;
                        color: #ffff00;
                    }
                    .back {
                        font-size: 1.6rem;
                        padding: 5px 10px;
                        border-radius: 2px;
                        border: 1px solid #fff;
                    }

                    @media (max-width: 1024px) {
                        .error {
                            width: 100%;
                            left: 0;
                            right: 0;
                            margin-left: 0;
                            font-size: 1.2rem;
                        }
                    }
                `}</style>
            </div>
        )
    }
}
