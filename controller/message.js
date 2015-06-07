define(function( require, exports ){
	exports.onRun = function( data, view ) {
		// 创建留言板页面
		data.dom = view.createBlog({
			'container': data.name
		});

		require.async('@pages/message', function( mod ) {
			var module = mod.base;
			module.init( data );
		});
	}
});