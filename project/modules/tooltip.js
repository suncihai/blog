/**
 * [悬浮提示框模块]
 */
define(function( require, exports ) {
	var $ = require('jquery');
	var app = require('app');
	var layout = require('layout').base;
	var POPUP = layout.getDOM('POPUP');

	// 基本的矩形提示框
	var Base = {}
	exports.base = Base;

	// 带三角的提示框
	var Tooltip = {
		/**
		 {
			$('div'),
			{
				'position': 'bottom',
				'offset': 20
			},
			{
				'left': 2,
				'top': 5
			}
			'这是提示信息',
			150,
			50
		 }
		 */
		init: function( config ) {
			this.$timeout = 3000; // 显示3秒自动隐藏
			this.$ready = false;
			this.$status = 'hide';
			// 默认配置
			this.$refer = null; // 参考元素
			this.$arrow = {'position': 'bottom'}; // 箭头的位置
			this.$offset = {'left': 0, 'top': 0}; // 偏移补差
			this.$content = ''; // 提示文字
			this.$width = 0; // 自定义宽度
			this.$height = 0; // 自定义高度
			this.$name = ''; // 提示层名称(防止重复弹出)
			this.build();
			return this;
		},

		build: function() {
			if ( this.$ready ) {
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
			].join('')).appendTo( POPUP.empty() );

			this.$doms = {
				'body'      : tooltip,
				'content'   : $('.M-tooltipContent', tooltip),
				'text'      : $('.M-tooltipContentText', tooltip),
				'arrowUp'   : $('.M-tooltipArrowUp', tooltip),
				'arrowDown' : $('.M-tooltipArrowDown', tooltip)
			}
			this.$ready = true;
		},

		setParam: function( param ) {
			this.$refer = param.refer;
			if ( param.arrow ) {
				this.$arrow = param.arrow;
			}
			if ( param.offset ) {
				this.$offset = param.offset;
			}
			this.$content = param.content;
			this.$width = param.width;
			this.$height = param.height;
			this.$name = param.name;
			return this;
		},

		// 设置提示层参数
		setTip: function( param ) {
			this.setParam( param );
			if ( this.$status === 'show' ) {
				return false;
			}
			// 设置提示文字
			this.$doms.text.text( this.$content );

			// 设置提示框宽高
			if ( this.$width ) {
				this.$doms.content.width( this.$width );
			}
			if ( this.$height ) {
				this.$doms.content.height( this.$height );
			}

			// 根据参照物this.$refer提示框的位置
			var toolHeight = this.$doms.body.outerHeight();
			var posElm = this.$refer.offset();
			this.$doms.body.css({
				'left': posElm.left + this.$offset.left,
				'top': posElm.top - toolHeight + this.$offset.top
			});

			// 箭头方向和位置
			var arrow = this.$arrow;
			switch( arrow.position ) {
				// 向上的箭头offset只能配置left
				case 'top':
					this.$doms.arrowUp.show().siblings('.arrow').hide();
					if ( arrow.offset ) {
						this.$doms.arrowUp.css('left', arrow.offset);
					}
				break;
				// 向下的箭头offset只能配置left
				case 'bottom':
					this.$doms.arrowDown.show().siblings('.arrow').hide();
					if ( arrow.offset ) {
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
			this.show();
		},

		// 显示提示
		show: function() {
			var self = this;
			// 显示弹层并设置状态
			POPUP.show();
			self.$status = 'show';
			app.animate.play(this.$doms.text, 'shake');
			app.animate.play(this.$doms.body, 'fadeIn', 1);

			// 触发隐藏tooltip事件
			app.event.bind( $(document), 'click.other', this.eventTriggerHide, this );
			app.event.bind( $(document), 'scroll.other', this.eventTriggerHide, this );
			app.event.bind( $(document), 'keydown.other', this.eventTriggerHide, this );

			// 自动隐藏
			// setTimeout(function() {
			// 	// 异步之后有可能已经被隐藏了
			// 	if ( self.$status === 'show' ) {
			// 		self.hide();
			// 	}
			// }, self.$timeout);
		},

		// 设置timeStamp
		setTimeStamp: function( timeStamp ) {
			this.$timeStamp = timeStamp;
			return this;
		},

		eventTriggerHide: function( evt ) {
			if ( this.$timeStamp && this.$timeStamp !== evt.timeStamp ) {
				this.hide();
			}
			return false;
		},

		// 隐藏提示
		hide: function() {
			var self = this;
			app.event.unbind($(document), 'click.other');
			app.event.unbind($(document), 'scroll.other');
			app.event.unbind($(document), 'keydown.other');
			app.animate.play( self.$doms.body, 'fadeOut', 1, function() {
				self.$status = 'hide';
				POPUP.hide();
			});
		}
	}
	exports.tooltip = Tooltip;

});