/**
 * [博客Banner模块]
 */
define(function(require, exports) {
	var sugar = require('sugar');

	var Banner = sugar.Container.extend({
		init: function(config) {
			config = sugar.cover(config, {
				'class'   : 'M-banner',
				'template': 'template/modules/banner.html',
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
			this.vm.set({
				'isAchive': true,
				'content' : ev.param
			});
		},

		/**
		 * 更新文章banner内容
		 */
		onChangeInfo: function(ev) {
			var param = ev.param;
			var time = param.date;
			var title = param.title;
			var comments = param.comments;

			this.vm.set({
				'isAchive': false,
				'title'   : title,
				'time'    : time,
				'comments': comments
			});
		}
	});
	exports.base = Banner;
});