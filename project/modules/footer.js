/**
 * [页脚模块]
 */
define(function(require, exports, module) {
	var app = require('app');

	var Footer = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'M-footer',
				'template': 'project/template/modules/footer.html',
				'vModel'  : {
					// copyright
					'copy': app.config('copyright')
				}
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