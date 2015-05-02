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
				['bounceInLeft', 'bounceOutRight'],
				['lightSpeedIn', 'lightSpeedOut'],
				['fadeInUp', 'fadeOutDown'],
				['fadeInDown', 'fadeOutUp'],
				['rotateInDownLeft', 'rotateOutUpRight'],
				['rotateIn', 'rotateOut']
			];
			frame = this.getPairFrame( this.$isRandom );
			// DAILOG打开动画
			this.$inFrame = frame['in'];
			// DAILOG关闭动画
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
					DAILOG.css({
						'width': w + 'em',
						'margin-left': ml
					});
				}
				if ( h ) {
					DAILOG.css({
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
				DAILOG.show();
				app.animate.play( DAILOG, self.$inFrame, function() {
					MASK.show();
				});
			});
			return self;
		},

		// 隐藏遮罩以及对话框
		hide: function() {
			var self = this;
			self.$show = false;
			app.animate.play( DAILOG, self.$outFrame, function() {
				DAILOG.hide();
				app.animate.play( MASK, 'maskOut', 1, function (){
					MASK.hide();
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
			// 监听自身对话框关闭消息
			app.event.on('dailogClosed', this.onDailaogClosed, this);
		},

		eventCloseEnter: function() {
			if ( this.$show ) {
				app.animate.play(this.$doms.close, 'rotateCloseForward');
			}
		},

		eventCloseOut: function() {
			// 对话框未关闭的状态下
			if ( this.$show ) {
				app.animate.play(this.$doms.close, 'rotateCloseBack');
			}
		},

		// 点击关闭对话框
		eventCloseDailog: function() {
			var self = this;
			self.hide();
			self.$doms.close.removeClass('rotateCloseForward rotateCloseBack');
			app.event.fire('dailogClosed');
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
	exports.base = Dailog;
});