const LruCache = require('lru-cache')
const { cacheMaxage } = require('../config/server')

const minute = 1000 * 60
const cache = new LruCache({
    max: 100,
    maxAge: cacheMaxage * minute
})

module.exports = (app, req, res, path, meta) => {
    const url = decodeURIComponent(req.url)

    if (cache.has(url)) {
        res.setHeader('Render-From', 'ssr-cache')
        res.end(cache.get(url))
        return
    }

    app.renderToHTML(req, res, path, meta).then(output => {
        if (output) {
            cache.set(url, output)
        }

        res.setHeader('Render-From', 'ssr')
        res.end(output)
    }).catch(err => app.renderError(err, req, res, path, meta))
}
