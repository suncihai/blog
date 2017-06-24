import React from 'react'
import axios from 'axios'
import config from '../config'
import { getApi, errorCatch, createPostLink } from '../common'

import CommonHead from '../components/CommonHead'
import CommonFoot from '../components/CommonFoot'
import CommonAside from '../components/CommonAside'
import DocumentHead from '../components/DocumentHead'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'

const COPY = {
    TITLE: '给我留言',
    KEYWORDS: '留言板, 唐比昌',
    DESCRIPTION: '给唐比昌留言吧！',
    COMMENT_TYPE: '留言',
    PAGE_INFO: '无聊的、建议的、拍砖的、批评的、交换友链的…… 都在这说吧~'
}

const LTC = config.LATEST_TITLE_COUNT
const LCC = config.LATEST_COMMENT_COUNT
const CPI = config.CATEGORY.COMMENT_PAGE

export default class extends React.Component {

    static async getInitialProps () {
        let resTitle = await axios.get(getApi('titles?limit='+ LTC)).catch(errorCatch)
        let resComment = await axios.get(getApi('latestcomments?limit='+ LCC)).catch(errorCatch)
        return {
            hasTitle: true,
            titles: resTitle.data || [],
            comments: resComment.data || [],
        }
    }

    render () {
        const { brief, articles, hasTitle, titles, comments } = this.props

        return (
            <div className="blog center">
                <DocumentHead
                    title={ COPY.TITLE }
                    keywords={ COPY.KEYWORDS }
                    description={ COPY.DESCRIPTION }
                />

                <CommonHead active="message" />

                <div className="global-body center">
                    <div className="global-left">

                        <div className="pageins">{ COPY.PAGE_INFO }</div>

                         <CommentForm typeName={ COPY.COMMENT_TYPE } articleId={ CPI } />

                         <CommentList
                            toLoad={ true }
                            articleId={ CPI }
                            sortType={ -1 }
                            typeName={ COPY.COMMENT_TYPE }
                        />
                    </div>

                    <CommonAside hasTitle={ hasTitle } titles={ titles } comments={ comments } />
                </div>

                <CommonFoot />
            </div>
        )
    }
}
