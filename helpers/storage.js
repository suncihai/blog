export default {
    set: function (noAuditComments) {
        localStorage.setItem('NO_AUDIT_COMMENTS', JSON.stringify(noAuditComments))
    },
    get: function () {
        return JSON.parse(localStorage.getItem('NO_AUDIT_COMMENTS') || '[]')
    }
}
