const url = require('url')
const http = require('http')
const next = require('next')

const config = require('./config')
const apis = require('./interfaces')

const app = next({
    dev: process.env.NODE_ENV === 'development'
})
const defaultRender = app.getRequestHandler()


// For matching `/article/article-alias`
const handleArticleRoute = (req, res, pathname, parsedUrl) => {
    if (pathname[pathname.length - 1] !== '/') {
        pathname = pathname + '/'
    }

    let alias
    ; [ , , alias] = pathname.split(/^(\/article\/)(.*)\/$/)

    if (alias) {
        app.render(req, res, '/article', { alias })
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

const PORT = config.LISTEN_PORT

app.prepare().then(() => {
    http.createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        let parsedUrl = url.parse(req.url, true)
        let { pathname, query } = parsedUrl

        if (/^(\/article\/\w)/.test(pathname)) {
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
