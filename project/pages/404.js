/**
 * [404页面]
 */
define(function(require, exports, module) {
	var sugar = require('sugar');

	var NotFound = sugar.Container.extend({
		init: function(config) {
			config = sugar.cover(config, {
				'class'   : 'P-404',
				'template': 'template/pages/404.html'
			});
			this.Super('init', arguments);
		},

		/**
		 * 视图渲染完毕
		 */
		viewReady: function() {
			var back = this.getDOM('.back');

			// 绑定回到上一页
			this.bind(back, 'click', this.eventClickBack);

			// 更新标题
			this.notify('layout', 'changeTitle', T('页面都去哪儿了？'));
		},

		//
		eventClickBack: function() {
			sugar.controller.go(-1);
			return false;
		}
	});
	exports.base = NotFound;
});