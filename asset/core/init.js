;(function( SEA ){
	// SeaJS配置信息
	var SeaJSConfig = {
		base: '/me/',
		alias: {
			'layout':     '@core/layout.js',
			'jquery':       '@asset/jquery/jquery-1.8.3.min.js'
		},
		paths: {
			'@asset':   'asset',
			'@core': 	'asset/core',
			'@modules':	'modules'
		},
		map: [
			// [/^(.*\.(?:css|js))(.*)$/i, '$1?v=20140000'] 
		],
		preload: [],
		debug: true
	}

	// 应用配置
	SEA.config( SeaJSConfig );

	SEA.use( ['jquery', 'layout'], function(){} );

})( seajs );