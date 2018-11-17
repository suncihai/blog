import React from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom'
import styled, { css } from 'styled-components'

import ComponentIcon from './Icon'
import ComponentLoading from './Loading'
import commentStorage from '../../helpers/storage'
import { getApi } from '../../helpers'
import { EllipsisStyle } from '../styled-global'
import { auxColor, fontAuxColor, mediaEdge, onePixelBorder } from '../styled-global/constant'

const List = styled.div`
    padding-bottom: 2em;
    @media (max-width: ${mediaEdge}) {
        padding-bottom: 1em;
    }
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
    }
`
const Comment = styled.div`
    margin-bottom: 1em;
    padding-bottom: 1em;
    border-bottom: 1px dashed ${auxColor};
    &:last-child {
        border: none;
    }
    @media (max-width: ${mediaEdge}) {
        ${onePixelBorder}
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
    position: absolute;
    left: 2.6em;
    max-width: 50%;
    font-weight: bold;
    color: #666;
    ${EllipsisStyle};
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
    color: ${fontAuxColor};
`
const CommentHeadDate = CommentHeadLocal.extend`
    @media (max-width: ${mediaEdge}) {
        display: none;
    }
`
const CommentHeadLocalDivision = styled.span`
    &:before {
        content: '·';
        padding: 0 .5em;
        color: ${fontAuxColor};
    }
    @media (max-width: ${mediaEdge}) {
        display: none;
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
    text-align: justify;
`
const CommentBodyReplyName = styled.div`
    font-weight: bold;
`
const CommentBodyReplyContent = styled.div`
    text-align: justify;
`
const CommentNoAudit = styled.div`
    position: absolute;
    right: 0;
    bottom: 0;
    color: #d62219;
    > i {
        font-size: 3em;
    }
`

const urlRE = /^(http|https):\/\//
const commentUrl = url => urlRE.test(url) ? url : '//' + url // 为了兼容旧的无协议网址

const ComponentAuthor = ({ author, url }) => (
    <CommentHeadAuthor title={author}>{!url
        ? <span>{author}</span>
        : <a target="_blank" rel="nofollow noopener noreferrer" href={commentUrl(url)}>
            {author}
        </a>
    }</CommentHeadAuthor>
)

const ComponentList = ({ comments }) => comments.map(comment => (
    <Comment key={comment.id}>
        <CommentHead className={comment.noAudit ? 'no-audit' : ''}>
            <CommentHeadAuthorAvatar src={`https://avatar.qwps.cn/avatar/${comment.author}`} />
            <ComponentAuthor author={comment.author} url={comment.url} />
            <CommentHeadLocal>{comment.local}</CommentHeadLocal>
            {comment.local ? <CommentHeadLocalDivision /> : null}
            <CommentHeadDate>{comment.date}</CommentHeadDate>
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
        {comment.noAudit ? <CommentNoAudit><ComponentIcon type="noaudit" /></CommentNoAudit> : null}
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

    updateScroll () {
        let offsetTop = 0
        let el = ReactDOM.findDOMNode(this)

        el = el.offsetParent
        while (el) {
            offsetTop += el.offsetTop
            el = el.offsetParent
        }
        window.scrollTo(0, offsetTop)
    }

    getNoAudits (list = []) {
        const { id } = this.props
        const noAudits = commentStorage.get()
        const auditIds = list.map(comment => comment.id)

        const newNoAudits = noAudits.filter(comment => auditIds.indexOf(comment.id) === -1)
        commentStorage.set(newNoAudits)

        return noAudits.filter(comment => {
            return comment.articleId === id && auditIds.indexOf(comment.id) === -1
        })
    }

    addUnAudit (comment) {
        const { comments } = this.state
        const noAudits = commentStorage.get()

        comment.noAudit = true
        comment.articleId = this.props.id
        comments.unshift(comment)
        noAudits.unshift(comment)

        this.setState({
            comments: comments
        })

        commentStorage.set(noAudits)

        if (this.props.autoscroll) {
            this.updateScroll()
        }
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

        const url = getApi(`comments/${this.props.id}`, window.location.origin)
        await axios.get(url).then(res => {
            const { data } = res
            const noAudits = this.getNoAudits(data.result)

            this.setState({
                error: '',
                loaded: true,
                isLoad: false,
                comments: noAudits.concat(data.result)
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
            <List>{isLoad ? <ComponentLoading />
                : <ListBody>{error ? <ListError></ListError>
                    : <ListContent>{!comments.length
                        ? <ListEmpty>
                            <ComponentIcon type="nodata" />
                            {` 暂时还没有${type} ~`}
                        </ListEmpty>
                        : <ComponentList comments={comments} />
                    }</ListContent>
                }</ListBody>
            }</List>
        )
    }
}
