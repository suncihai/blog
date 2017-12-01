import React from 'react'
import axios from 'axios'
import hljs from 'highlight.js'
import ReactDOM from 'react-dom'

import { getApi, prettyDate, getLineNumber } from '../helpers'

import HighLightStyle from '../components/HighLightStyle'
import DocumentHead from '../components/DocumentHead'
import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import ComponentUnArticle from '../components/modules/UnArticle'
import ComponentShareArticle from '../components/modules/ShareArticle'
import ComponentCommentList from '../components/modules/CommentList'
import ComponentCommentForm from '../components/modules/CommentForm'
import ComponentIcon from '../components/modules/Icon'
import { App, AppBody } from '../components/styled-global'
import {
    Article,
    ArticleHeader,
    ArticleDate,
    ArticleBody,
    ArticleComment,
    ArticleCommentTitle
} from '../components/styled-pages/article'

export default class extends React.Component {
    static async getInitialProps ({ query, res }) {
        const { name } = query
        const { data } = await axios.get(getApi(`article/${name}`))
        return {
            name,
            article: data
        }
    }

    constructor (props) {
        super(props)
        this.state = {
            reached: false
        }
        this.onScroll = this.onScroll.bind(this)
    }

    onCommentAdded (newComment) {
        if (this.refs.list) {
            this.refs.list.addUnAudit(newComment)
        }
    }

    onScroll () {
        if (this.state.reached || !this.refComment) {
            return
        }

        const clientHeight = document.compatMode === 'CSS1Compat'
            ? document.documentElement.clientHeight
            : document.body.clientHeight

        if (this.refComment.offsetTop - window.scrollY < clientHeight) {
            this.setState({
                reached: true
            })
        }
    }

    componentDidMount () {
        const el = ReactDOM.findDOMNode(this)
        const pres = el.querySelectorAll('pre')
        for (let i = 0; i < pres.length; i++) {
            let pre = pres[i]
            pre.appendChild(getLineNumber(pre.innerHTML))
            hljs.highlightBlock(pre)
            pre.style.visibility = 'visible'
        }

        window.addEventListener('scroll', this.onScroll)
    }

    componentWillUnmount () {
        window.removeEventListener('scroll', this.onScroll)
    }

    render () {
        const { reached } = this.state
        const { article, name } = this.props

        return (
            <div>
                <DocumentHead
                    title={article && article.title}
                    description={article && article.description} />
                <App>
                    <ComponentHeader />
                    <AppBody>{!article
                        ? <ComponentUnArticle />
                        : <Article>
                            <ArticleHeader><a href={`/article/${name}`}>{article.title}</a></ArticleHeader>
                            <ArticleDate>{`写于：${prettyDate(article.date)}`}</ArticleDate>
                            <ArticleBody dangerouslySetInnerHTML={{ __html: article.content }} />
                            <ComponentShareArticle />
                            <ArticleComment innerRef={el => { this.refComment = el }}>
                                <ArticleCommentTitle>
                                    <ComponentIcon type="list" /> 评论列表
                                </ArticleCommentTitle>
                                <ComponentCommentList reached={reached} id={article.id} type="评论" ref="list" />
                                <ComponentCommentForm id={article.id} type="评论" onAdded={this.onCommentAdded.bind(this)} />
                            </ArticleComment>
                        </Article>
                    }</AppBody>
                    <ComponentFooter visible={true} />
                </App>
                <HighLightStyle />
            </div>
        )
    }
}
