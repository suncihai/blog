const db = require('../db')

const getPostName = id => new Promise((resolve, reject) => {
    const connection = db.createConnection()
    const sql = [
        `SELECT post_name FROM wp_posts WHERE ID = ${connection.escape(id)}`,
        'AND post_status="publish"',
        'AND post_type="post" LIMIT 1'
    ].join(' ')

    connection.query(sql, (err, res) => {
        connection.end()

        if (err) {
            return reject(err)
        }

        const name = res && res[0] && res[0].post_name

        resolve({
            success: !!name,
            name: name
        })
    })
})

module.exports = ({ id }) => getPostName(id).catch(err => err)
