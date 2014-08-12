define(function( require, exports ){
	var CONFIG = {
		// 默认hash值
		'defaultHash': 'index',

		// 归档页
		'Archives': ['javascript', 'html5css3', 'xhtmlcss', 'ued', 'talk'],

		// 导航
		'nav': [
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
				'link': 'xhtmlcss'
			},
			{
				'name': '用户体验设计',
				'link': 'ued'
			},
			{
				'name': '前端那些事',
				'link': 'talk'
			}
		]
	}
	return CONFIG;
});