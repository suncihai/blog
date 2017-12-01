import React from 'react'

import DocumentHead from '../components/DocumentHead'
import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import { App, AppBody } from '../components/styled-global'

export default class extends React.Component {
    static async getInitialProps ({ query }) {
        const { word } = query
        return {
            word: decodeURIComponent(word)
        }
    }

    render () {
        const { word } = this.props

        return (
            <div>
                <DocumentHead title={`搜索：${word}`} />
                <App>
                    <ComponentHeader />
                    <AppBody>
                    </AppBody>
                    <ComponentFooter visible={true} />
                </App>
            </div>
        )
    }
}
