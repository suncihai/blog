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
