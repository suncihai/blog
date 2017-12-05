const flag = 'NO_AUDIT_COMMENTS'

export default {
    set (noAuditComments) {
        localStorage.setItem(flag, JSON.stringify(noAuditComments))
    },

    get () {
        return JSON.parse(localStorage.getItem(flag) || '[]')
    }
}
