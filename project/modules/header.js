/**
 * [头部模块(LOGO、导航、快捷菜单)]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var layout = require('layout');
	var C = require('@core/config');

	/**
	 * init 头部初始化
	 * @param  {JSON} config   [配置参数,应有target、css]
	 * @return {Object}        [header]
	 */
	exports.init = function( config ) {
		this.config = config || {};
		var target = this.config['target'];
		var cssConfig = this.config['css'];
		var head = $([
			'<div class="M-head">',
				'<div class="M-headLogo fl">',
					'<h1><a href="/blog/" class="logoText">TANGBC</a></h1>',
				'</div>',
				'<div class="M-headNav fl"/>',
				'<div class="M-headTool fr"/>',
			'</div>'
		].join(''));
		// 配置有CSS要加上
		if( cssConfig ) {
			head.css( cssConfig )
		}
		// 创建导航对象
		var nav = new Nav( C.nav );
		nav.putTo( $('.M-headNav', head) );
		// 缓存对象
		this.$ = {
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