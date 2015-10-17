define(function(require, exports) {
	var app = require('app');
	var layout = app.core.get('layout');

	/**
	 * @param   {Object}  data  [路由参数]
	 */
	exports.onRun = function(data) {
		// 页面模块名称
		var name = 'blogMessage';

		// 页面模块目标容器
		var target = layout.getContainer(name);

		// 切换场景
		layout.switchScene(name);

		var mod = app.core.get(name);

		// 已经创建过
		if (mod) {
			mod.reset().reloadList();
		}
		else {
			app.core.createAsync(name, '@pages/message.base', {
				'target': target
			});
		}

		// 更新导航激活
		app.core.notify('layout.blogHeader', 'updateNav', data.name);
	}
});