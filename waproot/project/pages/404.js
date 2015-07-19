/**
 * [404页面]
 */
define(function(require, exports, module) {
	var $ = require('jquery');
	var app = require('app');
	var layout = require('layout');

	var NotFound = {
		init: function(data) {
			this.$dom = data.dom;
			layout.setTitle(T('页面都去哪儿了？'));
			this.build();
		},

		// 创建404容器
		build: function() {
			var blank = this.$dom;
			// 布局
			var html = $('<div class="P-404"/>').appendTo(blank);

			// 猥琐的卡通小丑
			var obscener = $([
				'<div class="P-obscener">',
					// 头部
					'<div class="head">',
						'<div class="hair"/>',
						'<div class="face">',
							'<div class="left-eye"/>',
							'<div class="right-eye"/>',
							'<div class="mouth">',
								'<div class="tooth"/>',
								'<div class="tooth"/>',
								'<div class="tooth"/>',
								'<div class="tooth"/>',
								'<div class="tooth"/>',
								'<div class="tooth"/>',
								'<div class="tooth"/>',
								'<div class="tooth"/>',
							'</div>',
						'</div>',
					'</div>',
					// 上半身
					'<div class="upperBody">',
						'<div class="arm upleft"/>',
						'<div class="arm upRight"/>',
						'<div class="arm lowerleft"/>',
						'<div class="arm lowerRight"/>',
					'</div>',
					// 404牌子
					'<div class="privateBody">',
						'404',
					'</div>',
					// 下半身
					'<div class="lowerBody">',
						'<div class="leg upleft"/>',
						'<div class="leg upRight"/>',
						'<div class="leg lowerleft"/>',
						'<div class="leg lowerRight"/>',
					'</div>',
					'<div class="foot">',
						'<div class="shoe left"/>',
						'<div class="shoe right"/>',
					'</div>',
				'</div>'
			].join(''));
			obscener.appendTo(html);

			// 绑定返回上一页
			// app.event.bind($('.back', rightPart), 'click', this.goToBack, this);
		},

		goToBack: function() {
			app.controller.go(-1);
			return false;
		}
	}
	module.exports = NotFound;
});