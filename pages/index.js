import React from 'react'
import axios from 'axios'
import ComponentTooltip from 'react-tooltip'

import config from '../config/server'
import { navMenus } from '../config/website'
import { getApi, prettyDate } from '../helpers'

import HeadMeta from '../components/modules/HeadMeta'
import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import ComponentIcon from '../components/modules/Icon'
import ComponentNoMore from '../components/modules/NoMore'
import { App, AppBody } from '../components/styled-global'
import {
    List,
    ListItem,
    ArticleTitle,
    ArticleInfo,
    ArticleInfoItem
} from '../components/styled-pages/index'
import track from '../helpers/track'

export default class extends React.Component {
    static async getInitialProps () {
        const path = '/'
        const { name } = navMenus.find(nav => nav.path === path) || {}
        const { data } = await axios.get(getApi(`articles/${config.category.article}`)).catch(err => err)
        return {
            path,
            title: name,
            list: data.result || []
        }
    }

    render () {
        const { path, title, list } = this.props

        return (
            <div>
                <HeadMeta title={title} />
                <App>
                    <ComponentHeader path={path} />
                    <AppBody>
                        <List>{list.map(article => (
                            <ListItem key={article.id}>
                                <ArticleTitle>
                                    <a href={`/article/${article.name}`}>{article.title}</a>
                                </ArticleTitle>
                                <ArticleInfo>
                                    <ArticleInfoItem data-tip="发布时间">
                                        <ComponentIcon type="date" />
                                        {prettyDate(article.date)}
                                    </ArticleInfoItem>
                                    {article.comments ? <ArticleInfoItem data-tip="评论数">
                                        <ComponentIcon type="comment" />
                                        {article.comments}
                                    </ArticleInfoItem> : null}
                                    {article.thumbnails ? <ArticleInfoItem data-tip="插图数">
                                        <ComponentIcon type="picture" />
                                        {article.thumbnails}
                                    </ArticleInfoItem> : null}
                                    {article.codes ? <ArticleInfoItem data-tip="代码片段数">
                                        <ComponentIcon type="code" />
                                        {article.codes}
                                    </ArticleInfoItem> : null}
                                    <ArticleInfoItem data-tip="估计阅读时间">
                                        <ComponentIcon type="read" />
                                        {article.minutes} ′
                                    </ArticleInfoItem>
                                </ArticleInfo>
                            </ListItem>
                        ))}</List>
                        <ComponentNoMore />
                    </AppBody>
                    <ComponentFooter visible={true} />
                    <ComponentTooltip place="bottom" className="tooltip" delayShow={100}
                        afterShow={() => track('list.tp.shows')} />
                </App>
            </div>
        )
    }
}
