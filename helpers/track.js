const categorys = {
    'nav.click': '头部·点击导航',
    'social.click': '头部·点击社交图标',
    'search.open': '头部·点开搜索按钮',
    'search.go.click': '头部·点击进行搜索',
    'search.go.enter': '头部·回车进行搜索',
    'search.cancel': '头部·点击空白取消搜索',
    'list.tp.shows': '列表·浮层提示次数',
    'source.click': '页脚·点击查看源代码',
    'icp.click': '页脚·点击备案号',
    'license.click': '内容·点击许可协议',
    'reset.click': '表单·点击重置按钮',
    'value.overlength': '表单·超出长度限制',
    'form.onsubmit': '表单·提交成功',
    'form.server.error': '表单·服务器错误',
}

/**
 * 用户交互埋点统计 http://open.cnzz.com/a/api/trackevent/
 * category (String) 表示事件发生在谁身上，如“视频”、“小说”、“轮显层”等等。
 * action (String) 表示访客跟元素交互的行为动作，如"播放"、"收藏"、"翻层"等等。
 */
const track = (category, action) => {
    try {
        category = categorys[category] || category
        action = category + '·' + (action || '*')
        window._czc.push(['_trackEvent', category, action])
    } catch (e) {
        throw e
    }
}

export default track
