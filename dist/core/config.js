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
			'Keep living, keep codeing ......',
			'The quieter you become, the more you are able to think'
		],

		// 栏目title
		archiveTitle: {
			'index': '小前端 - tangbc.com',
			'frontends': '前端那些事'
		},

		// 栏目默认请求参数
		archiveParam: {
			'catid' : 1,  // 分类ID
			'page'  : 1,  // 请求第1页
			'limit' : 6,  // 每页显示数
			'brief' : 180 // 摘要长度
		},

		// 栏目hash对应的category数据库id(表wp_terms)
		cat: {
			'frontends': 1,
			'moods': 24
		},

		// 数据中心
		dataCenter: {
			// 处理文件目录
			'listarchives' : '/blog/sprint/api/listarchives/query.php',
			'showarticle'  : '/blog/sprint/api/showarticle/query.php',
			'showcomment'  : '/blog/sprint/api/showcomment/query.php',
			'listtitle'    : '/blog/sprint/api/listtitle/query.php'
		}
	}
	return CONFIG;
});