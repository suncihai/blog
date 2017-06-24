import config from '../config'

export const getApi = path => {
    return `http://localhost:${config.LISTEN_PORT}/api/${path}`
}

export const errorCatch = err => {
    return err.response ? err.response.status + ' ' + err.response.statusText : JSON.stringify(err)
}

export const createPostLink = post_name => {
    return `/article/${post_name}`
}

export const rewritePreClass = post => {
    return post.replace(/<pre class=[\"](.*?)[\"]>/g, function (match) {
        let oldClass = match.replace(/<pre class=[\"]|[\"]>/g, '')
        let newClass = oldClass.split(';')[0].replace(/brush:\s/, '')
        return '<pre class="'+ newClass +'">'
    })
}

export const prettyDate = dateString => {
    let date = new Date()
    let dateArr = dateString.split(new RegExp('[:| |-]', 'ig'))
    let year = +dateArr[0],
        month = +dateArr[1] - 1,
        day = +dateArr[2],
        hour = +dateArr[3],
        minute = +dateArr[4],
        second = +dateArr[5]

    hour = hour < 10 ? '0' + hour : hour
    minute = minute < 10 ? '0' + minute : minute

    let opDate = new Date(year, month, day , hour, minute, second)
    let secondDiff = (new Date().getTime() - opDate.getTime()) / 1000

    let pretty = ''
    if (secondDiff < 60) {
        pretty = '刚刚'
    }
    if (!pretty && secondDiff < 60 * 30) {
        pretty = Math.ceil(secondDiff / 60) + ' 分钟前'
    }
    if (!pretty && secondDiff < 1800) {
        pretty= '半小时前'
    }
    if (!pretty && secondDiff < 3600) {
        pretty= '1 小时前'
    }
    if (!pretty && secondDiff < 3600 * 2) {
        pretty= '2 小时前'
    }
    if (!pretty && secondDiff < 3600 * 3) {
        pretty= '3 小时前'
    }
    if (!pretty && date.getFullYear() == year && date.getMonth() == month && date.getDate() == day) {
        pretty = '今天 ' + hour + ':' + minute
    }
    if (!pretty && date.getFullYear() == year && date.getMonth() == month && date.getDate() - 1 == day) {
        pretty = '昨天 ' + hour + ':' + minute
    }
    if (!pretty && date.getFullYear() == year && date.getMonth() == month && date.getDate() - 2 == day) {
        pretty = '前天 ' + hour + ':' + minute
    }
    if (!pretty && date.getFullYear() == year && date.getMonth() == month) {
        pretty = (month + 1) +' 月 ' + day + ' 日'
    }
    if (!pretty && date.getFullYear() == year) {
        pretty = '今年 '+ month + 1 + ' 月' + day + ' 日'
    }
    if (!pretty && date.getFullYear() - 1 == year) {
        pretty = '去年 '+ (month + 1) + ' 月' + day + ' 日'
    }
    if (!pretty && date.getFullYear() - year > 1) {
        pretty = year + ' 年 ' + (month + 1) + ' 月 ' + day + ' 日'
    }

    return pretty
}
