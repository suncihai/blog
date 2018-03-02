const Koa = require('koa')
const path = require('path')
const next = require('next')
const bodyParser = require('koa-body')
const Router = require('koa-router')

const apis = require('./api')
const config = require('../config/server')
const ssrcache = require('./ssrcache')
const { cacheMaxage, topPaths } = config

const app = next({
    dir: path.resolve(__dirname, '../'),
    dev: process.env.NODE_ENV === 'development'
})
const defaultHandler = app.getRequestHandler()

const createMeta = (params, query) => {
    let meta = Object.assign({}, params, query)
    Object.keys(meta).forEach(key => {
        meta[key] = encodeURIComponent(meta[key])
    })
    return meta
}

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.proxy = true
    server.use(bodyParser())

    // 文章内容
    router.get('/article/:name', async context => {
        const path = '/article'
        const { req, res, params, query } = context
        const meta = createMeta(params, query)
        if (cacheMaxage) {
            ssrcache(app, req, res, path, meta)
        } else {
            await app.render(req, res, path, meta)
        }
        context.respond = false
    })

    // 搜索
    router.get('/search/:word', async context => {
        const { req, res, params, query } = context
        await app.render(req, res, '/search', createMeta(params, query))
        context.respond = false
    })

    // 数据请求接口
    router.get('/api/:api/:id', async context => {
        const { res, params, query } = context
        const handler = apis[params.api]

        if (typeof handler === 'function') {
            const result = await handler(createMeta(params, query), res)
            context.body = result
        } else {
            context.body = `API NOT SUPPORT: ${params.api}`
        }
        context.respond = true
    })

    // 添加评论
    router.post('/api/comment/:id', async context => {
        const body = context.request.body
        const { req, res, params, ip } = context
        const result = await apis.comment(Object.assign(body, {
            ip: ip,
            id: params.id,
            ua: req.headers['user-agent']
        }), res, req.method)
        context.body = result
        context.respond = true
    })

    // index, essay, about 以及其他资源脚本
    router.get('*', async context => {
        const { req, res, params, query } = context
        let { path } = context.request
        const length = path.length

        if (path[length - 1] === '/') {
            path = path.substr(0, length - 1)
        }

        if (~topPaths.indexOf(path)) {
            if (cacheMaxage) {
                ssrcache(app, req, res, path)
            } else {
                await app.render(req, res, path, createMeta(params, query))
            }
        } else {
            await defaultHandler(req, res)
        }
        context.respond = false
    })

    server.use(async (context, next) => {
        context.res.statusCode = 200
        await next()
    })

    server.use(router.routes())
    server.listen(config.port, err => {
        if (err) {
            throw err
        }
        console.log(`> Ready on ${config.host}`)
    })
})
