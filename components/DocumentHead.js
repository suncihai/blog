import React from 'react'
import Head from 'next/head'

import GlobalCSS from '../styles/Global'
import NormalizeCSS from '../styles/Normalize'

const DEFAULT_KEYWORDS = '前端开发, JavaScript, CSS, HTML, 前端博客'

export default class DocumentHead extends React.Component {

    render () {
        let {
            title,
            keywords,
            description,
            linkcss
        } = this.props

        return (
            <div>
                <Head>
                    <meta charSet="utf-8" />
                    <title>{ title }</title>
                    <meta name="keywords" content={ keywords || DEFAULT_KEYWORDS } />
                    <meta name="description" content={ description } />
                    <link rel='shortcut icon' type='image/x-icon' href='/static/images/favicon.ico' />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                </Head>
                <NormalizeCSS />
                <GlobalCSS />
            </div>
        )
    }
}
