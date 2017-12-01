import React from 'react'
import axios from 'axios'
import ComponentTooltip from 'react-tooltip'

import config from '../config/server'
import { getApi, prettyDate } from '../helpers'

import DocumentHead from '../components/DocumentHead'
import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import ComponentIcon from '../components/modules/Icon'
import { App, AppBody } from '../components/styled-global'
import {
    List,
    ListItem,
    ArticleTitle,
    ArticleInfo,
    ArticleInfoItem,
    NoMoreBottom
} from '../components/styled-pages'

export default class extends React.Component {
    static async getInitialProps () {
        const { data } = await axios.get(getApi(`articles/${config.category.article}`))
        return {
            path: '/',
            list: data
        }
    }

    render () {
        const { path, list } = this.props

        return (
            <div>
                <DocumentHead />
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
                        <NoMoreBottom><ComponentIcon type="over" /> 加载完毕，没有更多了~</NoMoreBottom>
                    </AppBody>
                    <ComponentFooter visible={true} />
                    <ComponentTooltip place="bottom" className="tooltip" delayShow={100} />
                </App>
            </div>
        )
    }
}
