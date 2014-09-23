/**
 * [系统配置信息]
 */
define(function( require, exports ) {
	// 代码高亮插件路径
	var pluginsBase = "/blog/dist/plugins/syntaxhighlighter/syntaxhighlighter3/scripts/";
	var syntaxScripts = [
		'<script src="'+ pluginsBase +'shCore.js"></script>',
		'<script src="'+ pluginsBase +'shAutoloader.js"></script>',
		'<script src="'+ pluginsBase +'shBrushXml.js"></script>',
		'<script src="'+ pluginsBase +'shInit.js"></script>'
	].join('');

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

		// 代码高亮插件地址
		codeHighLighter: syntaxScripts,

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
				'name': 'CSS',
				'link': 'css'
			},
			{
				'name': 'UED',
				'link': 'ued'
			},
			{
				'name': '前端那些事',
				'link': 'talk'
			}
		],

		// 栏目title
		archiveTitle: {
			index: '小前端',
			javascript: 'JavaScript',
			css: 'CSS',
			ued: '用户体验设计',
			talk: '前端那些事'
		},

		// 栏目hash对应的category数据库id
		cat: {
			javascript: 1,
			css: 2,
			ued: 3,
			talk: 4
		},

		// archive列表默认请求选项
		archiveOption: {
			catid: 1,
			limit: 10,		// archivem每页显示文章数
			brief: 80,		// archive页面文章摘要长度
			order: 'date' 	// 按时间顺序排列
		},

		// article默认请求选项
		articleOption: {
			artid: 2,
			brief: 800,
			page: false
		},

		// 侧边标题列表默认请求选项
		listOption: {
			amount: 8,
			orderby: 'date'
		},

		// 数据中心
		dataCenter: {
			// 处理文件
			path: '/blog/Sprint/operation',
			file: 'query.php',
			// 文件目录
			listarchives: '/listarchives/',
			showarticle: '/showarticle/',
			showcomment: '/showcomment/',
			listtitle: '/listtitle/'
		}
	}
	return CONFIG;
});