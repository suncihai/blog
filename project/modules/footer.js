/**
 * [页脚模块]
 */
define(function(require, exports, module) {
	var app = require('app');

	var Footer = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class': 'M-banner',
				'template': 'project/template/modules/footer.html'
			});
			this.Super('init', arguments);
		},

		/**
		 * 布局视图渲染完成
		 */
		viewReady: function() {}
	});
	exports.base = Footer;
});