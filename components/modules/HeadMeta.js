import React from 'react'
import Head from 'next/head'

import {
    titleSuffix,
    defaultKeywords,
    defaultDescription
} from '../../config/website'

export default class HeadMeta extends React.Component {
    render () {
        const title = this.props.title ? `${this.props.title} - ` : ''
        return (
            <Head>
                <title>{title + titleSuffix}</title>
                <meta name="keywords" content={this.props.keywords || defaultKeywords} />
                <meta name="description" content={this.props.description || defaultDescription} />
            </Head>
        )
    }
}
