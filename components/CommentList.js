import React from 'react'
import axios from 'axios'

import { getApi, prettyDate } from '../common'
import CommonLoading from './CommonLoading'


const getCopy = (typeName) => {
    return {
        REPLY: ' 回复于 ',
        EMPTY: typeName +'空空如也',
        ERROR: typeName +'加载失败'
    }
}

const regURL = /^(http|https):\/\//
const getCommentHref = url => {
    return url ? (regURL.test(url) ? url : '//' + url) : 'javascript:;'
}

export default class CommentList extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            isLoad: false,
            comments: [],
            error: '',
        }
    }

    componentDidMount () {
        if (this.props.toLoad) {
            this.loadComments(this.props.articleId, this.props.sortType)
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.toLoad) {
            this.loadComments(nextProps.articleId, nextProps.sortType)
        }
    }

    loadComments (articleId, sortType) {
        this.setState({
            isLoad: true
        })

        let url = getApi('getcomments?article_id='+ articleId +'&sort='+ sortType)

        axios.get(url).then(res => {
            this.setState({
                isLoad: false,
                comments: res.data,
                error: ''
            })
        }).catch(err => {
            this.setState({
                isLoad: false,
                comments: [],
                error: err.message || COPY.ERROR
            })
        })
    }

    render () {
        const comments = this.state.comments
        const COPY = getCopy(this.props.typeName)

        return (
            <div className="comment-list">
                { this.state.isLoad ? <CommonLoading /> :
                    (comments.length ? comments.map((comment, index) => (
                        <div className="comment-item" key={ comment.id }>
                            <div className="comment-head">
                                <span className="comment-index constantia">#{ index + 1 }</span>
                                <a className="comment-author"
                                    target="_blank"
                                    rel="nofollow noopener noreferrer"
                                    href={ getCommentHref(comment.url) }
                                >{ comment.author }</a>
                                <span className="comment-local">{ comment.local }</span>
                                <span className="comment-date">{ prettyDate(comment.date) }</span>
                            </div>
                            <div className="comment-body">{ comment.content }</div>
                            { comment.answers.length ?
                                <div className="comment-answers">
                                { comment.answers.map((answer) => (
                                    <div className="answer" key={ answer.id }>
                                        <div className="answer-name">
                                            <a href="/">{ answer.author }</a>
                                            { COPY.REPLY + prettyDate(answer.date)  }
                                        </div>
                                        <div className="answer-body">{ answer.content }</div>
                                    </div>
                                )) }
                                </div> : ''
                            }
                        </div>)) :
                        (this.props.toLoad ? <div className="comment-empty">{ COPY.EMPTY }</div> : '')
                    )
                }
                { this.state.error ? <div className="comment-error">{ this.state.error }</div> : '' }

                <style jsx>{`
                    .comment-list {
                        padding-top: 30px;
                    }
                    .comment-error {
                        color: red;
                        text-algin: center;
                    }
                    .comment-empty {
                        color: #808080;
                        text-align: center;
                        padding-bottom: 30px;
                    }
                    .comment-item {
                        border-radius: 2px;
                        margin-bottom: 20px;
                        border: 1px solid #dadada;
                    }
                    .comment-head {
                        padding: 6px 10px;
                        background: #f7f7f7;
                    }
                    .comment-index {
                        color: #808080;
                        font-size: 1.8rem;
                        margin-right: 10px;
                    }
                    .comment-author {
                        color: #a52a2a;
                        font-weight: 500;
                        cursor: pointer;
                    }
                    .comment-author[href='javascript:;'] {
                        cursor: text;
                    }
                    .comment-local {
                        margin-left: 10px;
                        color: #808080;
                        font-size: 1.4rem;
                        font-style: italic;
                    }
                    .comment-date {
                        position: absolute;
                        right: 10px;
                        color: #808080;
                        font-size: 1.4rem;
                    }
                    .comment-body {
                        padding: 10px;
                        color: #666;
                    }
                    .comment-answers {
                        margin: 10px;
                        margin-top: 0;
                        padding: 10px;
                        background: #fffbdb;
                        border-radius: 2px;
                        font-size: 1.4rem;
                        color: #666;
                    }
                    .answer-name {
                        font-style: italic;
                        color: #a9a9a9;
                    }
                    @media (max-width: 320px) {
                        .comment-date {
                            display: none;
                        }
                    }
                `}</style>
            </div>
        )
    }
}