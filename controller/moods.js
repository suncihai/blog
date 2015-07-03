define(function(require, exports) {
	exports.onRun = function(data, view) {
		var type = data.param == null ? 'frontends' : 'frontend';

		data.dom = view.createBlog({
			'container': data.name,
			'pageid': data.param // 存在param时为文章页,否则为栏目页
		});

		require.async('@pages/' + type, function(mod) {
			var module = mod.base;
			module.init(data);
		});
	}
});