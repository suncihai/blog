/**
 * [404页面]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var app = require('app');
	var layout = require('@modules/layout').base;

	var NotFound = {
		init: function( data ) {
			this.$dom = data.dom;
			layout.setTitle('页面都去哪儿了？');
			this.build();
		},

		// 创建404容器
		build: function() {
			var blank = this.$dom;
			// 布局
			var html = $([
				'<div class="P-404">',
					'<div class="containerLeft"/>',
					'<div class="containerRight"/>',
				'</div>'
			].join('')).appendTo( blank );

			this.$doms = {
				'left': $('.containerLeft', html),
				'right': $('.containerRight', html)
			}

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
			obscener.appendTo( this.$doms.left );

			var rightPart = $([
				'<h2 class="title">很抱歉，您要访问的页面不存在！</h2>',
				'<p class="handle">有可能是：</p>',
				'<p class="reason">· 请求的url有错<span>请检查地址是否完整或存在多余字符<span></p>',
				'<p class="reason">· 页面失效<span>可能页面模块已删除，或者下线等<span></p>',
				'<p class="handle">',
					'<span>您可以返回：</span>',
					'<a class="btn back">上一页</a>',
					'<a href="/blog/" class="btn index">首页</a>',
					'<a href="/blog/#frontends" class="btn blog">博客</a>',
				'</p>'
			].join(''));
			rightPart.appendTo( this.$doms.right );

			// 绑定返回上一页
			app.event.bind( $('.back', rightPart), 'click', this.goToBack, this );
		},

		goToBack: function() {
			app.controller.go(-1);
			return false;
		}
	}
	exports.base = NotFound;
});