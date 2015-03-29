define(function( require, exports ){
	var $ = require('jquery');
	var C = require('@core/config');
	var layout = require('layout').base;

	var Index = {
		init: function( data ) {
			this.$data = data;
			layout.setTitle( C.archiveTitle[this.$data.name] );
			this.build();
		},

		build: function() {
			var dom = this.$data.dom;
			// 布局
			var html = $([
				'<div class="M-index">',
					'<div class="M-indexWraper">',
						'<h2 class="word">欢迎光临鄙人陋舍</h2>',
						'<h2 class="word">呃······</h2>',
						'<h2 class="word smaller">主页的设计向来是个头疼的问题</h2>',
						'<h2 class="word smaller">暂时这样简简单单的吧</h2>',
						'<h2 class="word smaller">更多内容请移步↓</h2>',
						'<h2 class="tc">',
							'<a href="/blog/#matters" class="myBlog">我的博客</a>',
						'</h2>',
					'</div>',
				'</div>'
			].join(''));
			dom.append( html );
		}
	}
	exports.base = Index;
});