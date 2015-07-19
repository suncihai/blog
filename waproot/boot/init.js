(function(sea, win) {

	// 核心/组件模块公用
	var commonPath = {
		'dist'   : '/blog/dist',
		'core'   : '/blog/dist/core',
		'plugins': '/blog/dist/plugins',
		'modules': '/blog/project/modules'
	}

	var config = {
		'base': '/blog/waproot',
		'paths': {
			// 核心目录
			'@boot'       : 'boot',
			'@view'       : 'view',
			'@dist'       : commonPath.dist,
			'@core'       : commonPath.core,
			'@plugins'    : commonPath.plugins,
			// 控制器目录
			'@controller' :	'controller',
			// 项目目录
			'@modules'    : commonPath.modules,
			'@selfModules': 'project/modules',
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
			[/^(.*\.(?:css|js))(.*)$/i, '$1?v=0.1.0']
		],
		'preload': [
			'resources/css/app.css',
			'@dist/plugins/prism/prism.min.css'
		],
		'debug': 0
	};

	// 配置文件中的语言标记
	function _T(text) {
		return text;
	}
	win._T = _T;

	/**
	 * 页面加载初始化
	 */
	(function () {
		sea.config(config);
		sea.use(['layout', '@core/router'], function(layout, router) {
			layout.init();
			router.start();
		});
	})();


})(seajs, window);