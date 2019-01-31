import axios from 'axios'

import Index from './index'

import { getApi } from '../helpers'
import config from '../config/server'
import { navMenus } from '../config/website'

export default class Essay extends Index {
    static async getInitialProps () {
        const path = '/essay'
        const menu = navMenus.find(nav => nav.path === path) || {}
        const { data } = await axios.get(getApi(`articles/${config.category.essay}`)).catch(err => err)
        return {
            path,
            title: menu.name,
            preface: menu.preface,
            list: data.result || []
        }
    }
}
