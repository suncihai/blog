/**
 * [留言页面]
 */
define(function(require, exports) {
	var app = require('app');
	var util = app.util;
	var $ = app.jquery;

	var Message = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'P-message',
				'template': 'template/pages/message.html',
				'vModel'  : {
					// 选项卡默认选择激活选项
					'tabType'   : 'form'
				}
			});
			this.Super('init', arguments);
		},

		/**
		 * 视图渲染完成
		 */
		viewReady: function() {
			// 绑定选项卡点击事件
			var tabDom = this.getDOM('.P-messageLeftTab');
			this.proxy(tabDom, 'click', 'li', 'eventClickTab');

			// 更新banner
			this.updateBanner();

			// 显示页脚
			this.notify('layout.blogFooter', 'switchFooter', true);
		},

		/**
		 * 更新banner
		 */
		updateBanner: function() {
			var text = '<span class="fts30">' + T('可以随意发表：无聊的、建议的、拍砖的、批评的……') + '<span>';
			this.notify('layout.blogBanner', 'updateQuotations', text);
		},

		/**
		 * 点击选项卡
		 */
		eventClickTab: function(evt, elm) {
			var type = $(elm).attr('data-type');
			this.vm.set('tabType', type);
			return false;
		},

		/**
		 * 重置模块为初始状态
		 */
		reset: function() {
			var chs = this.getChilds(true);
			util.each(chs, function(child) {
				if (util.isFunc(child.reset)) {
					child.reset();
				}
			});

			this.updateBanner();

			this.vm.reset();
			return this;
		}
	});
	exports.base = Message;
});