import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import styled from 'styled-components'

import { getApi } from '../helpers'
import track from '../helpers/track'

import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import ComponentIcon from '../components/modules/Icon'
import { Icon as ComponentLoadingIcon } from '../components/modules/Loading'
import { App, AppBody } from '../components/styled-global'

const Error = styled.div`
    padding-top: 4em;
    text-align: center;
`
const ErrorIcon = styled.div`
    > i {
        font-size: 6rem;
    }
`
const ErrorText = styled.h2`
    margin: 2em 0;
    font-weight: 300;
`
const ErrorJump = styled.div`
    font-weight: 200;
`

const numRE = /\d+/
const urlRE = /^(\/)\d+(.html)/

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
            postId,
            statusCode
        }
    }

    constructor (props) {
        super(props)
        this.state = {
            found: false,
            noResult: false
        }
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
                }, 2000)
            } else {
                track('error.unjump', postId)
                this.setState({
                    noResult: true
                })
            }
        } else {
            track('error.other', statusCode)
        }
    }

    render () {
        const { found, noResult } = this.state
        const { statusCode, postId } = this.props
        const errorMessage = statusCode === 404
            ? '您访问的页面不存在或被移到了新的地址 ~'
            : '服务器开小差，请稍后重试 ~'

        let jumpMessage
        if (postId) {
            jumpMessage = noResult
                ? '😞 抱歉没有找到旧地址，您可以到博客别处看看 ~'
                : found
                    ? '已找到新地址，现在立刻马上即将为您跳转到新页面 🚀'
                    : '当前访问的文章地址已更新，正在尝试找到新地址'
        }

        return (
            <div>
                <Head>
                    <title>😂 😂 😂</title>
                </Head>
                <App>
                    <ComponentHeader statusCode={statusCode} />
                    <AppBody>
                        <Error>
                            <ErrorIcon>
                                <ComponentIcon type={found ? 'happy' : 'sad'} />
                            </ErrorIcon>
                            <ErrorText>{errorMessage}</ErrorText>
                            {!jumpMessage ? null
                                : <ErrorJump>
                                    {jumpMessage}&nbsp;&nbsp;
                                    {noResult || found ? null : <ComponentLoadingIcon />}
                                </ErrorJump>}
                        </Error>
                    </AppBody>
                    <ComponentFooter visible={true} />
                </App>
            </div>
        )
    }
}
