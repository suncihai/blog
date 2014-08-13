;(function( SEA, WIN ){

	// SeaJS配置信息
	var SeaJSConfig = {
		base: '/me/',
		alias: {
			'layout':       '@core/layout.js',
			'util':         '@core/util.js',
			'view':         '@core/view.js',
			'jquery':       '@asset/jquery/jquery-1.8.3.min.js'
		},
		paths: {
			'@asset':   	'asset',
			'@core': 		'asset/core',
			'@controller':	'controller',
			'@pages':		'pages'
		},
		map: [
			// [/^(.*\.(?:css|js))(.*)$/i, '$1?v=20140000'] 
		],
		preload: [],
		debug: true
	};

	// 应用配置
	SEA.config( SeaJSConfig );

	/**
	 * 调用系统所需文件
	 * @param  {[String||Array]}   file   [文件路径]
	 * @param  {Function} callback 		  [加载成功后回调函数]
	 * @return {[null]}                   [无返回值]
	 */
	var _use = function( file, callback ){
		SEA.use( file, callback );
	};
	var i = 0;
	var stepFunc = [
		_use( 'jquery', stepFunc ), 
		_use( 'util', stepFunc ), 
		_use( 'layout', stepFunc ),
		_use( '@core/router', function( router ){
			// 启动路由控制
			router.start();
		})
	];
	
	(function() {
		var cb = stepFunc[i++];
		if( cb ) {
			cb.apply( WIN, arguments );
		}
	})();

})( seajs, window );