/**
 * [弹窗模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var app = require('app');
	var util = require('util');
	var layout = require('layout').base;
	var DIALOG = layout.getDOM('DIALOG');
	var MASK = layout.getDOM('MASK');

	// 弹出层对话框
	var Dialog = {
		init: function( config ) {
			var frame = null;
			if ( config ) {
				this.update( config );
			}
			// 显示状态
			this.$show = false;
			// 动画是否随机展示
			this.$isRandom = false;
			// 动画集合(随机展示用)
			this.$frames = [
				['rollIn', 'rollOut'],
				['bounceInLeft', 'bounceOutRight'],
				['lightSpeedIn', 'lightSpeedOut'],
				['fadeInUp', 'fadeOutDown'],
				['fadeInDown', 'fadeOutUp'],
				['rotateInDownLeft', 'rotateOutUpRight'],
				['rotateIn', 'rotateOut']
			];
			frame = this.getPairFrame( this.$isRandom );
			// DIALOG打开动画
			this.$inFrame = frame['in'];
			// DIALOG关闭动画
			this.$outFrame = frame['out'];
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
			if ( util.isObject( config ) ) {
				var w = config.width, h = config.height;
				var ml = -(w / 2) + 'em', mt = -(h / 2 + 2) + 'em';
				if ( w ) {
					DIALOG.css({
						'width': w + 'em',
						'margin-left': ml
					});
				}
				if ( h ) {
					DIALOG.css({
						'height': h + 'em',
						'margin-top': mt
					});
				}
			}
		},

		// 设置对话框的标题
		setTitle: function( txt ) {
			this.$doms.title.text( txt || '' );
			return this;
		},

		// 显示遮罩以及对话框
		show: function() {
			var self = this;
			self.$show = true;
			MASK.show();
			app.animate.play( MASK, 'maskIn', 1, function(){
				DIALOG.show();
				app.animate.play( DIALOG, self.$inFrame );
			});
			return self;
		},

		// 隐藏遮罩以及对话框
		// cb: 隐藏动画结束后的回调函数 ct: 执行上下文
		hide: function( cb, ct ) {
			var self = this;
			self.$show = false;
			app.animate.play( DIALOG, self.$outFrame, function() {
				DIALOG.hide();
				app.animate.play( MASK, 'maskOut', 1, function() {
					MASK.hide();
					// 执行回调
					if ( util.isFunc( cb ) ) {
						cb.call( ct || window );
					}
				});
			});
			return self;
		},

		// 创建对话框
		build: function() {
			if ( this.$ready ) {
				this.show();
				return this.getBody();
			}
			var dom = $([
				'<div class="M-dialog">',
					'<div class="M-dialogHead">',
						'<h2 class="M-dialogHeadTitle"/>',
						'<div class="M-dialogHeadClose">',
							'<div class="M-dialogHeadCloseLine"/>',
							'<div class="M-dialogHeadCloseLine"/>',
						'</div>',
					'</div>',
					'<div class="M-dialogBody"/>',
				'</div>'
			].join(''));

			dom.appendTo( DIALOG );

			this.$doms = {
				'title': $('.M-dialogHeadTitle', dom),
				'close': $('.M-dialogHeadClose', dom),
				'body':  $('.M-dialogBody', dom)
			}

			this.$ready = true;

			// 绑定关闭对话框事件
			app.event.bind( this.$doms.close, 'click', this.eventCloseDialog, this );
			app.event.hover( this.$doms.close, this.eventCloseEnter, this.eventCloseOut, this );
			// 监听自身对话框关闭消息
			app.messager.on('dialogClosed', this.onDailaogClosed, this);
		},

		eventCloseEnter: function() {
			if ( this.$show ) {
				app.animate.play(this.$doms.close, 'rotateCloseForward');
			}
			return false;
		},

		eventCloseOut: function() {
			// 对话框未关闭的状态下
			if ( this.$show ) {
				app.animate.play(this.$doms.close, 'rotateCloseBack');
			}
			return false;
		},

		// 点击关闭对话框
		eventCloseDialog: function() {
			var self = this;
			self.hide();
			self.$doms.close.removeClass('rotateCloseForward rotateCloseBack');
			app.messager.fire('dialogClosed');
			return false;
		},

		// 获取一对打开/关闭对话框的动画
		getPairFrame: function( isRandom ) {
			var frames = this.$frames;
			var len = frames.length;
			var resArr = isRandom ? frames[util.random(0, len - 1)] : frames[0];
			return {
				'in'  : resArr[0],
				'out' : resArr[1]
			}
		},

		// 对话框关闭消息
		onDailaogClosed: function() {
			var frame = null;
			if ( this.$isRandom ) {
				frame = this.getPairFrame(true);
				this.$inFrame = frame['in'];
				this.$outFrame = frame['out'];
			}
			return false;
		}
	}
	exports.base = $.extend(true, {}, Dialog);
});