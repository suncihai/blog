(function( sea, win, doc ){
	var support = (function() {
		var oDiv = doc.createElement('div'),
		browsers = 'O-Moz-Webkit'.split('-'),
		len = browsers.length,
		prop = "Perspective";
		if( prop in oDiv.style ) {
			return true;
		}
		if( '-ms-' + prop in oDiv.style ) {
			return true;
		}
		while( len-- ) {
			if( browsers[len] + prop in oDiv.style ) {
				return true;
			}
		}
		return false;
	})();

	if( !support || doc.documentMode == 10 ) {
		var hash, arr, len, archive, aid, path;
		var loc = win.location;
		var host = loc.host;
		hash = loc.hash.replace(/^[#\/\!]+/, '');
		arr = hash.split('/');
		len = arr.length;

		switch( len ) {
			case 1: aid = null; break;
			case 2: aid = arr[1]; break;
			default: aid = arr[2] === '' ? arr[1] : null;
		}

		archive = arr[0];
		if( archive === 'index' ) {
			path = ''
		}
		if( archive && !aid ) {
			path = '/p/' + archive
		}
		if( archive && aid ) {
			path = '/' + aid + '.html'
		}

		win.location.href = 'http://' + host + path;
		return;
	}

	// SeaJS配置信息
	var seaConfig = {
		// 重设根目录
		'base': '/blog/',
		// 路径缩写
		'paths': {
			// 核心模块目录
			'@dist'       : 'dist',
			'@core'       : 'dist/core',
			'@plugins'    : 'dist/plugins',
			// 控制器模块目录
			'@controller' :	'controller',
			// 项目模块目录
			'@project'    : 'project',
			'@modules'    : 'project/modules',
			'@pages'      : 'project/pages'
		},
		// 常用模块别名配置
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
	}
	var stepFunc = [
		// 加载基础文件
		function() {
			// 应用SeaJS配置
			sea.config( seaConfig );
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
	// 初始化开始
	appInit();
})( seajs, window, document );