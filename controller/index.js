define(function( require, exports ){
	exports.onRun = function( data, view ) {
		// 创建栏目页面
		data.dom = view.createArchive({
			'container': data.name
		});

		require.async('@pages/archives', function( module ) {
			module['onMain']( data );
		});
	} 
});