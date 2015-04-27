/**
 * [系统配置信息]
 */
define(function( require, exports ) {
	var CONFIG = {

		// 默认页面
		defaultPage: 'index',

		// 控制器的调用方法
		action: 'onRun',

		// 页脚文字
		copyright: 'Copyright ©2012-2015 TANGBC.COM',

		// 导航
		nav: [
			{'name': '首页', 'link': ''},
			{'name': '前端那些事', 'link': '#frontends'},
			{'name': '心情日志', 'link': '#moods'}
			// {'name': '2015旅游攻略', 'link': '#travelGuide'}
		],

		// 语录集合
		quotations: [
			"Keep living, keep codeing ......",
			"Do all you can to be a better man",
			"To be or not to be, that is a question"
		],

		// 栏目title
		archiveTitle: {
			'index': '小前端 - tangbc.com',
			'frontends': '前端那些事',
			'moods': '心情日志'
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
			'artid' : 1, // 文章ID
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
			// 处理文件目录
			'search'       : '/blog/sprint/api/search/query.php',
			'listtitle'    : '/blog/sprint/api/listtitle/query.php',
			'listcomment'  : '/blog/sprint/api/listcomment/query.php',
			'showarticle'  : '/blog/sprint/api/showarticle/query.php',
			'listarchives' : '/blog/sprint/api/listarchives/query.php'
		},

		// 动画结束事件
		animationdEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',

		// 延迟展示(毫秒)
		delay: 388
	}
	return CONFIG;
});