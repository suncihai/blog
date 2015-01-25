/**
 * [头部模块(LOGO、导航、快捷菜单)]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout');
	var C = require('@core/config');

	exports.init = function( config ) {
		this.$config = config || {};
	}

	// 创建头部容器
	function buildHeader( target, ) {
		var html = [
			'<div class="M-head">',
				'<div class="M-headLogo"/>',
				'<div class="M-headNav"/>',
				'<div class="M-headTool"/>',
			'</div>'
		].join('');
	}

	// LOGO
	var Logo = function( src, size ) {
		this.src = src || '';
		this.size = size || {};
	}
	Logo.prototype = {
		constructor : Logo,
		// 创建LOGO布局
		createLogo: function( target, class ) {
			var self = this;
			var width = self.size['width'], height = self.size['height'];
			var logo = $('<img src="'+ self.src +'"/>');
			if( width && height ) {
				logo.css({
					'width': width,
					'height': height
				});
			}
			logo.appendTo( target );
			return self;
		}
	}
});