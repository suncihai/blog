/**
 * [头部模块(LOGO、导航、快捷菜单)]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout');
	var C = require('@core/config');
	var HeadRoom = require('@plugins/headroom/headroom.min').base;

	exports.init = function( config ) {
		this.config = config || {};
		var target = this.config['target'];
		var head = $([
			'<div class="M-head">',
				'<div class="M-headLogo fl"/>',
				'<div class="M-headNav fl"/>',
				'<div class="M-headTool fr"/>',
			'</div>'
		].join(''));
		var cssStyle = this.config.css;
		if( cssStyle ) {
			head.css( cssStyle );
		}
		var doms = {
			'logo': $('.M-headLogo', head),
			'nav': $('.M-headNav', head),
			'tool': $('.M-headTool', head)
		}
		// 创建LOGO对象
		var logo = new Logo();
		logo.putTo( doms.logo );
		// 创建导航对象
		var nav = new Navigator( C.nav );
		nav.putTo( doms.nav );
		// 缓存对象
		this.$ = {
			'logo': logo,
			'nav': nav
		}
		head.appendTo( target );
		// 启用headroom插件
		(new HeadRoom( target.addClass('head-fixed').get(0), {
			'tolerance': {
				'up': 5,
				'down': 5
			},
			'offset': 200,
			'classes': {
			    'initial': 'animated',
			    'pinned': 'slideInDown',
			    'unpinned': 'fadeOutUp',
			    'top': '',
			    'notTop': ''
			}
		})).init();
		return this;
	}

	// 更新导航激活状态
	exports.updateNav = function( link ) {
		this.$['nav'].updateNav( link );
		return this;
	}

	// LOGO 站标
	function Logo( src, size ) {
		// this.src = src || '';
		// this.size = size || {};
	}
	Logo.prototype = {
		constructor : Logo,
		// 创建LOGO布局
		buildLogo: function() {
			// var width = this.size['width'], height = this.size['height'];
			// var logo = this.$dom = $('<img src="'+ this.src +'"/>');
			// if( width && height ) {
			// 	logo.css({
			// 		'width': width,
			// 		'height': height
			// 	});
			// }
			var logo = this.$dom = $([
				'<a href="/blog/" class="logoAnchor">',
					'<h1>TANGBC</h1>',
				'</a>'
			].join(''));
			return logo;
		},
		putTo: function( target ) {
			var dom = this.buildLogo();
			dom.appendTo( target );
			return this;
		}
	}

	// Navigator 导航
	function Navigator( options ) {
		this.options = options || {};
	}
	Navigator.prototype = {
		constructor: Navigator,
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