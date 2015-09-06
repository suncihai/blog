/**
 * 路由响应模块：文章页和栏目页
 */
define(function(require, exports) {
	var app = require('app');
	var view = require('view');

	/**
	 * @param   {Object}  data  [路由参数]
	 */
	exports.onRun = function(data) {
		// 是否是栏目页
		var isAchive = data.param == null;

		// 页面模块路径
		var path = isAchive ? '@pages/frontends' : '@pages/frontend';

		// 页面模块名称
		var name = isAchive ? 'archive' : 'archive';

		// 页面模块的目标容器
		var target = isAchive ? view.getBlogAchive() : view.getBlogArticle();

		// 获取当前模块，判断是否已经创建过
		var mod = app.core.get(name);

		// 已经创建过
		if (mod) {
			mod.load();
		}
		else {
			app.core.createAsync(name, data, function(md) {
				md.load();
			});
		}
	}
});