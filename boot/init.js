(function( sea, win ){

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
			'resources/css/app.css',
			// 'resources/css/app.min.css',
			'@dist/plugins/prism/prism.min.css',
			'@dist/plugins/animate/animate.min.css'
		],
		'debug': 0
	};

	/**
	 * appInit 初始化配置
	 */
	var i = 0;
	var appInit = function() {
		var cb = stepFunc[i++];
		if ( cb ) {
			cb.apply( win, arguments );
		}
	};
	var stepFunc = [
		// 加载基础文件
		function() {
			// 应用SeaJS配置
			sea.config( config );
			sea.use('layout', appInit);
		},
		// 初始化布局
		function( layout ) {
			layout.base.init();
			sea.use('@core/router', appInit);
		},
		// 启动路由
		function( router ) {
			router.start();
		}
	];

	// 浏览器特性判断
	sea.use('/blog/dist/core/character', function( b ) {
		if ( b.j() ){
			return false;
		}
		// 初始化开始
		appInit();
	});

})( seajs, window );