import React from 'react'
import Head from 'next/head'

import {
    titleSuffix,
    defaultTitle,
    defaultKeywords,
    defaultDescription
} from '../config/website'

export default class DocumentHead extends React.Component {
    render () {
        return (
            <div>
                <Head>
                    <title>{(this.props.title || defaultTitle) + titleSuffix}</title>
                    <meta name="keywords" content={this.props.keywords || defaultKeywords} />
                    <meta name="description" content={this.props.description || defaultDescription} />
                </Head>
            </div>
        )
    }
}
