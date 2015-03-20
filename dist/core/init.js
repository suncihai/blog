(function( sea, win, doc ){

	var config = {
		'base': '/blog/',
		'paths': {
			// 核心模块
			'@dist'       : 'dist',
			'@core'       : 'dist/core',
			'@plugins'    : 'dist/plugins',
			// 控制器模块
			'@controller' :	'controller',
			// 项目模块
			'@project'    : 'project',
			'@modules'    : 'project/modules',
			'@pages'      : 'project/pages'
		},
		'alias': {
			'util'   : '@core/util.js',
			'view'   : '@core/view.js',
			'router' : '@core/router.js',
			'layout' : '@modules/layout.js',
			'jquery' : '@dist/jquery/jquery-1.8.3.min.js'
		},
		'map': [
			// [/^(.*\.(?:css|js))(.*)$/i, '$1?v=20140000']
		],
		'preload': [
			'resources/css/app.css',
			'resources/css/animate.min.css',
			'dist/plugins/prism/prism.css'
		],
		'debug': 0
	};

	/**
	 * appInit 初始化配置
	 */
	var i = 0;
	var appInit = function() {
		var cb = stepFunc[i++];
		if( cb ) {
			cb.apply( win, arguments );
		}
	};
	var stepFunc = [
		// 加载基础文件
		function() {
			// 应用SeaJS配置
			sea.config( config );
			sea.use( ['jquery', 'util', 'layout'], appInit );
		},
		// 初始化布局
		function( jquery, util, layout ) {
			layout.base.init();
			sea.use( 'router', appInit );
		},
		// 启动路由
		function( router ) {
			router.start();
		}
	];

	// 浏览器特性判断
	sea.use('/blog/dist/core/browser', function( browser ) {
		if( browser.checkJump() ){
			return false;
		}
		// 初始化开始
		appInit();
	});

})( seajs, window, document );