const categorys = {
    'nav.click': '头部·点击导航',
    'social.click': '头部·点击社交图标',
    'search.open': '头部·点开搜索按钮',
    'search.go.click': '头部·点击进行搜索',
    'search.go.enter': '头部·回车进行搜索',
    'search.cancel': '头部·点击空白取消搜索',
    'search.result.click': '搜索·点击搜索结果',
    'list.tp.shows': '列表·浮层提示显示次数',
    'source.click': '页脚·点击查看源代码',
    'icp.click': '页脚·点击备案号',
    'license.click': '内容·点击许可协议',
    'reset.click': '表单·点击重置按钮',
    'value.overlength': '表单·超出长度限制',
    'value.urlerror': '表单·网址格式错误',
    'form.onsubmit': '表单·提交成功',
    'form.server.error': '表单·服务器错误',
    'error.old': '错误·来自旧数字地址',
    'error.jump': '错误·成功跳转到新地址',
    'error.unjump': '错误·跳转到新地址失败',
    'error.other': '错误·其他错误',
    'error.try': '错误·点击刷新重试',
    'error.backhome': '错误·点击回首页',
    'resume.print': '简历·PC端点击打印',
    'resume.m.print': '简历·Mobile端点击打印',
    'resume.download': '简历·点击下载PDF'
}

/**
 * category (String), action (String)
 * 用户交互埋点统计 http://open.cnzz.com/a/api/trackevent/
 */
const track = (category, action) => {
    category = categorys[category] || category
    action = category + '·' + (action || '*')
    const event = ['_trackEvent', category, action]

    try {
        if (!window._czc) {
            window._events = (window._events || [])
            window._events.push(() => window._czc.push(event))
        } else {
            window._czc.push(event)
        }
    } catch (e) {}
}

export default track
