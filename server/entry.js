const Koa = require('koa')
const path = require('path')
const next = require('next')
const bodyParser = require('koa-body')
const Router = require('koa-router')

const apis = require('./api')
const config = require('../config/server')

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

    // 首页
    router.get('/', async context => {
        const { req, res, query } = context
        await app.render(req, res, '/', query)
        context.respond = false
    })

    // 随笔
    router.get('/essay', async context => {
        const { req, res, query } = context
        await app.render(req, res, '/essay', query)
        context.respond = false
    })

    // 关于
    router.get('/about', async context => {
        const { req, res, query } = context
        await app.render(req, res, '/about', query)
        context.respond = false
    })

    // 文章内容
    router.get('/article/:name', async context => {
        const { req, res, params, query } = context
        await app.render(req, res, '/article', createMeta(params, query))
        context.respond = false
    })

    // 数据请求接口
    router.get('/api/:api/:id', async context => {
        const { res, params, query } = context
        const handler = apis[params.api]

        if (typeof handler === 'function') {
            const result = await handler(createMeta(params, query), res)
            context.body = JSON.stringify(result)
        } else {
            context.body = `API NOT SUPPORT: ${params.api}`
        }
        context.respond = true
    }).post('/api/comment/:id', async context => {
        const body = context.request.body
        const { req, res, params, ip } = context
        const result = await apis.comment(Object.assign(body, {
            ip: ip,
            id: params.id,
            ua: req.headers['user-agent']
        }), res, req.method)
        context.body = JSON.stringify(result)
        context.respond = true
    })

    // 其他静态资源辅助脚本等
    router.get('*', async context => {
        await defaultHandler(context.req, context.res)
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
