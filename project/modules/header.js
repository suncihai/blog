/**
 * [头部模块(LOGO、导航、快捷菜单)]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout');
	var C = require('@core/config');

	exports.init = function( config ) {
		this.config = config || {};
		var target = this.config['target'];
		var head = $([
			'<div class="M-head">',
				'<div class="M-headLogo"/>',
				'<div class="M-headNav"/>',
				'<div class="M-headTool"/>',
			'</div>'
		].join(''));
		var doms = {
			'logo': $('.M-headLogo', head),
			'nav': $('.M-headNav', head),
			'tool': $('.M-headTool', head)
		}
		// 创建LOGO对象
		var logo = new Logo('resources/images/logo.png', {'width': 160, 'height': 40});
		// logo.putTo( doms.logo );
		// 创建导航对象
		var nav = new Nav( C.nav );
		nav.putTo( doms.nav );
		// 缓存对象
		this.$ = {
			'logo': logo,
			'nav': nav
		}
		head.appendTo( target );
		return this;
	}

	// 更新导航激活状态
	exports.updateNav = function( link ) {
		this.$['nav'].updateNav( link );
		return this;
	}

	// LOGO构造函数
	var Logo = function( src, size ) {
		this.src = src || '';
		this.size = size || {};
	}
	Logo.prototype = {
		constructor : Logo,
		// 创建LOGO布局
		buildLogo: function() {
			var width = this.size['width'], height = this.size['height'];
			var logo = this.$dom = $('<img src="'+ this.src +'"/>');
			if( width && height ) {
				logo.css({
					'width': width,
					'height': height
				});
			}
			return logo;
		},
		putTo: function( target ) {
			var dom = this.buildLogo();
			dom.appendTo( target );
			return this;
		}
	}

	// Nav构造函数
	var Nav = function( options ) {
		this.options = options || {};
	}
	Nav.prototype = {
		constructor: Nav,
		// 创建导航布局
		buildNavDOM: function() {
			var options = this.options;
			var dom = this.$dom = $('<div class="M-nav"/>');
			var navs = [];
			$.each( options, function( idx, item ) {
				navs.push([
					'<li>',
						'<a href="#' + item.link + '" data-id="' + idx + '">' + item.name + '</a>',
					'</li>'
				].join(''));
			});
			dom.append( '<ul>' + navs.join('') + '</ul>' );
			return dom;
		},
		// 导航的激活状态
		updateNav: function( link ) {
			var options = this.options;
			var self = this;
			$.each( options, function( idx, item ) {
				if( item.link === link ) {
					self.$dom
						.find('a[data-id=' + idx + ']')
						.addClass('act')
						.parent()
						.siblings()
						.find('a')
						.removeClass('act');
				}
			});
		},
		putTo: function( target ) {
			var navLayout = this.buildNavDOM();
			navLayout.appendTo( target );
			return this;
		}
	}

	// Tool构造函数
	var Tool = function() {};
});