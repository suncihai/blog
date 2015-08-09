(function(sea, win) {

	// 公用目录
	var parentPath = {
		'dist'      : '/blog/dist',
		'core'      : '/blog/dist/core',
		'plugins'   : '/blog/dist/plugins',
		'modules'   : '/blog/project/modules',
		'resources' : '/blog/resources'
	}

	var config = {
		'base': '/blog/waproot',
		'paths': {
			// 核心目录
			'@boot'       : 'boot',
			'@view'       : 'view',
			'@dist'       : parentPath.dist,
			'@core'       : parentPath.core,
			'@plugins'    : parentPath.plugins,
			// 控制器目录
			'@controller' :	'controller',
			// 项目目录
			'@modules'    : parentPath.modules,
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
			parentPath.resources + '/css/font-awesome.min.css',
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
		sea.use('@core/language', function(language) {
			language.load(function() {
				sea.use(['layout', '@core/router'], function(layout, router) {
					layout.init();
					router.start();
				});
			});
		});
	})();


})(seajs, window);