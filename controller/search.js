define(function(require, exports) {
	exports.onRun = function(data, view) {
		// 创建搜索页面
		data.dom = view.createBlog({
			'container': data.name
		});

		require.async('@pages/search', function(mod) {
			var module = mod.base;
			module.init(data);
		});
	}
});