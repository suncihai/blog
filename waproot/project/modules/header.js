/**
 * [头部模块(LOGO、导航、搜索框)]
 */
define(function(require, exports, module) {
	var app = require('app');
	var $ = require('jquery');
	var c = app.getConfig();
	var util = require('util');

	var Header = {
		// 初始化方法
		init: function(config, callback) {
			this.$ = {};
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
					// 顶部
					'<div class="M-headTop">',
						'<div class="M-headTopOption">',
							'<i class="fa fa-reorder"/>',
						'</div>',
						'<div class="M-headTopLogo">',
							'<a href="/blog/" class="logoAnchor">',
								'&lt;TANGBC/&gt;',
							'</a>',
						'</div>',
						'<div class="M-headTopTool"/>',
					'</div>',
					// 导航
					'<div class="M-headNav">',
						'<i class="fa fa-sort-up triangle"/>',
					'</div>',
				'</div>'
			].join(''));

			var cssStyle = config.css;
			if (cssStyle) {
				head.css(cssStyle);
			}

			var doms = this.$doms = {
				'option' : $('.M-headTopOption', head),
				'logo'   : $('.M-headTopLogo', head),
				'nav'    : $('.M-headNav', head),
				'tool'   : $('.M-headTopTool', head)
			}

			// 创建导航对象
			var nav = new Navigator(c.nav);
			nav.putTo(doms.nav);

			// 创建工具
			this.buildTool();

			// 触摸选项显示导航
			app.event.bind(this.$doms.option, 'touchend', this.eventTouchOption, this);

			app.event.bind(this.$doms.nav, 'touchend', this.eventTouchNav, this);

			// 缓存对象
			this.$ = {
				'nav': nav
			}
			head.appendTo(target);

			// 创建完成后回调(@todo: 去掉,这里没必要回调)
			if (util.isFunc(this.callback)) {
				this.callback();
			}
			return this;
		},

		// 触摸导航
		eventTouchNav: function(evt) {
			this.$timeStamp = evt.timeStamp;
		},

		// 选项触摸事件
		eventTouchOption: function(evt, elm) {
			this.$timeStamp = evt.timeStamp;
			var nav = this.$doms.nav;
			nav.show();
			// 为导航隐藏绑定document事件
			app.event.bind($(document), 'touchend.oblank', this.eventTouchOBlank, this);
			return false;
		},

		// 触摸空白处(处理非选项图标)
		eventTouchOBlank: function(evt, elm) {
			if (evt.timeStamp !== this.$timeStamp) {
				this.$doms.nav.hide();
				app.event.unbind($(document), 'touchend.oblank');
			}
			return false;
		},

		// 获取header的子对象(模块)
		getChild: function(childName) {
			var mods = this.$;
			return arguments.length === 1 ? mods[childName] : mods;
		},

		// 创建右侧工具栏(暂时只有搜索框)
		buildTool: function() {
			var html = $([
				'<div class="M-headTopToolSearch">',
					'<input type="text" class="searchIpt animated" placeholder="'+ T('请输入关键字') +'">',
					'<div class="searchBtn" title="'+ T('搜索文章') +'">',
						'<i class="fa fa-search"/>',
					'</div>',
				'</div>'
			].join(''));
			html.appendTo(this.$doms.tool);
			this.$doms.tool.input = $('.searchIpt', html);
			this.$doms.tool.btn = $('.searchBtn', html);

			app.event.bind(this.$doms.tool.btn, 'touchend.search', this.eventTouchSearch, this);
		},

		// 点击搜索框
		eventTouchSearch: function(evt, elm) {
			this.$timeStamp = evt.timeStamp;
			// 隐藏logo
			this.$doms.logo.hide();
			// 输入框的值
			var input = this.$doms.tool.input;
			var val = input.val();
			// 搜索按钮
			this.$doms.tool.btn.addClass('act');

			// 点击空白处收起INPUT
			app.event.bind($(document), 'touchend.sblank', this.eventTouchSBlank, this);

			// 按下回车键响应搜索操作
			app.event.bind($(document), 'keydown.search', this.eventKeydownSearch, this);

			// 搜索框展现动画
			app.animate.play(input.show().removeClass('inputInit'), 'inputReady');

			if (!val) {
				input.focus();
			}
			else {
				if (evt.target.tagName !== 'INPUT') {
					this.searching(val);
				}
			}
			return false;
		},

		// 跳转到搜索页面
		searching: function(val) {
			app.controller.go('search?word=' + val);
		},

		// 响应回车键搜索
		eventKeydownSearch: function(evt) {
			if (evt.keyCode === 13) {
				var val = this.$doms.tool.input.val();
				if (val) {
					this.searching(val);
				}
			}
			return false;
		},

		// 触摸空白处(处理非搜索图标)
		eventTouchSBlank: function(evt) {
			if (this.$timeStamp !== evt.timeStamp) {
				this.hideSearchInput();
			}
			return false;
		},

		// 隐藏搜索框+解除事件的绑定
		hideSearchInput: function() {
			var input = this.$doms.tool.input;
			var logo = this.$doms.logo;
			var btn = this.$doms.tool.btn;

			// 搜索按钮隐藏动画
			app.animate.play(input.val('').removeClass('inputReady'), 'inputInit', function() {
				input.hide();
				logo.show();
				btn.removeClass('act');
			});

			// 解除绑定
			app.event.unbind($(document), 'touchend.sblank');
			app.event.unbind($(document), 'keydown.search');
		}
	}
	module.exports = Header;

	// Navigator 导航
	function Navigator(options) {
		this.options = options || {};
	}
	Navigator.prototype = {
		constructor: Navigator,
		// 创建导航布局
		buildNavDOM: function() {
			var options = this.options;
			var navs = [];
			util.each(options, function(item, idx) {
				navs.push([
					'<li>',
						'<a href="' + item.link + '" data-id="' + idx + '">' + T(item.name) + '</a>',
					'</li>'
				].join(''));
			});
			this.$dom = $('<ul>' + navs.join('') + '</ul>');
			return this.$dom;
		},
		// 导航的激活状态
		updateNav: function(link) {
			var self = this;
			var options = self.options;
			// 激活link导航
			if (link) {
				link = '#' + link;
				util.each(options, function(item, idx) {
					if (item.link === link) {
						self.$dom
							.find('a[data-id=' + idx + ']')
							.addClass('act')
							.parent()
							.siblings()
							.find('a')
							.removeClass('act');
					}
				});
			}
			// 全部未激活
			else {
				self.$dom.find('a').removeClass('act');
			}
		},
		putTo: function(target) {
			var navLayout = this.buildNavDOM();
			navLayout.appendTo(target);
			return this;
		}
	}
});