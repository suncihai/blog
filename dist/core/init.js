(function( SEA, WIN ){

	// SeaJS配置信息
	var SeaJSConfig = {
		base: '/blog/',
		alias: {
			'layout':       '@core/layout.js',
			'util':         '@core/util.js',
			'view':         '@core/view.js',
			'router':       '@core/router.js',
			'jquery':       '@dist/jquery/jquery-1.8.3.min.js'
		},
		paths: {
			'@dist':   		'dist',
			'@core': 		'dist/core',
			'@controller':	'controller',
			'@pages':		'pages',
			'@plugins':		'dist/plugins'
		},
		map: [
			// [/^(.*\.(?:css|js))(.*)$/i, '$1?v=20140000']
		],
		preload: [],
		debug: 0
	};

	/**
	 * INIT 分步初始化
	 */
	function INIT() {
		var cb = stepFunc[i++];
		if( cb ) {
			cb.apply( WIN, arguments );
		}
	}
	var i = 0;
	var stepFunc = [
		// 加载基础文件
		function() {
			// 应用SeaJS配置
			SEA.config( SeaJSConfig );
			SEA.use( ['jquery', 'util', 'layout'], INIT );
		},

		// 初始化布局
		function( jquery, util, layout ) {
			layout.init();
			SEA.use( 'router', INIT );
		},

		// 启动路由
		function( router ) {
			router.start();
		}
	];

	INIT();

})( seajs, window );