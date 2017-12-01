const mysql = require('mysql')
const config = require('../../config/server')

const isDev = process.env.NODE_ENV !== 'production'
let mysqlConfig = isDev ? require('./db.dev.json') : require('./db.pro.json')

if (isDev) {
    mysqlConfig.socketPath = config.socketPath
}

function createPool () {
    return mysql.createPool(mysqlConfig)
}

function createConnection () {
    return mysql.createConnection(mysqlConfig)
}

module.exports = { createPool, createConnection }
