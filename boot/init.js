(function(sea, win) {

	var config = {
		'base': '/blog/',
		'paths': {
			// 核心目录
			'@boot'       : 'boot',
			'@view'       : 'view',
			'@dist'       : 'dist',
			'@core'       : 'dist/core',
			'@plugins'    : 'dist/plugins',
			// 控制器目录
			'@controller' :	'controller',
			// 项目目录
			'@project'    : 'project',
			'@modules'    : 'project/modules',
			'@pages'      : 'project/pages'
		},
		'alias': {
			'app'    : '@core/app.js',
			'view'   : '@view/view.js',
			'layout' : '@view/layout.js',
			'util'   : '@core/util.js',
			'jquery' : '@dist/jquery/jquery-1.8.3.min.js'
		},
		'map': [
			[/^(.*\.(?:css|js))(.*)$/i, '$1?v=1.1']
		],
		'preload': [
			'resources/css/app.min.css',
			'resources/css/font-awesome.min.css',
			'@dist/plugins/prism/prism.min.css',
			'@dist/plugins/animate/animate.min.css'
		],
		'debug': 0
	};

	// 配置文件中的语言标记
	function _T(text) {
		return text;
	}
	win._T = _T;

	/**
	 * appInit 初始化配置
	 */
	var i = 0;
	var appInit = function() {
		var cb = stepFunc[i++];
		if (cb) {
			cb.apply(win, arguments);
		}
	};
	var stepFunc = [
		// 配置文件以及语言包
		function() {
			sea.config(config);
			sea.use('@core/language', appInit);
		},
		// 语言包回调
		function(language) {
			language.load(appInit);
		},
		// 加载布局和路由模块
		function() {
			sea.use(['layout', '@core/router'], appInit);
		},
		// 启动路由
		function(layout, router) {
			layout.init();
			router.start();
		}
	];

	// 浏览器特性判断
	sea.use('/blog/dist/core/character', function(b) {
		if (b.j()){
			return false;
		}
		// 初始化开始
		appInit();
	});

})(seajs, window);