import config from '../config'

export const getApi = path => {
    return `${config.HOST}/api/${path}`
}

export const errorCatch = err => {
    return err.response ? err.response.status + ' ' + err.response.statusText : err.message
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

    if (secondDiff < 60) {
        return '刚刚'
    }
    if (secondDiff < 60 * 30) {
        return Math.ceil(secondDiff / 60) + ' 分钟前'
    }
    if (secondDiff < 1800) {
        return '半小时前'
    }
    if (secondDiff < 3600) {
        return '1 小时前'
    }
    if (secondDiff < 3600 * 2) {
        return '2 小时前'
    }
    if (secondDiff < 3600 * 3) {
        return '3 小时前'
    }
    if (date.getFullYear() == year && date.getMonth() == month && date.getDate() == day) {
        return '今天 ' + hour + ':' + minute
    }
    if (date.getFullYear() == year && date.getMonth() == month && date.getDate() - 1 == day) {
        return '昨天 ' + hour + ':' + minute
    }
    if (date.getFullYear() == year && date.getMonth() == month && date.getDate() - 2 == day) {
        return '前天 ' + hour + ':' + minute
    }
    if (date.getFullYear() == year && date.getMonth() == month) {
        return (month + 1) +' 月 ' + day + ' 日'
    }
    if (date.getFullYear() == year) {
        return '今年 ' + (month + 1) + ' 月 ' + day + ' 日'
    }
    if (date.getFullYear() - 1 == year) {
        return '去年 '+ (month + 1) + ' 月 ' + day + ' 日'
    }

    return year + ' 年 ' + (month + 1) + ' 月 ' + day + ' 日'
}
