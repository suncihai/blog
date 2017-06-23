import React from 'react'
import axios from 'axios'
import { getApi } from '../common'


const getCopy = (typeName) => {
    return {
        STATUS: {
            READY: '填好了，提交' + typeName,
            PENDING: '正在提交'+ typeName +'……',
            FAILED: '数据处理失败',
        },
        FORM: {
            CONTENT: {
                LABEL: typeName +'内容：',
                DESC: '除了广告和敏感话题言论之外，可以畅所欲言。',
                PLACEHOLDER: '300 个字符以内'
            },
            NAME: {
                LABEL: '昵称：',
                DESC: '为自己起个简短易记的名字。',
                PLACEHOLDER: '20 个字符以内'
            },
            EMAIL: {
                LABEL: '电子邮件：',
                DESC: '如果需要，方便我可以联系到你，不会被公开到'+ typeName +'列表上。',
            },
            URL: {
                LABEL: '个人主页：',
                DESC: '你的博客或者 Github ，链接会加在昵称上方便大家访问。',
            },
            OPTIONAL: '（选填）'
        },
        SUCCESS: {
            YOUR: '你的'+ typeName +'：',
            WAIT: '已提交，审核后将会显示在'+ typeName +'列表中，如有疑问我将尽快回复，谢谢。'
        }
    }
}

const KLASS = {
    READY: 'ready',
    PENDING: 'pending',
    FAILED: 'failed',
}

const API_ADD_COMMENT = getApi('addcomment')


export default class CommentForm extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            url: '',
            email: '',
            author: '',
            content: '',

            error: '',
            success: false,
            pending: false,
        }
    }

    eventSetValue (evt, type) {
        this.setState({
            error: '',
            pending: false,
            [type]: evt.target.value
        })
    }

    eventSubmit () {
        if (
            !this.state.error &&
            !this.state.pending &&
            (this.state.author && this.state.content)
        ) {
            this.setState({
                pending: true
            })

            let data = {
                url: this.state.url,
                email: this.state.email,
                author: this.state.author,
                content: this.state.content,
                post_id: this.props.articleId
            }

            axios.post(API_ADD_COMMENT, data).then(res => {
                let isSuccess = res.data.success
                this.setState({
                    pending: false,
                    success: isSuccess,
                    error: isSuccess ? '' : res.data.message,
                })
            }).catch(err => {
                this.setState({
                    pending: false,
                    success: false,
                    error: err.message || COPY.STATUS.FAILED
                })
            })
        }
    }

    getButtonStatus () {
        const COPY = getCopy(this.props.typeName)

        let klass = KLASS.DISABLED
        let text = COPY.STATUS.READY

        if (this.state.pending) {
            klass = KLASS.PENDING
            text = COPY.STATUS.PENDING
        } else {
            if (this.state.error) {
                klass = KLASS.FAILED
                text = this.state.error
            } else {
                if (this.state.author && this.state.content) {
                    klass = KLASS.READY
                    text = COPY.STATUS.READY
                }
            }
        }

        return { text, klass }
    }

    render () {
        const bts = this.getButtonStatus()
        const COPY = getCopy(this.props.typeName)

        return (
            <div className="comment">
                { this.state.success ?
                    <div className="comment-success">
                        <span className="success-author">{ this.state.author }</span>
                        { COPY.SUCCESS.YOUR }
                        <i className="quote">“</i>
                        <span className="success-content">{ this.state.content }</span>
                        <i className="quote right">”</i>
                        { COPY.SUCCESS.WAIT }
                    </div> :
                    <div>
                        <table>
                            <tbody>
                                <tr>
                                    <td className="label">
                                        <label htmlFor="content" className="type">{ COPY.FORM.CONTENT.LABEL }</label>
                                        <small className="desc">{ COPY.FORM.CONTENT.DESC }</small>
                                    </td>
                                    <td className="form">
                                        <textarea
                                            id="content"
                                            value={ this.state.content }
                                            disabled={ this.state.pending }
                                            placeholder={ COPY.FORM.CONTENT.PLACEHOLDER }
                                            onChange={ (e) => this.eventSetValue(e, 'content') }
                                            className="input textarea">
                                        </textarea>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">
                                        <label htmlFor="author" className="type">{ COPY.FORM.NAME.LABEL }</label>
                                        <small className="desc">{ COPY.FORM.NAME.DESC }</small>
                                    </td>
                                    <td className="form">
                                        <input
                                            id="author"
                                            value={ this.state.author }
                                            disabled={ this.state.pending }
                                            placeholder={ COPY.FORM.NAME.PLACEHOLDER }
                                            onChange={ (e) => this.eventSetValue(e, 'author') }
                                            type="text" className="input"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">
                                        <label htmlFor="email" className="type">
                                            { COPY.FORM.EMAIL.LABEL }
                                            <small className="desc">{ COPY.FORM.OPTIONAL }</small>
                                        </label>
                                        <small className="desc">{ COPY.FORM.EMAIL.DESC }</small>
                                    </td>
                                    <td className="form">
                                        <input
                                            id="email"
                                            value={ this.state.email }
                                            disabled={ this.state.pending }
                                            onChange={ (e) => this.eventSetValue(e, 'email') }
                                            type="text" className="input"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">
                                        <label htmlFor="url" className="type">
                                            { COPY.FORM.URL.LABEL }
                                            <small className="desc">{ COPY.FORM.OPTIONAL }</small>
                                        </label>
                                        <small className="desc">{ COPY.FORM.URL.DESC }</small>
                                    </td>
                                    <td className="form">
                                        <input
                                            id="url"
                                            value={ this.state.url }
                                            disabled={ this.state.pending }
                                            onChange={ (e) => this.eventSetValue(e, 'url') }
                                            type="text" className="input"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button
                            disabled={ this.state.pending }
                            onClick={ this.eventSubmit.bind(this) }
                            className={ 'comment-submit ' + bts.klass }
                        >
                            { bts.text }
                        </button>
                    </div>
                }

                <style jsx>{`
                    .comment {
                        padding: 20px;
                        margin-top: 30px;
                        background: #fcfcfc;
                        border-radius: 2px;
                        border: 1px dashed #dadada;
                    }
                    .comment-success {
                        color: #20b2aa;
                    }
                    .quote {
                        font-style: normal;
                        font-size: 2.6rem;
                        vertical-align: middle;
                        vertical-align: -webkit-baseline-middle;
                    }
                    .quote.right {
                        margin-right: 10px;
                    }
                    .success-author {
                        color: #a52a2a;
                        display: inline-block;
                        margin-right: 10px;
                    }
                    .success-content {
                        color: #6c6c6c;
                        display: inline-block;
                        margin: 0 10px;
                    }

                    .label {
                        width: 30%;
                        padding: 10px 0;
                    }
                    .type {
                        display: block;
                        font-weight: 400;
                    }
                    .desc {
                        color: #808080;
                    }

                    .form {
                        padding-left: 30px;
                    }

                    .input {
                        display: block;
                        width: 100%;
                        height: 100%;
                        padding: 10px;
                        box-sizing: border-box;
                        border: 1px solid #dadada;
                        border-radius: 2px;
                        outline: none;
                        font-size: 1.4rem;
                        background: #fff;
                    }
                    .input:focus {
                        background: #f0f8ff;
                        border-color: #6495ed;
                    }
                    .textarea {
                        resize: none;
                        height: 90px;
                    }

                    .comment-submit {
                        display: block;
                        width: 100%;
                        border: none;
                        padding: 12px;
                        margin-top: 10px;
                        border-radius: 2px;
                        color: #fff;
                        outline: none;
                    }
                    .comment-submit.ready {
                        cursor: pointer;
                        background: #6495ed;
                    }
                    .comment-submit.disabled {
                        cursor: not-allowed;
                        background: #a9a9a9;
                    }
                    .comment-submit.pending {
                        opacity: 0.7;
                        background: #6495ed;
                        cursor: not-allowed;
                    }
                    .comment-submit.failed {
                        cursor: default;
                        background: #ea5035;
                    }
                `}</style>
            </div>
        )
    }
}