import Index from './index'
import axios from 'axios'
import config from '../config'
import monitor from '../monitor'
import { getApi, errorCatch } from '../common'

const COPY = {
    TITLE: '我的随笔',
    TEXT: '心情随笔，与技术无关'
}

const CID = config.CATEGORY.ESSAY

export default class EssayList extends Index {

    static async getInitialProps ({ req }) {
        monitor.start('fetch data in essay')

        let resArticle = await axios.get(getApi('articles?category_id='+ CID)).catch(errorCatch)

        monitor.enddd('fetch data in essay')

        return {
            brief: COPY.TEXT,
            title: COPY.TITLE,
            navActive: 'essay',

            hasTitle: true,
            articles: resArticle.data || []
        }
    }

    componentDidMount () {}
}
