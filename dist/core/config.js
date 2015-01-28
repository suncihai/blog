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
		copyright: '©2012-2014 TANGBC.COM 桂ICP备12002316号',

		// 统计代码
		stat: '',

		// 主页容器固定长度
		indexWidth: 1080,

		// 博客容器固定长度
		blogWidth: 1080,

		// 导航
		nav: [
			{'name': '首页', 'link': 'index'},
			{'name': 'JavaScript', 'link': 'javascript'},
			{'name': 'HTML/CSS', 'link': 'htmlcss'},
			{'name': 'UE Design', 'link': 'uedesign'},
			{'name': '前端那些事', 'link': 'matters'}
		],

		// 栏目title
		archiveTitle: {
			index: '小前端',
			javascript: 'JavaScript',
			htmlcss: 'CSS',
			uedesign: '用户体验设计',
			matters: '前端那些事'
		},

		// 栏目hash对应的category数据库id(表wp_terms)
		cat: {
			javascript: 3,
			htmlcss: 22,
			uedesign: 6,
			matters: 1
		},

		// archive列表默认请求选项
		archiveOption: {
			catid: 1,
			page: 1,		// 请求第1页
			limit: 10,		// 每页显示文章数
			brief: 180,		// 文章摘要长度
			order: 'date' 	// 按时间顺序排列
		},

		// article默认请求选项
		articleOption: {
			artid: 2
		},

		// 侧边标题列表默认请求选项
		listOption: {
			amount: 8,
			type: 'date'
		},

		// 数据中心
		dataCenter: {
			// 处理文件目录
			listarchives: '/blog/Sprint/operation/listarchives/query.php',
			showarticle: '/blog/Sprint/operation/showarticle/query.php',
			showcomment: '/blog/Sprint/operation/showcomment/query.php',
			listtitle: '/blog/Sprint/operation/listtitle/query.php'
		}
	}
	return CONFIG;
});