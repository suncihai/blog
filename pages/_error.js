import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import styled from 'styled-components'

import { getApi } from '../helpers'
import track from '../helpers/track'

const Error = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`
const ErrorOther = styled.div``
const ErrorAnchor = styled.a`
    font-size: 1.4rem;
    &.backhome {
        position: absolute;
        right: 0;
    }
`
const ErrorMessage = styled.h3``

const numRE = /\d+/
const urlRE = /^(\/)\d+(.html)$/

export default class extends React.Component {
    static getInitialProps ({ req, res, jsonPageRes }) {
        let postId
        const url = req && req.url
        // 尝试找到文章 id 以便做跳转
        if (url && urlRE.test(url)) {
            postId = url.match(numRE)[0]
        }

        const statusCode = res ? res.statusCode
            : (jsonPageRes ? jsonPageRes.status : null)

        return {
            url,
            postId,
            statusCode
        }
    }

    constructor (props) {
        super(props)
        this.state = {
            found: false
        }
    }

    onTry () {
        track('error.try', this.props.statusCode)
        window.location.reload()
    }

    async componentDidMount () {
        const { postId, statusCode } = this.props
        if (postId) {
            track('error.old', postId)
            const url = getApi(`postname/${postId}`, window.location.origin)
            const { data } = await axios.get(url).catch(err => err)
            const { name } = data
            if (name) {
                track('error.jump', name)
                this.setState({
                    found: true
                })
                window.setTimeout(() => {
                    window.location.href = `/article/${name}`
                }, 1500)
            } else {
                track('error.unjump', postId)
            }
        } else {
            track('error.other', statusCode)
        }
    }

    render () {
        const { statusCode, postId, url } = this.props
        const tryToFindback = statusCode === 404 && postId && url
        const message = statusCode === 404 ? '抱歉，页面不存在' : '貌似出了点差错'
        const update = this.state.found ? '已找到新地址' : '当前访问的文章地址已更新'

        return (
            <div>
                <Head>
                    <title>😂😂😂😂😂😂😂</title>
                </Head>
                <Error>{tryToFindback
                    ? <ErrorMessage>
                        {update}，正在尝试跳转到新地址……
                        或：<a href="/">回首页</a>
                    </ErrorMessage>
                    : <ErrorOther>
                        <ErrorMessage>{`${message}: ${statusCode}`}</ErrorMessage>
                        <ErrorAnchor href="javascript:;" onClick={this.onTry.bind(this)}>刷新重试</ErrorAnchor>
                        <ErrorAnchor className="backhome" href="/"
                            onClick={() => track('error.backhome', statusCode)}>回到首页
                        </ErrorAnchor>
                    </ErrorOther>
                }</Error>
            </div>
        )
    }
}
