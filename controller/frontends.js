/**
 * 路由响应模块：文章页和栏目页
 */
define(function(require, exports) {
	var app = require('app');
	var util = app.util;
	var layout = app.core.get('layout');
	// 栏目数据库id
	var category = app.config('category');

	/**
	 * @param   {Object}  data  [路由参数]
	 */
	exports.onRun = function(data) {
		// 是否是栏目页
		var isAchive = data.param == null;

		// 页面模块路径
		var path = isAchive ? '@pages/archive.base' : '@pages/article.base';

		// 页面模块名称
		var name = isAchive ? 'blogArchive' : 'blogArticle';

		// 页面模块的目标容器
		var target = layout.getContainer(name);

		// 切换场景
		layout.switchScene(name);

		var mod = app.core.get(name);

		// 已经创建过
		if (mod) {
			if (isAchive) {
				mod.reset().setParam({
					'page' : data && data.search && +data.search.page || 1,
					'catid': category[data && data.name]
				}).load();
			}
			else {
				mod.reset().setParam(data.param).load();
			}
		}
		else {
			mod = app.core.createAsync(name, path, {
				'target': target
			}, function(md) {
				md.saveRouter(data);
			});
		}

		// 更新导航激活
		app.core.notify('layout.blogHeader', 'updateNav', data.name);
	}
});