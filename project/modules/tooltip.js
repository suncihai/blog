/**
 * [悬浮提示框模块]
 */
define(function(require, exports) {
	var $ = require('jquery');
	var app = require('app');
	var util = require('util');
	var layout = require('layout');
	var POPUP = layout.getDOM('POPUP');

	// 带三角的提示框
		/**
		 tooltip.setTip({
			'refer': jqueryDom,
			'arrow': {'position': 'bottom'},
			'offset': {'left': 0, 'top': -45},
			'content': 'some text here',
			'width': 100
		});
		 */
	// 剧中于页面的矩形提示框
		/**
		 tooltip.setTip({
			'refer': null,
			'arrow': false,
			'offset': null,
			'content': 'some text here',
			'width': 100
		});
		 */
	var Tooltip = {
		init: function(config) {
			this.$timeout = 3000; // 显示3秒自动隐藏
			this.$status = 'hide';
			// 默认配置
			this.$refer = null; // 参考元素
			this.$arrow = {'position': 'bottom'}; // 箭头的位置
			this.$offset = {'left': 0, 'top': 0}; // 偏移补差
			this.$content = ''; // 提示文字
			this.$width = 0; // 自定义宽度
			this.$height = 0; // 自定义高度
			this.build();
			return this;
		},

		build: function() {
			if (POPUP.has('.M-tooltip').length) {
				return false;
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
			].join('')).appendTo(POPUP);

			this.$doms = {
				'body'      : tooltip,
				'content'   : $('.M-tooltipContent', tooltip),
				'text'      : $('.M-tooltipContentText', tooltip),
				'arrowUp'   : $('.M-tooltipArrowUp', tooltip),
				'arrowDown' : $('.M-tooltipArrowDown', tooltip)
			}
		},

		// 设置参数
		setParam: function(param) {
			this.$refer = param.refer || null;
			this.$arrow = param.arrow || null;
			this.$offset = param.offset || null;
			this.$content = param.content || T('提示文字');
			this.$width = param.width || 0;
			this.$height = param.height || 0;
			return this;
		},

		// 设置提示层参数
		setTip: function(param) {
			this.setParam(param);
			if (this.$status === 'show') {
				return false;
			}
			// 设置提示文字
			this.$doms.text.text(this.$content);

			// 设置提示框宽高
			if (this.$width) {
				this.$doms.content.width(this.$width);
			}
			if (this.$height) {
				this.$doms.content.height(this.$height);
			}

			// 带箭头的tooltip
			if (this.$arrow) {
				// 确定提示框位置
				var toolHeight = this.$doms.body.outerHeight();
				var posElm = this.$refer.offset();
				this.$doms.body.css({
					'left': posElm.left + this.$offset.left,
					'top': posElm.top - toolHeight + this.$offset.top
				});

				// 确定箭头位置
				var arrow = this.$arrow;
				switch(arrow.position) {
					// 向上的箭头offset只能配置left
					case 'top':
						this.$doms.arrowUp.show().siblings('.arrow').hide();
						if (arrow.offset) {
							this.$doms.arrowUp.css('left', arrow.offset);
						}
					break;
					// 向下的箭头offset只能配置left
					case 'bottom':
						this.$doms.arrowDown.show().siblings('.arrow').hide();
						if (arrow.offset) {
							this.$doms.arrowDown.css('left', arrow.offset);
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
				var client = util.getClient();
				this.$doms.body.css({
					'left': client.width/2,
					'top': client.height/2,
					'margin-left': -this.$doms.content.outerWidth()/2,
					'margin-top': -this.$doms.content.outerHeight()/2
				});
			}

			this.show();
		},

		// 显示提示
		show: function() {
			var self = this;
			POPUP.show();
			self.$status = 'show';
			app.animate.play(self.$doms.body, 'fadeIn', 'fast');

			// 触发隐藏tooltip事件
			app.event.bind($(document), 'click.other', self.eventTriggerHide, self);
			app.event.bind($(document), 'scroll.other', self.eventTriggerHide, self);
			app.event.bind($(document), 'keydown.other', self.eventTriggerHide, self);

			// 自动隐藏
			self.$timer = setTimeout(function() {
				// 异步之后有可能已经是隐藏状态了
				if (self.$status === 'show') {
					self.hide();
				}
			}, self.$timeout);
		},

		// 隐藏提示
		hide: function() {
			var self = this;
			clearTimeout(this.$timer);
			app.event.unbind($(document), 'click.other');
			app.event.unbind($(document), 'scroll.other');
			app.event.unbind($(document), 'keydown.other');
			app.animate.play(self.$doms.body, 'fadeOut', 'fast', function() {
				self.$status = 'hide';
				POPUP.hide();
			});
		},

		// 设置timeStamp
		setTimeStamp: function(timeStamp) {
			this.$timeStamp = timeStamp;
			return this;
		},

		// 触发隐藏tooltip所有事件
		eventTriggerHide: function(evt) {
			if (this.$timeStamp && this.$timeStamp !== evt.timeStamp) {
				this.hide();
			}
			return false;
		}
	}
	exports.tooltip = Tooltip;
});