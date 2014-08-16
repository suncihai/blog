define(function( require, exports ){
	var CONFIG = {

		// 默认页面
		defaultPage: 'index',

		//Logo
		logo: {
			alt: '小前端-前端那些事~',
			src: 'resources/images/logo.png'
		},

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

		// 栏目title
		archiveTitle: {
			index: '欢迎来到小前端！',
			javascript: 'JavaScript | 博文汇总',
			html5css3: 'HTML5&CSS3 | 博文汇总',
			htmlcss: 'XHTML/CSS | 博文汇总',
			ued: '用户体验设计',
			talk: '前端那些事'
		},

		// 栏目hash对应的category数据库id
		catId: {
			javascript: 1,
			html5css3: 2,
			htmlcss: 3,
			ued: 4,
			talk: 5
		},

		// 后端处理目录
		backPath: '/me/fade',

		// 请求选项
		requestOption: {
			pageSize: 10,	// archive页面显示文章数
			briefSize: 80,	// archive页面文章摘要长度
			orderBy: [
				'date',		// 按最新发布
				'rencentlyComment',		// 按最新评论
				'mostComment', 		// 按评论数
				'random'		// 随机
			]
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