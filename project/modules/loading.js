/**
 * [CSS3 loading模块]
 */
define(function( require, exports ){
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
		init: function( config ) {
			this.$config = config;
			this.$status = 'uncompleted';
			this.build();
			return this;
		},

		build: function() {
			var C = this.$config;
			var target = C.target;
			// html结构
			var dom = this.$dom = $([
				'<div class="M-threeRings">',
					'<div class="M-threeRingsItem ring1"/>',
					'<div class="M-threeRingsItem ring2"/>',
					'<div class="M-threeRingsItem ring3"/>',
				'</div>'
			].join('')).appendTo( target );

			this.$status = 'show';

			if( C.width ) {
				dom.width( C.width );
			}

			if( C.height ) {
				dom.height( C.height );
			}

			if( C.size ) {
				dom.find('.M-threeRingsItem').css({
					'width': C.size,
					'height': C.size
				});
			}

			if( C.class ) {
				dom.addClass( C.class );
			}

			if( C.autoHide ) {
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
		init: function( config ) {
			this.$config = config;
			this.$status = 'uncompleted';
			this.build();
			return this;
		},

		build: function() {
			var C = this.$config;
			var target = C.target;
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
			].join('')).appendTo( target );

			this.$status = 'show';

			if( C.width ) {
				dom.width( C.width );
			}

			if( C.height ) {
				dom.height( C.height );
			}

			if( C.size ) {
				dom.find('.spinner-container').css({
					'width': C.size,
					'height': C.size
				});
			}

			if( C.class ) {
				dom.addClass( C.class );
			}

			if( C.autoHide ) {
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

	exports.base = ThreeRings;
	exports.chrysanthemum = Chrysanthemum;
});