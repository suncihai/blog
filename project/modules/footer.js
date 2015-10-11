/**
 * [页脚模块]
 */
define(function(require, exports, module) {
	var app = require('app');

	var Footer = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'M-footer',
				'template': 'template/modules/footer.html',
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
		viewReady: function() {
			var c = this.getConfig();

			this.$doms = {
				'wraper': c.target
			};
		},

		// 显示页脚
		hide: function() {
			this.$doms.wraper.hide();
			return this;
		},

		// 隐藏页脚
		show: function() {
			this.$doms.wraper.show();
			return this;
		},

		// 消息控制页脚的显示隐藏
		onSwitchFooter: function(ev) {
			var param = ev.param;
			if (param) {
				this.show();
			}
			else {
				this.hide();
			}
		}
	});
	exports.base = Footer;
});