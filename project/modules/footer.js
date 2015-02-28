/**
 * [页脚模块]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var C = require('@core/config');
	var util = require('util');

	var Footer = {
		// 初始化方法
		init: function( config, callback ) {
			this.$config = config || {};
			this.callback = callback;
			this.build();
		},

		// 创建头部, target: 配置中头部创建的目标DOM
		build: function() {
			var config = this.$config;
			var target = config['target'];

			// DOM结构
			var foot = $([
				'<div class="M-footer">',
					config.content,
				'</div>'
			].join(''));
			foot.appendTo( target );

			var cssStyle = config.css;
			if( cssStyle ) {
				foot.css( cssStyle );
			}

			// 创建完成后回调
			if( util.isFunc( this.callback ) ) {
				this.callback.call( this, true );
			}
		}
	}
	exports.base = Footer;
});