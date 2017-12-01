import React from 'react'
import axios from 'axios'
import styled, { css } from 'styled-components'

import Loading from './Loading'
import commentStorage from '../../helpers/storage'
import { getApi, prettyDate } from '../../helpers'
import { auxColor, fontAuxColor, fontFamilyNumber } from '../styled-global/constant'

const List = styled.div`
    padding-bottom: 2em;
`
const ListBody = styled.div``
const ListError = styled.div``
const ListContent = styled.div``
const ListEmpty = styled.div`
    text-align: center;
    padding: 2em 0;
`
const NoAuditStyle = css`
    &.no-audit {
        user-select: none;
        cursor: default;
        filter: blur(1px);
        opacity: 0.6;
    }
`
const Comment = styled.div`
    margin-bottom: 1em;
    padding-bottom: 1em;
    border-bottom: 1px dashed ${auxColor};
    &:last-child {
        border: none;
    }
`
const CommentHead = styled.div`
    height: 40px;
    line-height: 40px;
    padding-left: 2.6em;
    text-align: right;
    ${NoAuditStyle};
`
const CommentHeadAuthor = styled.span`
    float: left;
`
const CommentHeadAuthorAvatar = styled.img`
    width: 30px;
    height: auto;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -15px;
`
const CommentHeadLocal = styled.span`
    font-size: small;
    font-style: italic;
    color: ${fontAuxColor};
    font-family: ${fontFamilyNumber};
`
const CommentHeadDate = CommentHeadLocal.extend`
    &:before {
        content: '·';
        padding: 0 .5em;
    }
`
const CommentBody = styled.div`
    padding-left: 3em;
    font-size: 1.4rem;
    ${NoAuditStyle};
`
const CommentBodyContent = styled.div``
const CommentBodyReply = styled.div`
    background: #f5f5f5;
    padding: 0.5em 1em;
    margin-top: .5em;
`
const CommentBodyReplyName = styled.div`
    font-weight: bold;
`
const CommentBodyReplyContent = styled.div``
const CommentNoAudit = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    color: #d62219;
    > i {
        font-size: 3em;
    }
`

const urlRE = /^(http|https):\/\//
const commentUrl = url => urlRE.test(url) ? url : '//' + url

const ComponentAuthor = props => (
    <CommentHeadAuthor>{!props.url
        ? <span>{props.author}</span>
        : <a target="_blank" rel="nofollow noopener noreferrer" href={commentUrl(props.url)}>
            {props.author}
        </a>
    }</CommentHeadAuthor>
)

const ComponentList = props => props.comments.map(comment => (
    <Comment key={comment.id}>
        <CommentHead className={comment.noAudit ? 'no-audit' : ''}>
            <CommentHeadAuthorAvatar src={`https://avatar.qwps.cn/avatar/${comment.author}`} />
            <ComponentAuthor author={comment.author} url={comment.url} />
            <CommentHeadLocal>{comment.local}</CommentHeadLocal>
            <CommentHeadDate>{prettyDate(comment.date)}</CommentHeadDate>
        </CommentHead>
        <CommentBody className={comment.noAudit ? 'no-audit' : ''}>
            <CommentBodyContent>{comment.content}</CommentBodyContent>
            {!comment.answers.length ? null
                : <CommentBodyReply>
                    <CommentBodyReplyName>
                        {`${comment.answers[0].author}（博主）回复：`}
                    </CommentBodyReplyName>
                    <CommentBodyReplyContent>{comment.answers[0].content}</CommentBodyReplyContent>
                </CommentBodyReply>}
        </CommentBody>
        {comment.noAudit ? <CommentNoAudit><i className="iconfont icon-noaudit"></i></CommentNoAudit> : null}
    </Comment>
))

export default class extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            error: '',
            isLoad: true,
            loaded: false,
            comments: []
        }
    }

    getNoAuditComments (list = []) {
        const { id } = this.props
        const noAudits = commentStorage.get() || []
        const auditIds = list.map(comment => comment.id)
        return noAudits.filter(comment => !~auditIds.indexOf(comment.id) && comment.articleId === id)
    }

    addUnAudit (comment) {
        const { comments } = this.state
        const noAudits = commentStorage.get()

        comment.noAudit = true
        comment.articleId = this.props.id
        comments.unshift(comment)
        noAudits.push(comment)

        this.setState({
            comments: comments
        })

        commentStorage.set(noAudits)
    }

    afterLoad () {
        if (this.props.onLoad) {
            this.props.onLoad()
        }
    }

    async load () {
        this.setState({
            isLoad: true
        })

        const url = getApi(`comments/${this.props.id}`)
        await axios.get(url).then(res => {
            const noAudits = this.getNoAuditComments(res.data)

            this.setState({
                error: '',
                loaded: true,
                isLoad: false,
                comments: noAudits.concat(res.data)
            })
        }).catch(err => {
            this.setState({
                loaded: true,
                isLoad: false,
                error: err.message || `${this.props.type}加载失败`
            })
        })

        this.afterLoad()
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.reached && !this.state.loaded) {
            this.load()
        }
    }

    componentDidMount () {
        if (this.props.reached) {
            this.load()
        }
    }

    render () {
        const { type } = this.props
        let { isLoad, error, comments } = this.state

        return (
            <List>{isLoad ? <Loading />
                : <ListBody>{error ? <ListError></ListError>
                    : <ListContent>{!comments.length
                        ? <ListEmpty>
                            <i className="iconfont icon-nodata" />
                            {` 暂时还没有${type} ~`}
                        </ListEmpty>
                        : <ComponentList comments={comments} />
                    }</ListContent>
                }</ListBody>
            }</List>
        )
    }
}
