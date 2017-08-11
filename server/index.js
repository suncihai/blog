const url = require('url')
const http = require('http')
const next = require('next')
const path = require('path')

const cfg = require('../config')
const apis = require('../interfaces')
const ssrCache = require('./ssrcache')

const app = next({
    dir: path.resolve(__dirname, '../'),
    dev: process.env.NODE_ENV === 'development'
})
const defaultRender = app.getRequestHandler()

// Decide get from cache or re-render page.
const renderOrFromCache = (req, res, path, query) => {
    if (cfg.SSR_CACHE_MAX_AGE) {
        ssrCache(app, req, res, path, query)
    } else {
        app.render(req, res, path, query)
    }
}

// For matching `/article/article-alias`.
const handleArticleRoute = (req, res, pathname, parsedUrl) => {
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
}

// For matching /api/xxx
const handleApiRoute = async (req, res, pathname, query) => {
    let api
    ; [ , , api] = pathname.split(/^(\/api\/)/)

    let apiHandler = apis[api]
    if (typeof apiHandler === 'function') {
        let result = await apiHandler(query, req)
        res.end(JSON.stringify(result))
    }
}

const PORT = cfg.LISTEN_PORT
const CACHE_PAGES = cfg.SSR_CACHE_PAGES

app.prepare().then(() => {
    http.createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        let parsedUrl = url.parse(req.url, true)
        let { pathname, query } = parsedUrl

        if (CACHE_PAGES.indexOf(pathname) > -1) {
            renderOrFromCache(req, res, pathname)
        } else if (/^(\/article\/)/.test(pathname)) {
            handleArticleRoute(req, res, pathname, parsedUrl)
        } else if (/^(\/api\/\w)/.test(pathname)) {
            handleApiRoute(req, res, pathname, query)
        } else {
            defaultRender(req, res, parsedUrl)
        }
    }).listen(PORT, (err) => {
        if (err) {
            throw err
        }
        console.log('> Ready on http://localhost:' + PORT)
    })
})
