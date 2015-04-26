/**
 * [弹窗模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var app = require('app');
	var layout = require('@modules/layout').base;
	var DAILOG = layout.getDOM('DAILOG');
	var MASK = layout.getDOM('MASK');

	// 弹出层对话框
	var Dailog = {
		init: function() {
			this.build();
			return this;
		},

		// 返回弹窗的主体DOM
		getBody: function() {
			return this.$doms.body;
		},

		// 设置遮罩样式
		setMask: function( css ) {
			MASK.css( css );
			this.show();
			return this;
		},

		// 设置对话框的标题
		setTitle: function( txt ) {
			this.$doms.title.text( txt || '' );
			return this;
		},

		// 显示遮罩以及对话框
		show: function() {
			MASK.show();
			DAILOG.show();
			return this;
		},

		// 隐藏遮罩以及对话框
		hide: function() {
			MASK.hide();
			DAILOG.hide();
			return this;
		},

		// 创建对话框
		build: function() {
			if( this.$ready ) {
				this.show();
				return this.getBody();
			}
			var dom = $([
				'<div class="M-dailog">',
					'<div class="M-dailogHead">',
						'<h2 class="M-dailogHeadTitle"/>',
						'<div class="M-dailogHeadClose">',
							'<div class="M-dailogHeadCloseLine"/>',
							'<div class="M-dailogHeadCloseLine"/>',
						'</div>',
					'</div>',
					'<div class="M-dailogBody"/>',
				'</div>'
			].join(''));

			dom.appendTo( DAILOG );

			this.$doms = {
				'title': $('.M-dailogHeadTitle', dom),
				'close': $('.M-dailogHeadClose', dom),
				'body':  $('.M-dailogBody', dom)
			}

			this.$ready = true;

			// 绑定关闭对话框事件
			app.event.bind( this.$doms.close, 'click', this.eventCloseDailog, this );
		},

		// 点击关闭对话框
		eventCloseDailog: function() {
			this.hide();
			return false;
		}
	}
	exports.base = Dailog;
});