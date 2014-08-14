define(function( require, exports ){
	exports.onRun = function( data, view ) {
		// 创建页面容器
		data.dom = view.createContainer({
			'container': data.name
		});

		require.async('@pages/archives', function( module ) {
			module['build']( data );
		});
	} 
});