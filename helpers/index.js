import config from '../config/server'

export const getApi = (path, host) => `${host || config.host}/api/${path}`

export const getLineNumber = html => {
    let lines = ''
    let splits = html.split(/\r\n|\r|\n/g)
    let div = document.createElement('div')

    if (!splits[splits.length - 1]) {
        splits.pop()
    }

    splits.forEach((line, index) => {
        lines += `<div style="height:{pr}%;">${index + 1}</div>`
    })

    div.className = 'line-nubmer'
    div.innerHTML = `<div class="line-number-box">${lines.replace(/{pr}/g, 1 / splits.length * 100)}</div>`
    return div
}
