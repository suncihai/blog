import React from 'react'
import axios from 'axios'

import { getApi } from '../helpers'

import DocumentHead from '../components/DocumentHead'
import ComponentHeader from '../components/modules/Header'
import ComponentFooter from '../components/modules/Footer'
import ComponentIcon from '../components/modules/Icon'
import { App, AppBody } from '../components/styled-global'
import {
    Header,
    List,
    ListEmpty,
    ListHeader,
    ListBody,
    ListItem,
    ListItemTitle,
    ListItemContent
} from '../components/styled-pages/search'
import track from '../helpers/track'

const division = '<span class="division">···</span>'
const ComponentList = props => props.results.map(result => (
    <ListItem key={result.id}>
        <ListItemTitle>
            <a href={`/article/${result.name}`}
                onClick={() => track('search.result.click', result.title)}
                dangerouslySetInnerHTML={{ __html: result.title }} />
        </ListItemTitle>
        {!result.mcontent ? null
            : <ListItemContent
                dangerouslySetInnerHTML={{ __html: result.content.join(division) }} />
        }
    </ListItem>
))

export default class extends React.Component {
    static async getInitialProps ({ query }) {
        const { word } = query
        const { data } = await axios.get(getApi(`search/${word}`))
        return {
            message: data.message,
            results: data.result || [],
            word: decodeURIComponent(word)
        }
    }

    getHits () {
        let hits = 0
        const { results } = this.props
        results.forEach(result => {
            const { mtitle, mcontent } = result
            if (mtitle) {
                hits++
            }
            if (mcontent) {
                hits += result.content.length
            }
        })
        return hits
    }

    render () {
        const { word, results, message } = this.props

        return (
            <div>
                <DocumentHead title={`搜索：${word}`} />
                <App>
                    <ComponentHeader />
                    <AppBody>
                        <Header>{`搜索『${word}』的结果：`}</Header>
                        {!results.length
                            ? <ListEmpty>
                                <ComponentIcon type="nodata" /> {message || '没有找到相关内容'}
                            </ListEmpty>
                            : <List>
                                <ListHeader>
                                    {`共找到 ${results.length} 篇相关文章，命中 ${this.getHits()} 个匹配结果`}
                                </ListHeader>
                                <ListBody>
                                    <ComponentList results={results} />
                                </ListBody>
                            </List>}
                    </AppBody>
                    <ComponentFooter visible={true} />
                </App>
            </div>
        )
    }
}
