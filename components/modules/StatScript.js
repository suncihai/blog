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

    window.addEventListener('error', err => {
        try {
            const { message, filename } = err
            const detail = `[${message}] in ${filename}`
            window._czc.push(['_trackEvent', '代码报错统计', navigator.userAgent, detail])
        } catch (e) {}
    })

    window.addEventListener('load', () => {
        const performance = window.performance || window.webkitPerformance
        if (!performance || !performance.timing || !window._czc) {
            return
        }

        const timing = performance.timing
        const ttfb = timing.responseStart - timing.requestStart
        const domLoad = timing.domComplete - timing.domLoading
        const interactive = +new Date() - timing.requestStart

        window._czc.push('perf.ttfb', ttfb)
        window._czc.push('perf.domload', domLoad)
        window._czc.push('perf.interactive', interactive)

        const logInfo = (info) => console.log('%c' + info, 'color: blue; font-size: 16px; font-weight: bold;')

        logInfo(`TTFB: ${ttfb} 毫秒`)
        logInfo(`DOM 加载: ${domLoad} 毫秒`)
        logInfo(`可交互时间: ${interactive} 毫秒`)
    })
}

export default () => (
    <script dangerouslySetInnerHTML={{ __html: `(${installStat.toString()})();` }}></script>
)
