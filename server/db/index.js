let mysql = require('mysql')

let config = require('../../config')
let DEV_DB = require('./development.json')

let isDev = process.env.NODE_ENV !== 'production'

if (isDev) {
    DEV_DB.socketPath = config.MYSQL_SOCKET_PATH
}

let CONFIG = isDev ? DEV_DB : require('./db-product.json')

function createPool () {
    return mysql.createPool(CONFIG)
}

function createConnection () {
    return mysql.createConnection(CONFIG)
}

module.exports = { createPool, createConnection }
