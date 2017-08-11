const cfg = require('../config')
const LruCache = require('lru-cache')

const hour = 1000 * 60 * 60
const cache = new LruCache({
    max: 100,
    maxAge: cfg.SSR_CACHE_MAX_AGE * hour
})

module.exports = function (nextjs, req, res, path, query) {
    let key = decodeURIComponent(req.url)

    if (cache.has(key)) {
        console.log(`----------------------------------- Server from cache: ${key}`)
        res.setHeader('Render-From', 'ssr-cache')
        res.end(cache.get(key))
        return
    }

    nextjs.renderToHTML(req, res, path, query).then(htmlString => {
        if (htmlString) {
            cache.set(key, htmlString)
        }
        res.setHeader('Render-From', 'ssr-first')
        res.end(htmlString)
        console.log(`----------------------------------- Stored into cache: ${key}`)
    }).catch(e => {
        nextjs.renderError(e, req, res, path, query)
    })
}
