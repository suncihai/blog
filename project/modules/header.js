/**
 * [头部模块(LOGO、导航、快捷菜单)]
 */
define(function( require, exports ){
	var $ = require('jquery');
	var C = require('@core/config');
	var util = require('util');
	var HeadRoom = require('@plugins/headroom/headroom').base;

	var Header = {
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
			var head = $([
				'<div class="M-head">',
					'<div class="M-headLogo fl"/>',
					'<div class="M-headNav fl"/>',
					'<div class="M-headTool fr"/>',
				'</div>'
			].join(''));

			var cssStyle = config.css;
			if( cssStyle ) {
				head.css( cssStyle );
			}

			var doms = {
				'logo': $('.M-headLogo', head),
				'nav': $('.M-headNav', head),
				'tool': $('.M-headTool', head)
			}

			// 创建LOGO对象
			var src = config.type === 'index' ? 'resources/images/indexlogo.png' : 'resources/images/navlogo.png';
			var logo = new Logo(src);
			logo.putTo( doms.logo );

			// 创建导航对象
			var nav = new Navigator( C.nav );
			nav.putTo( doms.nav );

			// 缓存对象
			this.$mods = {
				'logo': logo,
				'nav': nav
			}
			head.appendTo( target.show() );

			// 启用headroom插件
			if( config.headroom ) {
				var cfg = {
					'tolerance': {
						'up': 5,
						'down': 5
					},
					'offset': 200,
					'classes': {
					    'initial': 'animated',
					    'pinned': 'slideInDown',
					    'unpinned': 'fadeOutUp'
					}
				}
				var elm = target.addClass('head-fixed').get(0);
				var headroom = new HeadRoom( elm, cfg );
				headroom.init();
			}

			// 创建完成后回调
			if( util.isFunc( this.callback ) ) {
				this.callback.call( this, true );
			}
			return this;
		},

		// 获取header的子对象(模块)
		getChild: function( childName ) {
			var mods = this.$mods;
			return arguments.length === 1 ? mods[childName] : mods;
		}
	}
	exports.base = Header;

	// LOGO 站标
	function Logo( src, size ) {
		this.src = src || '';
		this.size = size || {};
	}
	Logo.prototype = {
		constructor : Logo,
		// 创建LOGO布局
		buildLogo: function() {
			var width = this.size['width'], height = this.size['height'];
			var logo = '<img src="'+ this.src +'"/>';
			if( width && height ) {
				logo.css({
					'width': width,
					'height': height
				});
			}
			var dom = $([
				'<a href="/blog/" class="logoAnchor">',
					logo,
				'</a>'
			].join(''));
			return dom;
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
						'<a href="' + item.link + '" data-id="' + idx + '">' + item.name + '</a>',
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
			if( link ) {
				link = '#' + link;
			}
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
	Tool.prototype = {};
});