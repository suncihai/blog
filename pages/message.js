import React from 'react'
import axios from 'axios'
import config from '../config'
import { getApi } from '../common'

import CommonHead from '../components/CommonHead'
import CommonBrief from '../components/CommonBrief'
import CommonFoot from '../components/CommonFoot'
import CommonAside from '../components/CommonAside'
import DocumentHead from '../components/DocumentHead'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'

const CPI = config.CATEGORY.COMMENT_PAGE

export default class extends React.Component {

    static getInitialProps () {
        return {
            hasTitle: true
        }
    }

    render () {
        const { brief, hasTitle, titles } = this.props

        return (
            <div className="blog center">
                <DocumentHead
                    title="给我留言"
                    keywords="留言板, 唐比昌"
                    description="给唐比昌留言吧！"
                />

                <CommonHead active="/message" />

                <div className="global-body center">
                    <div className="global-left">

                        <CommonBrief>无聊的、建议的、拍砖的、批评的、交换友链的…… 都在这说吧~</CommonBrief>

                         <CommentForm typeName="留言" articleId={ CPI } />

                         <CommentList
                            toLoad={ true }
                            articleId={ CPI }
                            sortType={ -1 }
                            typeName="留言"
                        />
                    </div>

                    <CommonAside hasTitle={ hasTitle } />
                </div>

                <CommonFoot />
            </div>
        )
    }
}
