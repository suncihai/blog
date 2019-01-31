import React from 'react'
import axios from 'axios'
import styled, { css, keyframes } from 'styled-components'

import { getApi } from '../../helpers'
import config from '../../config/server'

import ComponentIcon from './Icon'
import { Icon as ComponentLoadingIcon } from './/Loading'
import { FormStyle } from '../styled-global'
import { fontAuxColor, mediaEdge, onePixelBorder } from '../styled-global/constant'
import track from '../../helpers/track'

const CommentFormStyle = css`
    width: 100%;
    resize: none;
    font-size: 1.4rem;
    padding: .75rem;
    appearance: none;
    @media (max-width: ${mediaEdge}) {
        border-color: rgba(0, 0, 0, .35);
        ${onePixelBorder}
    }
`
const Textarea = styled.textarea`
    ${FormStyle};
    ${CommentFormStyle};
`
const InputText = styled.input`
    ${FormStyle};
    ${CommentFormStyle};
`
const Form = styled.div`
    margin-bottom: 2em;
    border-radius: 2px;
`
const Table = styled.table`
    width: 100%;
`
const Tbody = styled.tbody``
const Tr = styled.tr``
const Td = styled.td`
    &.left {
        width: 40%;
        padding: 1em 0;
    }
    &.right {
        padding: 0 1em;
    }
    @media (max-width: ${mediaEdge}) {
        &.left {
            padding: .5em 0;
        }
        &.right {
            padding: 0 .5em;
        }
    }
`
const Label = styled.label`
    display: block;
    font-weight: 400;
    > span {
        font-size: 1.4rem;
        color: ${fontAuxColor};
    }
`
const Small = styled.small`
    color: ${fontAuxColor};
`
const ButtonBox = styled.div`
    width: 100%;
    text-align: right;
    margin-top: 1em;
`
const shakeAnimation = keyframes`
    from, to {
      transform: translate3d(0, 0, 0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translate3d(-10px, 0, 0);
    }
    20%, 40%, 60%, 80% {
      transform: translate3d(10px, 0, 0);
    }
`
const TextError = styled.span`
    position: absolute;
    left: 0;
    color: #d62219;
    font-size: 1.4rem;
    padding: 0.35em 0;
    animation-duration: 1s;
    animation-fill-mode: both;
    animation-name: ${shakeAnimation};
    @media (max-width: ${mediaEdge}) {
        display: block;
        position: relative;
        text-align: left;
        font-size: 1.4rem;
        padding: 0 0 1em 0;
    }
`
const ButtonStyle = css`
    display: inline-block;
    width: 120px;
    border: none;
    padding: .75em;
    border-radius: .1em;
    color: #fff;
    outline: none;
    font-size: 1.4rem;
    user-select: none;
`
const ButtonReset = styled.button`
    ${ButtonStyle};
    background: #778899;
    margin-right: 2em;
    cursor: pointer;
    @media (max-width: ${mediaEdge}) {
        position: absolute;
        left: 0;
    }
`
const ButtonSubmit = styled.button`
    ${ButtonStyle};
    &.enable {
        cursor: pointer;
        background: #6495ed;
    }
    &.disable {
        cursor: not-allowed;
        background: gray;
    }
    &.pending {
        opacity: .7;
        cursor: not-allowed;
    }
`

const klass = {
    enable: 'enable',
    disable: 'disable'
}

const charLimit = config.commentCharLimit

const initState = () => ({
    email: '',
    content: '',
    nickname: '',
    homepage: '',
    errorText: '',
    pending: false,
    buttonClass: klass.disable
})

const urlRE = /^(http|https):\/\//

export default class extends React.Component {
    constructor (props) {
        super(props)
        this.state = initState()
    }

    onReset (e) {
        this.setState(initState())
        this.refEmail.value = ''
        this.refContent.value = ''
        this.refNickname.value = ''
        this.refHomepage.value = ''
        if (e) {
            track('reset.click', this.props.type)
        }
    }

    onChange (type, value) {
        value = value.trim()

        const { content, nickname } = this.state
        const enable = value && (type === 'content' ? nickname : content)

        this.setState({
            [type]: value.trim(),
            buttonClass: enable ? klass.enable : klass.disable
        })
    }

    onSubmit () {
        const { email, content, nickname, homepage, buttonClass, pending } = this.state

        if (!content || !nickname || buttonClass !== klass.enable || pending) {
            return
        }

        let errorText
        if (content.length > charLimit.content) {
            errorText = '评论内容'
        } else if (nickname.length > charLimit.nickname) {
            errorText = '昵称'
        } else if (email.length > charLimit.email) {
            errorText = '电子邮件'
        } else if (homepage.length > charLimit.homepage) {
            errorText = '个人主页'
        }

        if (errorText) {
            errorText += '长度超出限制，请修改后再提交。'
            track('value.overlength', this.props.type)
        }

        if (homepage && !urlRE.test(homepage)) {
            errorText = '网址格式错误，请填写完整正确的 URL'
            track('value.urlerror', this.props.type)
        }

        if (errorText) {
            this.setState({ errorText })
            return
        }

        this.setState({
            pending: true
        })

        const postData = { email, content, nickname, homepage }
        const url = getApi(`comment/${this.props.id}`, window.location.origin)
        axios.post(url, postData).then(res => {
            const { data } = res
            if (data.success) {
                this.onReset()
                this.props.onAdded(data.result)
                track('form.onsubmit', this.props.type)
            } else {
                this.setState({
                    pending: false,
                    errorText: data.message,
                    buttonClass: klass.enable
                })
            }
        }).catch(err => {
            this.setState({
                pending: false,
                errorText: '服务器错误，请稍后重试。',
                buttonClass: klass.enable
            })
            track('form.server.error', this.props.id)
            throw err
        })
    }

    render () {
        const { type } = this.props
        const { buttonClass, errorText, pending } = this.state
        const klass = `${buttonClass}${pending ? ' pending' : ''}`

        return (
            <Form>
                <Table>
                    <Tbody>
                        <Tr>
                            <Td className="left">
                                <Label htmlFor="c_content">{`${type}内容：`}</Label>
                                <Small>除了广告和敏感话题言论之外，可以畅所欲言。</Small>
                            </Td>
                            <Td className="right">
                                <Textarea id="c_content" rows="3"
                                    ref={input => { this.refContent = input }}
                                    placeholder={`限 ${charLimit.content} 个字符以内`}
                                    onChange={e => this.onChange('content', e.target.value)}
                                ></Textarea>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td className="left">
                                <Label htmlFor="c_nickname">昵称：</Label>
                                <Small>为自己起个简短易记的名字。</Small>
                            </Td>
                            <Td className="right">
                                <InputText id="c_nickname"
                                    ref={input => { this.refNickname = input }}
                                    placeholder={`限 ${charLimit.nickname} 个字符以内`}
                                    onChange={e => this.onChange('nickname', e.target.value)}
                                ></InputText>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td className="left">
                                <Label htmlFor="c_email">电子邮件：<span>（选填）</span></Label>
                                <Small>方便我可以联系到你，绝对不会被公开。</Small>
                            </Td>
                            <Td className="right">
                                <InputText id="c_email"
                                    ref={input => { this.refEmail = input }}
                                    placeholder={`限 ${charLimit.email} 个字符以内`}
                                    onChange={e => this.setState({ email: e.target.value })}
                                ></InputText>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td className="left">
                                <Label htmlFor="c_homepage">个人主页：<span>（选填）</span></Label>
                                <Small>你的个人主页，链接会加在昵称上方便大家访问。</Small>
                            </Td>
                            <Td className="right">
                                <InputText id="c_homepage"
                                    ref={input => { this.refHomepage = input }}
                                    placeholder={`限 ${charLimit.homepage} 个字符以内`}
                                    onChange={e => this.setState({ homepage: e.target.value })}
                                ></InputText>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
                <ButtonBox>
                    {!errorText ? null
                        : <TextError>
                            <ComponentIcon type="warning" /> {errorText}
                        </TextError>
                    }
                    <ButtonReset onClick={this.onReset.bind(this)}>重置</ButtonReset>
                    <ButtonSubmit className={klass} onClick={this.onSubmit.bind(this)}>
                        {pending ? <ComponentLoadingIcon color="#fff" /> : null}
                        {pending ? ' 提交中' : `提交${type}`}
                    </ButtonSubmit>
                </ButtonBox>
            </Form>
        )
    }
}
