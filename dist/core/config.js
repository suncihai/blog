define(function( require, exports ){
	var CONFIG = {

		// 默认页面
		defaultPage: 'index',

		// 控制器的调用方法
		action: 'onRun',

		// 导航
		nav: [
			{
				'name': '首页',
				'link': 'index'
			},
			{
				'name': 'JavaScript',
				'link': 'javascript'
			},
			{
				'name': 'HTML5&CSS3',
				'link': 'html5css3'
			},
			{
				'name': 'XHTML/CSS',
				'link': 'htmlcss'
			},
			{
				'name': '用户体验设计',
				'link': 'ued'
			},
			{
				'name': '前端那些事',
				'link': 'talk'
			}
		],

		// 后端处理目录
		backPath: '/fade',

		// 请求选项
		request: {
			pageSize: 10,	// archive页面显示文章数
			briefSize: 80	// archive页面文章摘要长度
		},

		// 数据中心
		dataCenter: {
			listarchives: '/listarchives',
			showarticle: '/showarticle',
			showcomment: '/showcomment',
			listtitle: '/listtitle'
		}
	}
	return CONFIG;
});