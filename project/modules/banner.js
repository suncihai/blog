/**
 * [博客Banner模块]
 */
define(function(require, exports) {
	var app = require('app');

	var Banner = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'class'   : 'M-banner',
				'template': 'project/template/modules/banner.html',
				'vModel'  : {
					// 是否是栏目banner
					'isAchive': true,
					// 栏目banner的内容
					'content' : '',
					// 文章banner的标题
					'title'   : '',
					// 文章banner的发布时间
					'time'    : '',
					// 文章banner的评论数
					'comments': 0
				}
			});
			this.Super('init', arguments);
		},

		/**
		 * 更新栏目banner的内容
		 */
		onUpdateQuotations: function(ev) {
			this.vm.set('content', ev.param);
		}
	});
	exports.base = Banner;
});