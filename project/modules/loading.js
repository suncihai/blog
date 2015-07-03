/**
 * [CSS3 loading模块]
 */
define(function(require, exports) {
	var $ = require('jquery');

	// 三个圆圈并排Loading
	var ThreeRings = {
		/*
		 * config: {
			'target':, // 目标容器
			'width': , // 长度
			'size': , // 圆圈尺寸
			'autoHide': , // 创建完自动隐藏
			'class': // 额外的class
		 }
		 */
		init: function(config) {
			this.$config = config;
			this.$status = 'uncompleted';
			this.build();
			return this;
		},

		build: function() {
			var c = this.$config;
			var target = c.target;
			// html结构
			var dom = this.$dom = $([
				'<div class="M-threeRings">',
					'<div class="M-threeRingsItem ring1"/>',
					'<div class="M-threeRingsItem ring2"/>',
					'<div class="M-threeRingsItem ring3"/>',
				'</div>'
			].join('')).appendTo(target);

			this.$status = 'show';

			if (c.width) {
				dom.width(c.width);
			}

			if (c.height) {
				dom.height(c.height);
			}

			if (c.size) {
				dom.find('.M-threeRingsItem').css({
					'width': c.size,
					'height': c.size
				});
			}

			if (c.class) {
				dom.addClass(c.class);
			}

			if (c.autoHide) {
				this.hide();
				this.$status = 'hide';
			}
		},

		hide: function() {
			this.$dom.hide();
			this.$status = 'hide';
		},

		show: function() {
			this.$dom.show();
			this.$status = 'show';
		}
	}

	// 经典菊花Loading
	var Chrysanthemum = {
		/*
		 * config: {
			'target':, // 目标容器
			'width': , // 长度
			'scale': , // 整个图标的大小px
			'size': , // 小圆圈的大小px
			'autoHide': , // 创建完自动隐藏
			'class': // 额外的class
		 }
		 */
		init: function(config) {
			this.$config = config;
			this.$status = 'uncompleted';
			this.build();
			return this;
		},

		build: function() {
			var c = this.$config;
			var target = c.target;
			// html结构
			var dom = this.$dom = $([
				'<div class="M-chrysanthemum">',
					'<div class="spinner-container container1">',
						'<div class="circle1"/>',
						'<div class="circle2"/>',
						'<div class="circle3"/>',
						'<div class="circle4"/>',
					'</div>',
					'<div class="spinner-container container2">',
						'<div class="circle1"/>',
						'<div class="circle2"/>',
						'<div class="circle3"/>',
						'<div class="circle4"/>',
					'</div>',
					'<div class="spinner-container container3">',
						'<div class="circle1"/>',
						'<div class="circle2"/>',
						'<div class="circle3"/>',
						'<div class="circle4"/>',
					'</div>',
				'</div>'
			].join('')).appendTo(target);

			this.$status = 'show';

			if (c.width) {
				dom.width(c.width);
			}

			if (c.height) {
				dom.height(c.height);
			}

			// 设置整个loading图标的尺寸
			if (c.scale) {
				dom.find('.spinner-container').css({
					'width': c.scale,
					'height': c.scale
				});
			}

			// 设置每个小圆圈的尺寸
			if (c.size) {
				dom.find('.spinner-container > div').css({
					'width': c.size,
					'height': c.size
				});
			}

			if (c.class) {
				dom.addClass(c.class);
			}

			if (c.autoHide) {
				this.hide();
				this.$status = 'hide';
			}
		},

		hide: function() {
			this.$dom.hide();
			this.$status = 'hide';
		},

		show: function() {
			this.$dom.show();
			this.$status = 'show';
		}
	}

	exports.base = $.extend(true, {}, ThreeRings);
	exports.chrysanthemum = $.extend(true, {}, Chrysanthemum);
});