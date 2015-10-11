/**
 * [对话框基础模块]
 */
define(function(require, exports) {
	var app = require('app');
	var util = app.util;
	var $ = app.jquery;

	var layout = app.core.get('layout');
	// 全局蒙版
	var MASK = layout.getContainer('MASK');
	// 对话框容器
	var DIALOG = layout.getContainer('DIALOG');

	var Dialog = app.Container.extend({
		init: function(config) {
			config = app.cover(config, {
				'target'  : DIALOG,
				'class'   : 'M-dialog',
				'template': 'template/modules/dialog.html',
				'vModel'  : {
					// 对话框标题
					'title'       : config.title || T('系统提示'),
					// 点击关闭对话框
					'vmClickClose': this.eventClickClose
				},

				// 自定义对话框宽度(单位em)
				'width'   : 0,
				// 自定义对话框高度(单位em)
				'height'  : 0,
				// 对话框内容类型 module/layout
				'type'    : 'module',
				// 对话框内容的模块
				'module'  : null,
				// 模块参数配置
				'config'  : null,
				// 对话框内容的字符串布局
				'layout'  : '',
				// 是否随机展示动画
				'random'  : false,
				// 异步创建内容完成时是否发送消息
				'silent'  : true
			});
			// 是否为显示状态
			this.$show = false;

			// 一对打开关闭动画
			var frame = this.getPairFrame(config.random);
			// DIALOG打开动画
			this.$inFrame = frame.show;
			// DIALOG关闭动画
			this.$outFrame = frame.hide;
			this.Super('init', arguments);
		},

		/**
		 * 获取一对显示/隐藏动画
		 */
		getPairFrame: function(random) {
			var frames = app.config('pairFrames');
			var show = 0, hide = 1, len = frames.length;
			var resArr = random ? frames[util.random(0, len - 1)] : frames[0];
			return {
				'show': resArr[show],
				'hide': resArr[hide]
			}
		},

		viewReady: function() {
			var self = this;
			var c = this.getConfig();
			var el = this.getDOM();

			// DOM缓存
			this.$doms = {
				'body' : el.find('.M-dialogBody'),
				'close': el.find('.M-dialogHeadClose')
			}

			// 创建对话框内容模块
			var isAsync = false;
			var name = util.guid('widget_dialog_');
			var config = util.extend({
				'target': this.$doms.body
			}, c.config);

			// 内容为模块
			if (c.type === 'module') {
				// 异步创建
				if (util.isString(c.module)) {
					isAsync = true;
					this.createAsync(name, c.module, config, function() {
						self.fire('dialogBuilded');
					});
				}
				// 同步创建
				else if (util.isFunc(c.module)) {
					this.create(name, c.module, config);
				}
			}
			// 内容为字符串
			else if (c.type === 'layout') {
				this.$doms.body.html(c.layout);
			}

			if (!isAsync) {
				this.updatePosition();
			}

			// 对话框关闭按钮事件
			this.bind(this.$doms.close, 'click mouseenter mouseleave', this.eventClose);
		},

		/**
		 * 对话框内容异步创建完成
		 */
		onDialogBuilded: function() {
			this.updatePosition();
			if (this.getConfig('silent')) {
				return false;
			}
		},

		/**
		 * 更新对话框位置
		 * @return  {[type]}  [description]
		 */
		updatePosition: function() {
			var c = this.getConfig();
			var width = c.width;
			var height = c.height;

			if (width && height) {
				DIALOG.css({
					'width'      : width + 'em',
					'height'     : height + 'em',
					'margin-left': (width / -2) + 'em',
					'margin-top' : (height / -2) + 'em'
				});
			}
		},

		/**
		 * 设置对话框标题
		 */
		setTitle: function(text) {
			this.vm.set('title', text || this.getConfig('title'));
			return this;
		},

		/**
		 * 关闭按钮事件
		 */
		eventClose: function(evt, elm) {
			switch (evt.type) {
				case 'click':
					this.hide();
				break;
				case 'mouseenter':
					if (this.$show) {
						$(elm).removeClass('rotateCloseBack').addClass('rotateCloseForward');
					}
				break;
				case 'mouseleave':
					if (this.$show) {
						$(elm).removeClass('rotateCloseForward').addClass('rotateCloseBack');
					}
				break;
			}
			return false;
		},

		/**
		 * 显示对话框
		 */
		show: function() {
			var self = this;
			this.$show = true;
			MASK.show();
			app.animate.play(MASK, 'mask-in', 'fast', function() {
				DIALOG.show();
				app.animate.play(DIALOG, self.$inFrame);
			});
			return this;
		},

		/**
		 * 隐藏对话框
		 */
		hide: function() {
			var self = this;
			this.$show = false;
			this.$doms.close.removeClass('rotateCloseBack rotateCloseForward');
			app.animate.play(DIALOG, this.$outFrame, function() {
				DIALOG.hide();
				app.animate.play(MASK, 'mask-out', 'fast', function() {
					MASK.hide();
					self.reset().fire('dialogClosed');
				});
			});
			return this;
		},

		/**
		 * 自身关闭消息
		 */
		onDialogClosed: function() {
			var frame = null;
			var c = this.getConfig();

			if (c.random) {
				frame = this.getPairFrame(true);
				this.$inFrame = frame.show;
				this.$outFrame = frame.hide;
			}
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

			this.vm.reset();
			return this;
		}
	});
	exports.base = Dialog;
});