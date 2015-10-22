/**
 * 路由响应模块：404页面
 */
define(function(require, exports) {
	var sugar = require('sugar');
	var layout = sugar.core.get('layout');

	/**
	 * @param   {Object}  data  [路由参数]
	 */
	exports.onRun = function(data) {
		// 模块名称
		var name = 'notFound';

		// 空白容器
		var blank = layout.getContainer('blank');

		// 切换场景
		layout.switchScene('blank');

		// 是否已创建
		var mod = sugar.core.get(name);

		// 如果存在，则销毁
		if (mod) {
			mod.destroy();
		}

		mod = sugar.core.createAsync(name, '@pages/404.base', {
			'target': blank
		});
	}
});