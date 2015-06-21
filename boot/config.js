/**
 * [系统配置信息]
 */
define(function() {
	var CONFIG = {

		// 默认页面
		defaultPage: 'frontends',

		// 默认控制器目录
		controllerPath: '@controller/',

		// 控制器的调用方法
		action: 'onRun',

		// 页脚文字
		copyright: 'Copyright ©2012-2015 TANGBC.COM',

		// 导航
		nav: [
			{'name': '首页', 'link': '#index'},
			{'name': '前端那些事', 'link': '#frontends'},
			{'name': '随便写写', 'link': '#moods'},
			{'name': '给我留言', 'link': '#message'}
		],

		// 语录集合
		quotations: [
			"Keep living, keep codeing ......",
			"Do all you can to be a better man",
			"To be or not to be, that is a question",
			"Stay hungry Stay foolish"
		],

		// 栏目title
		archiveTitle: {
			'index': '小前端 - tangbc.com',
			'frontends': '前端那些事',
			'moods': '随便写写',
			'message': '给我留言'
		},

		// 栏目默认请求参数
		archiveParam: {
			'catid' : 1,  // 分类ID
			'page'  : 1,  // 请求第1页
			'limit' : 6,  // 每页显示数
			'brief' : 180 // 摘要长度
		},

		// 评论列表默认请求参数
		commentParam: {
			// 'artid' : 1, // 文章ID
			'page'  : 1, // 请求第一页
			'limit' : 6, // 每页显示个数
			'date'  : 1  // 时间升序, -1降序
		},

		// 栏目hash对应的category数据库id
		cat: {
			'frontends': 1,
			'moods': 24
		},

		// 数据接口
		dataCenter: {
			// 搜索
			'search'       : '/blog/sprint/api/search/query.php',
			// 获取标题列表
			'listtitle'    : '/blog/sprint/api/listtitle/query.php',
			// 获取评论列表
			'listcomment'  : '/blog/sprint/api/listcomment/query.php',
			// 添加一条评论
			'addcomment'   : '/blog/sprint/api/addcomment/query.php',
			// 获取留言列表
			'listmessage'  : '/blog/sprint/api/listmessage/query.php',
			// 添加一条留言
			'addmessage'   : '/blog/sprint/api/addmessage/query.php',
			// 验证码校验
			'verifycode'   : '/blog/sprint/api/verifycode/query.php',
			// 获取验证码
			'getthecode'   : '/blog/sprint/api/getthecode/query.php',
			// 获取一篇博客
			'showarticle'  : '/blog/sprint/api/showarticle/query.php',
			// 获取博客列表
			'listarchives' : '/blog/sprint/api/listarchives/query.php'
		},

		// 动画结束事件
		animationdEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',

		// 延迟展示(毫秒)
		delay: 388
	}
	return CONFIG;
});