// 安装统计脚本
const installStat = () => {
    document.addEventListener('DOMContentLoaded', () => {
        let s = document.createElement('script')
        s.src = 'https://s19.cnzz.com/z_stat.php?id=5606127&web_id=5606127'
        s.onload = () => {
            try {
                let events = window._events
                let untracks = events.length
                while (untracks--) {
                    events.shift()()
                }
            } catch (e) {}
        }
        document.body.appendChild(s)
    })
}

export default () => (
    <script dangerouslySetInnerHTML={{ __html: `(${installStat.toString()})();` }}></script>
)
