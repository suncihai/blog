/**
 * [系统配置信息]
 */
define(function( require, exports ) {
	var CONFIG = {

		// 默认页面
		defaultPage: 'index',

		// 控制器的调用方法
		action: 'onRun',

		//Logo
		logo: {
			alt: '小前端-前端那些事~',
			src: 'resources/images/logo.png'
		},

		// 页脚文字
		copyright: 'Copyright ©2012-2014 TANGBC.COM',

		// 统计代码
		stat: '',

		// 主页容器固定长度
		indexWidth: 1024,

		// 博客容器固定长度
		blogWidth: 1024,

		// 导航
		nav: [
			{'name': '首页', 'link': 'index'},
			{'name': '前端那些事', 'link': 'matters'}
		],

		// 栏目title
		archiveTitle: {
			index: '小前端 - TANGBC.COM',
			matters: '前端那些事'
		},

		// 栏目hash对应的category数据库id(表wp_terms)
		cat: {
			matters: 1
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
			listarchives: '/blog/sprint/operation/listarchives/query.php',
			showarticle: '/blog/sprint/operation/showarticle/query.php',
			showcomment: '/blog/sprint/operation/showcomment/query.php',
			listtitle: '/blog/sprint/operation/listtitle/query.php'
		}
	}
	return CONFIG;
});