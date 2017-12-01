import React from 'react'

import config from '../config/server'
import { introduce } from '../config/website'

import DocumentHead from '../components/DocumentHead'
import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import ComponentCommentList from '../components/modules/CommentList'
import ComponentCommentForm from '../components/modules/CommentForm'
import ComponentIcon from '../components/modules/Icon'
import { App, AppBody } from '../components/styled-global'
import {
    About,
    AboutDesc,
    AboutMessage,
    AboutMessageSub,
    AboutMessageTitle
} from '../components/styled-pages/about'

const commentId = config.category.comment

export default class extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            loaded: false
        }
    }

    onMessageAdded (newMessage) {
        if (this.refs.list) {
            this.refs.list.addUnAudit(newMessage)
        }
    }

    onLoad () {
        this.setState({
            loaded: true
        })
    }

    render () {
        const { loaded } = this.state

        return (
            <div>
                <DocumentHead title="关于我" />
                <App>
                    <ComponentHeader path="/about" />
                    <AppBody>
                        <About>
                            <AboutDesc>{introduce}</AboutDesc>
                        </About>
                        <AboutMessage>
                            <AboutMessageTitle>
                                <ComponentIcon type="message" /> 留言板
                            </AboutMessageTitle>
                            <AboutMessageSub>无聊的、建议的、批评的、拍砖的、交流的…… 都在这说吧 ~</AboutMessageSub>
                        </AboutMessage>
                        <ComponentCommentForm type="留言" id={commentId} onAdded={this.onMessageAdded.bind(this)} />
                        <ComponentCommentList type="留言" id={commentId} reached={true}
                            onLoad={this.onLoad.bind(this)} ref="list" />
                    </AppBody>
                    <ComponentFooter visible={loaded} />
                </App>
            </div>
        )
    }
}
