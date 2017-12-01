const LruCache = require('lru-cache')
const config = require('../../config/server')

const hour = 1000 * 60 * 60
const cache = new LruCache({
    max: 100,
    maxAge: config.ssrCache * hour
})

module.exports = function (app, req, res, path, query) {
    let uri = decodeURIComponent(req.url)

    if (cache.has(uri)) {
        console.log(`Server from cache: ${uri}`)
        res.setHeader('Render-From', 'ssr-cache')
        res.end(cache.get(uri))
        return
    }

    app.renderToHTML(req, res, path, query).then(renderString => {
        if (renderString) {
            cache.set(uri, renderString)
            console.log(`Stored into cache: ${uri}`)
            console.log(`Current of caches: ${cache.keys().length}`)
        }

        res.setHeader('Render-From', 'ssr-first')
        res.end(renderString)
    }).catch(err => {
        app.renderError(err, req, res, path, query)
    })
}
