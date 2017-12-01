/**
 * 转化数据库字段，不能暴露全部的数据
 */
const map = {
    ID: 'id',
    post_title: 'title',
    post_name: 'name',
    post_date: 'date',
    comment_count: 'comments'
}

const mapKeys = Object.keys(map)

module.exports = (row, extra) => {
    let data = {}

    mapKeys.forEach(originKey => {
        const value = row[originKey]
        if (typeof value !== 'undefined') {
            data[map[originKey]] = value
        }
    })

    return Object.assign(data, extra)
}
