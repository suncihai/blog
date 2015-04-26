/**
 * [头部模块(LOGO、导航、快捷菜单)]
 */
define(function( require, exports ){
	var app = require('app');
	var $ = require('jquery');
	var c = app.getConfig();
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
					'<div class="M-headLogo">',
						'<a href="/blog/" class="logoAnchor">',
							'&lt;TANGBC/&gt;',
						'</a>',
					'</div>',
					'<div class="M-headNav"/>',
					'<div class="M-headTool"/>',
				'</div>'
			].join(''));

			var cssStyle = config.css;
			if( cssStyle ) {
				head.css( cssStyle );
			}

			var doms = this.$doms = {
				'logo': $('.M-headLogo', head),
				'nav': $('.M-headNav', head),
				'tool': $('.M-headTool', head)
			}

			// 创建导航对象
			var nav = new Navigator( c.nav );
			nav.putTo( doms.nav );

			// 创建工具
			this.buildTool();

			// 缓存对象
			this.$mods = {
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
					    'pinned': 'flipInX',
					    'unpinned': 'flipOutX'
					}
				}
				var elm = target.addClass('head-fixed').get(0);
				var headroom = new HeadRoom( elm, cfg );
				this.$mods.headroom = headroom;
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
		},

		buildTool: function() {
			var html = $([
				'<div class="M-headToolSearch">',
					'<input type="text" class="searchIpt animated" placeholder="请输入关键字">',
					'<div class="searchBtn" title="搜索文章">',
						'<div class="circle"/>',
						'<div class="line"/>',
					'</div>',
				'</div>'
				// '<div class="M-headToolOption">',
				// 	'<div class="btn">',
				// 		'<span/>',
				// 		'<span/>',
				// 		'<span/>',
				// 	'</div>',
				// '</div>'
			].join(''));
			html.appendTo( this.$doms.tool );
			this.$doms.tool.input = $('.searchIpt', html);

			app.event.proxy( html, 'click.search', this.eventClickSearch, this );
		},

		// 点击搜索框
		eventClickSearch: function( evt, elm ) {
			var input = this.$doms.tool.input;
			var val = input.val();
			this.$timeStamp = evt.timeStamp;
			// 点击空白处收起INPUT
			app.event.bind( $(document), 'click.blank', this.eventClickBlank, this );
			// 按下回车键响应搜索操作
			app.event.bind( $(document), 'keydown.search', this.eventKeydownSearch, this );
			input.show().removeClass('inputInit').addClass('inputReady');
			if( !val ) {
				input.focus();
			}
			else {
				if( evt.target.tagName !== 'INPUT' ) {
					this.searching( val );
				}
			}
			return false;
		},

		// 跳转到搜索页面
		searching: function( val ) {
			app.controller.go('search?word=' + val);
		},

		// 响应回车键搜索
		eventKeydownSearch: function( evt ) {
			if( evt.keyCode === 13 ) {
				var val = this.$doms.tool.input.val();
				if( val ) {
					this.searching( val );
				}
			}
			return false;
		},

		// 点击空白处隐藏INPUT
		eventClickBlank: function( evt ) {
			if( this.$timeStamp !== evt.timeStamp ) {
				this.hideSearchInput();
			}
			return false;
		},

		// 隐藏搜索框+解除事件的绑定
		hideSearchInput: function() {
			var self = this;
			self.$doms.tool.input
				.val('')
				.addClass('inputInit')
				.removeClass('inputReady');
			// 解除绑定
			app.event.unbind( $(document), 'click.blank' );
			app.event.unbind( $(document), 'keydown.search' );
		}
	}
	exports.base = Header;

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
			util.each( options, function( item, idx ) {
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
});