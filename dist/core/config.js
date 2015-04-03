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
		copyright: 'Copyright ©2012-2014 TANGBC.COM',

		// 主页容器固定长度
		indexWidth: 1024,

		// 博客容器固定长度
		blogWidth: 1024,

		// 导航
		nav: [
			{'name': '首页', 'link': ''},
			{'name': '前端那些事', 'link': 'matters'},
			{'name': '零碎笔记墙', 'link': 'notes'},
			{'name': '心情日志', 'link': 'moods'}
		],

		// 语录集合
		quotations: [
			'Keep living, keep codeing ......',
			'The quieter you become, the more you are able to hear'
		],

		// 栏目title
		archiveTitle: {
			index: '小前端 - tangbc.com',
			matters: '前端那些事'
		},

		// 栏目hash对应的category数据库id(表wp_terms)
		cat: {
			matters: 1,
			notes: 23,
			moods: 24
		},

		// archive列表默认请求选项
		archiveOption: {
			catid: 1,
			page: 1,		// 请求第1页
			limit: 6,		// 每页显示文章数
			brief: 180,		// 文章摘要长度
			order: 'date'	// 按时间顺序排列
		},

		// article默认请求选项
		articleOption: {
			artid: 2
		},

		// 数据中心
		dataCenter: {
			// 处理文件目录
			listarchives : '/blog/sprint/api/listarchives/query.php',
			showarticle  : '/blog/sprint/api/showarticle/query.php',
			showcomment  : '/blog/sprint/api/showcomment/query.php',
			listtitle    : '/blog/sprint/api/listtitle/query.php'
		}
	}
	return CONFIG;
});