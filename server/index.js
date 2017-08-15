const url = require('url')
const http = require('http')
const path = require('path')
const next = require('next')

const apis = require('./api')
const cfg = require('../config')
const ssrCache = require('./ssrcache')

// Nextjs core instance.
const app = next({
    dir: path.resolve(__dirname, '../'),
    dev: process.env.NODE_ENV === 'development'
})

const defaultRender = app.getRequestHandler()

// Current response will provide from cache or new render.
const renderOrFromCache = (req, res, path, query) => {
    if (cfg.SSR_CACHE) {
        ssrCache(app, req, res, path, query)
    } else {
        app.render(req, res, path, query)
    }
}

const PORT = cfg.LISTEN_PORT
const CACHE_PAGES = cfg.SSR_CACHE_PAGES

app.prepare().then(() => {
    http.createServer(async (req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        let parsedUrl = url.parse(req.url, true)
        let { pathname, query } = parsedUrl

        // Route top navigator pages.
        if (CACHE_PAGES.indexOf(pathname) > -1) {
            renderOrFromCache(req, res, pathname)
            return
        }

        // Route article page, for matching `/article/article-alias`.
        if (/^(\/article\/)/.test(pathname)) {
            // @todo: handle in Nginx.
            if (pathname[pathname.length - 1] !== '/') {
                pathname = pathname + '/'
            }

            let alias
            ; [ , , alias] = pathname.split(/^(\/article\/)(.*)\/$/)

            if (alias) {
                alias = encodeURIComponent(alias)
                renderOrFromCache(req, res, '/article', { alias })
            } else {
                defaultRender(req, res, parsedUrl)
            }

            return
        }

        // Route backend data api, for matching `/api/xxx`.
        if (/^(\/api\/\w)/.test(pathname)) {
            let api
            ; [ , , api] = pathname.split(/^(\/api\/)/)

            let apiHandler = apis[api]
            if (typeof apiHandler === 'function') {
                let result = await apiHandler(query, req)
                res.end(JSON.stringify(result))
            }

            return
        }

        // Route otherwise, such as error page, static file etc.
        defaultRender(req, res, parsedUrl)

    }).listen(PORT, (err) => {
        if (err) {
            throw err
        }
        console.log('> Ready on http://localhost:' + PORT)
    })
})
