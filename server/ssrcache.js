const LruCache = require('lru-cache')
const { cacheMaxage } = require('../config/server')

const hour = 1000 * 60 * 60
const cache = new LruCache({
    max: 100,
    maxAge: cacheMaxage * hour
})

module.exports = (app, req, res, path, meta) => {
    const url = decodeURIComponent(req.url)

    if (cache.has(url)) {
        console.log(`Server from cache: ${url}`)
        res.setHeader('Render-From', 'ssr-cache')
        res.end(cache.get(url))
        return
    }

    app.renderToHTML(req, res, path, meta).then(output => {
        if (output) {
            cache.set(url, output)
            console.log(`Stored into cache: ${url}`)
            console.log(`Current of caches: ${cache.keys().length}`)
        }

        res.setHeader('Render-From', 'ssr-fresh')
        res.end(output)
    }).catch(err => app.renderError(err, req, res, path, meta))
}
