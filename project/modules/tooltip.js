/**
 * [悬浮提示框插件]
 */
define(function(require, exports, module) {
	var sugar = require('sugar');
	var $ = sugar.jquery;
	var util = sugar.util;

	var layout = sugar.core.get('layout');
	var LAYER = layout.getContainer('LAYER');


	/**
	 * 带三角箭头的提示框，只有默认配色
	 * tooltip.setTip({
	 *	'refer'     : jqueryDom,
	 *	'arrow'     : 'bottom',
	 *	'offsetLeft': 0,
	 *	'offsetTop' : 0,
	 *	'content'   : 'some text here',
	 *	'width'     : 100
	 * });
	 *
	 * 居中于页面的矩形提示框
	 * tooltip.setTip({
	 *	'type'   : 'normal/success/warning',
	 *	'arrow'  : false,
	 *	'content': 'some text here',
	 *	'width'  : 100
	 * });
	 */

	var Tooltip = {
		init: function() {
			this.config = {
				// 自动隐藏时间
				'timeout'    : 2345,
				// 参考元素
				'refer'      : null,
				// 矩形提示框时的类型：normal普通，success成功，warning警告
				'type'       : 'warning',
				// 三角箭头方向
				'arrow'      : 'bottom',
				// 三角箭头偏移
				'arrowOffset': 0,
				// 提示框左偏移
				'offsetLeft' : 0,
				// 提示框上偏移
				'offsetTop'  : 0,
				// 提示框内容
				'content'    : '',
				// 自定义宽度
				'width'      : 0,
				// 自定义高度
				'height'     : 0
			};
			// 显示状态
			this.$status = 'hide';
			// document
			this.$doc = $(document);
			// 是否已经创建DOM
			this.$ready = false;
			this.build();
			return this;
		},

		getConfig: function(name) {
			return sugar.config(this.config, name);
		},

		setConfig: function(name, value) {
			return sugar.config(this.config, name, value);
		},

		/**
		 * 构建DOM布局
		 */
		build: function() {
			if (this.$ready) {
				return this;
			}

			var tooltip = $([
				'<div class="M-tooltip">',
					'<div class="M-tooltipArrowUp arrow">',
						'<div class="arrow-up-border"/>',
						'<div class="arrow-up-bg"/>',
					'</div>',
					'<div class="M-tooltipContent">',
						'<div class="M-tooltipContentText animated"/>',
					'</div>',
					'<div class="M-tooltipArrowDown arrow">',
						'<div class="arrow-down-border"/>',
						'<div class="arrow-down-bg"/>',
					'</div>',
				'</div>'
			].join('')).appendTo(LAYER);

			this.$ready = true;

			this.$doms = {
				'body'     : tooltip,
				'content'  : $('.M-tooltipContent', tooltip),
				'text'     : $('.M-tooltipContentText', tooltip),
				'arrowUp'  : $('.M-tooltipArrowUp', tooltip),
				'arrowDown': $('.M-tooltipArrowDown', tooltip)
			}
		},

		/**
		 * 设置参数
		 */
		setParam: function(param) {
			var c = this.getConfig();
			c.refer = param.refer || null;
			c.arrow = param.arrow || null;
			c.type = param.type || 'warning';
			c.arrowOffset = param.arrowOffset || 0;
			c.offsetLeft = param.offsetLeft || 0;
			c.offsetTop = param.offsetTop || 0;
			c.content = param.content || T('这是一条提示');
			c.width = param.width || 0;
			c.height = param.height || 0;
			return this;
		},

		/**
		 * 设置提示层参数
		 */
		setTip: function(param) {
			this.setParam(param);

			var c = this.getConfig();
			if (this.$status === 'show') {
				return false;
			}

			// 设置提示内容宽高
			if (c.width) {
				this.$doms.content.width(c.width);
			}
			if (c.height) {
				this.$doms.content.height(c.height);
			}

			// 带箭头的tooltip
			if (c.arrow) {
				// 设置提示信息
				this.$doms.text.html(c.content);

				// 确定提示框位置
				var toolHeight = this.$doms.body.removeClass('absCenter').outerHeight();
				var posElm = c.refer.offset();
				this.$doms.body.css({
					'left': posElm.left + c.offsetLeft,
					'top' : posElm.top - toolHeight + c.offsetTop
				});
				this.$doms.content.removeClass('success warning normal');

				// 确定箭头位置
				switch(c.arrow) {
					// 向上的箭头offset只能配置left
					case 'top':
						this.$doms.arrowUp.show().siblings('.arrow').hide();
						if (c.arrowOffset) {
							this.$doms.arrowUp.css('left', c.arrowOffset);
						}
					break;
					// 向下的箭头offset只能配置left
					case 'bottom':
						this.$doms.arrowDown.show().siblings('.arrow').hide();
						if (c.arrowOffset) {
							this.$doms.arrowDown.css('left', c.arrowOffset);
						}
					break;
					// 向左的箭头offset只能配置top
					case 'left':
					break;
					// 向右的箭头offset只能配置top
					case 'right':
					break;
				}
			}
			// 居中页面的tooltip
			else {
				var icon = '';
				var client = util.getClient();

				this.$doms.arrowUp.hide();
				this.$doms.arrowDown.hide();

				switch (c.type) {
					case 'success':
						icon = '<i class="fa fa-check-circle mr3 icon"></i>';
					break;
					case 'warning':
						icon = '<i class="fa fa-exclamation-circle mr3 icon"></i>';
					break;
					case 'normal':
						icon = '<i class="fa fa-info-circle mr3 icon"></i>';
					break;
				}
				// 设置提示信息
				this.$doms.text.html(icon + c.content);

				this.$doms.content.css({
					'width'      : 'auto',
					'height'     : 'auto'
				}).addClass(c.type);

				this.$doms.body.css({
					'left'       : client.width / 2,
					'top'        : client.height / 2,
					'margin-left': this.$doms.body.outerWidth() / -2,
					'margin-top' : this.$doms.body.outerHeight() / -2
				}).addClass('absCenter');

			}

			this.show();
		},

		/**
		 * 显示提示
		 */
		show: function() {
			var self = this;
			var doc = this.$doc;

			LAYER.show();
			this.$status = 'show';
			sugar.animate.play(this.$doms.body, 'fadeIn', 'fast');

			// 触发隐藏tooltip事件
			doc.bind('click.other', this.eventTriggerHide.bind(this));
			doc.bind('scroll.other', this.eventTriggerHide.bind(this));
			doc.bind('keydown.other', this.eventTriggerHide.bind(this));

			// 自动隐藏
			this.$timer = setTimeout(function() {
				// 异步之后有可能已经是隐藏状态了
				if (self.$status === 'show') {
					self.hide();
				}
			}, this.getConfig('timeout'));
		},

		/**
		 * 隐藏提示
		 */
		hide: function() {
			var self = this;
			var doc = this.$doc;

			clearTimeout(this.$timer);

			doc.unbind('click.other');
			doc.unbind('scroll.other');
			doc.unbind('keydown.other');

			sugar.animate.play(this.$doms.body, 'fadeOut', 'fast', function() {
				self.$status = 'hide';
				LAYER.hide();
			});
		},

		/**
		 * 在外部设置timeStamp，用于外部事件触发时不隐藏tooltip
		 */
		setTimeStamp: function(timeStamp) {
			this.$timeStamp = timeStamp;
			return this;
		},

		/**
		 * 触发隐藏tooltip所有事件：对document的点击、滚动、键盘事件
		 */
		eventTriggerHide: function(evt) {
			if (this.$timeStamp && (this.$timeStamp !== evt.timeStamp)) {
				this.hide();
			}
		}
	};
	module.exports = Tooltip.init();
});