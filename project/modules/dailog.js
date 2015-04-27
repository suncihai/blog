/**
 * [弹窗模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var app = require('app');
	var util = require('util');
	var layout = require('@modules/layout').base;
	var DAILOG = layout.getDOM('DAILOG');
	var MASK = layout.getDOM('MASK');

	// 弹出层对话框
	var Dailog = {
		init: function( config ) {
			if( config ) {
				this.update( config );
			}
			this.build();
			return this;
		},

		// 返回弹窗的主体DOM
		getBody: function() {
			return this.$doms.body;
		},

		// 根据配置的宽高，更新弹窗的位置
		// config配置：{width: xx, height: yy}, 单位em
		update: function( config ) {
			if( util.isObject( config ) ) {
				var w = config.width, h = config.height;
				var ml = -(w / 2) + 'em', mt = -(h / 2 + 2) + 'em';
				if( w ) {
					DAILOG.width( w );
				}
				if( h ) {
					DAILOG.height( h );
				}
				DAILOG.css({
					'width': w,
					'height': h,
					'margin-left': ml,
					'margin-top': mt
				});
			}
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
			app.event.hover( this.$doms.close, this.eventCloseEnter, this.eventCloseOut, this );
		},

		eventCloseEnter: function() {
			app.animate.going(this.$doms.close, 'rotateCloseForward');
		},

		eventCloseOut: function() {
			app.animate.going(this.$doms.close, 'rotateCloseBack');
		},

		// 点击关闭对话框
		eventCloseDailog: function() {
			var self = this;
			self.hide();
			// app.animate.going( DAILOG, 'bounceOut', function() {
			// 	self.$doms.close.removeClass('animated rotateCloseForward rotateCloseBack');
			// });
			app.event.fire('dailogClosed');
			return false;
		}
	}
	exports.base = Dailog;
});