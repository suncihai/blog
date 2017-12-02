import axios from 'axios'

import Index from './index'

import config from '../config/server'
import { getApi } from '../helpers'

export default class Essay extends Index {
    static async getInitialProps () {
        const { data } = await axios.get(getApi(`articles/${config.category.essay}`))
        return {
            path: '/essay',
            list: data.result
        }
    }
}
