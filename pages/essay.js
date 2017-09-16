import Index from './index'
import axios from 'axios'
import config from '../config'
import { getApi } from '../common'

export default class EssayList extends Index {

    static async getInitialProps () {
        let res = {}

        try {
            res = await axios.get(getApi('articles?category_id='+ config.CATEGORY.ESSAY))
        } catch (e) {}

        return {
            brief: '心情随笔，与技术无关',
            title: '我的随笔',
            active: '/essay',
            hasTitle: true,
            articles: res.data || []
        }
    }
}
