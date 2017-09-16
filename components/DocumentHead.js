import React from 'react'
import Head from 'next/head'

import GlobalCSS from '../styles/Global'
import NormalizeCSS from '../styles/Normalize'
import NprogressCSS from '../styles/Nprogress'

const TITLE_SUFFIX = ' - 唐比昌的个人博客'
const DEFAULT_KEYWORDS = '前端开发, JavaScript, CSS, HTML, 前端博客'
const DEFAULT_DESCRIPTION = '记录、分享和总结是一个程序员成长的好习惯，这是我的个人博客，'+
                            '主要记录一些与前端开发相关的心得以及一些生活感悟等，无聊、有空、心情好的时候随便写写~'

export default class DocumentHead extends React.Component {

    render () {
        let { title, keywords, description } = this.props

        return (
            <div>
                <Head>
                    <meta charSet="utf-8" />
                    <title>{ title + TITLE_SUFFIX }</title>
                    <meta name="keywords" content={ keywords || DEFAULT_KEYWORDS } />
                    <meta name="description" content={ description || DEFAULT_DESCRIPTION } />
                    <meta httpEquiv="X-UA-Compatible" content="IE=Edge, chrome=1" />
                    <link rel="stylesheet" href="/static/iconfont/style.css" />
                    <link rel='shortcut icon' type='image/x-icon' href='/static/images/favicon.png' />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                </Head>
                <NormalizeCSS />
                <GlobalCSS />
                <NprogressCSS />
            </div>
        )
    }
}
