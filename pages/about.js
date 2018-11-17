import React from 'react'

import config from '../config/server'
import { introduce, declaration, navMenus } from '../config/website'

import HeadMeta from '../components/modules/HeadMeta'
import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import ComponentCommentList from '../components/modules/CommentList'
import ComponentCommentForm from '../components/modules/CommentForm'
import ComponentIcon from '../components/modules/Icon'
import { App, AppBody } from '../components/styled-global'
import {
    About,
    AboutDesc,
    AboutDeclaration,
    AboutMessage,
    AboutMessageSub,
    AboutMessageTitle
} from '../components/styled-pages/about'

const path = '/about'
const { name } = navMenus.find(nav => nav.path === path) || {}
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
                <HeadMeta title={name} />
                <App>
                    <ComponentHeader path={path} />
                    <AppBody>
                        <About>
                            <AboutDesc>{introduce}</AboutDesc>
                            <AboutDeclaration>
                                <strong>声明：</strong> {declaration}
                            </AboutDeclaration>
                            <AboutMessage>
                                <AboutMessageTitle>
                                    <ComponentIcon type="message" /> 留言板
                                </AboutMessageTitle>
                                <AboutMessageSub>无聊的、建议的、批评的、拍砖的、交流的…… 都在这说吧 ~</AboutMessageSub>
                            </AboutMessage>
                            <ComponentCommentForm type="留言" id={commentId} onAdded={this.onMessageAdded.bind(this)} />
                            <ComponentCommentList type="留言" id={commentId} reached={true} autoscroll={false}
                                onLoad={this.onLoad.bind(this)} ref="list" />
                        </About>
                    </AppBody>
                    <ComponentFooter visible={loaded} />
                </App>
            </div>
        )
    }
}
