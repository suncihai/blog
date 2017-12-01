import { ServerStyleSheet } from 'styled-components'
import Document, { Head, Main, NextScript } from 'next/document'

import GlobalStyle from '../components/GlobalStyle'
import NormalizeStyle from '../components/NormalizeStyle'
import NprogressStyle from '../components/NprogressStyle'

export default class MyDocument extends Document {
    render () {
        const sheet = new ServerStyleSheet()
        const AppContent = sheet.collectStyles(<Main />)
        const StyleContent = sheet.getStyleElement()

        return (
            <html>
                <Head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=Edge, chrome=1" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                    <link rel="stylesheet" href="/static/iconfont/iconfont.css" />
                    <link rel='shortcut icon' type='image/x-icon' href='/static/images/favicon.png' />
                    <NormalizeStyle />
                    <NprogressStyle />
                    <GlobalStyle />
                    {StyleContent}
                </Head>
                <body>
                    <div className="app">
                        {AppContent}
                    </div>
                    <NextScript />
                </body>
            </html>
        )
    }
}
