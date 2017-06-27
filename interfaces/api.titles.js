let db = require('./db')
let common = require('./common')

function getTitleList (limit) {
    return new Promise(function (resolve, reject) {
        let LIMIT = common.isNumeric(limit) ? limit : 0
        let connection = db.createConnection()
        let QUERY_TITLES = 'SELECT ID, post_title, post_name FROM wp_posts ' +
                            'WHERE post_status=\'publish\' AND post_type=\'post\' ' +
                            'ORDER BY post_date DESC LIMIT ' + LIMIT

        connection.query(QUERY_TITLES, function (error, results) {
            connection.end()

            if (error) {
                reject(error)
                throw error
            }

            resolve(results)
        })
    })
}

module.exports = function (query) {
    return new Promise(function (resolve, reject) {
        getTitleList(+query.limit).then(function (result) {
            resolve(result)
        }).catch(function (err) {
            resolve(err)
        })
    })
}
