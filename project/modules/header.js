/**
 * [头部模块(LOGO、导航、搜索框)]
 */
define(function(require, exports, module) {
	var sugar = require('sugar');
	var util = sugar.util;
	var $ = sugar.jquery;
	var headRoom = require('@plugins/headroom/headroom');

	var Header = sugar.Container.extend({
		init: function(config) {
			config = sugar.cover(config, {
				'class'   : 'M-header',
				'tag'     : 'header',
				'template': 'template/modules/header.html',
				'vModel'  : {
					// logo文字
					'logo': '<TANGBC/>',
					// 导航数组
					'navs': []
				}
			});
			this.$doc = $(document);
			this.Super('init', arguments);
		},

		/**
		 * 布局视图初始化完成
		 */
		viewReady: function() {
			var el = this.getDOM();
			var c = this.getConfig();

			// 创建导航vm数据
			var items = sugar.config('navs') || [];
			var navs = this.createVmItems(items);
			this.vm.set('navs', navs);

			// DOM缓存
			this.$doms = {
				'nav'   : el.find('.M-headerNav'),
				'search': el.find('.M-headerToolSearch'),
				'button': el.find('.searchBtn'),
				'input' : el.find('.searchIpt')
			};

			// 点击搜索按钮
			this.proxy(this.$doms.search, 'click.search', this.eventClickSearch);

			// 启用headroom插件
			var target = c.target;
			this.initHeadRoom(target.addClass('head-fixed').get(0));
		},

		/**
		 * 构建vm数据
		 */
		createVmItems: function(items) {
			var navs = [];
			util.each(items, function(item) {
				navs.push({
					'text': item.name,
					'link': item.link,
					'act' : false
				});
			});
			return navs;
		},

		/**
		 * 点击搜索框
		 */
		eventClickSearch: function(evt, elm) {
			var doc = this.$doc;
			var input = this.$doms.input;
			var val = input.val();

			this.$doms.button.addClass('act');
			this.$timeStamp = evt.timeStamp;

			// 点击空白处收起INPUT
			this.bind(doc, 'mouseup.blank_search', this.eventClickBlank);
			// 按下回车键响应搜索操作
			this.bind(doc, 'keydown.search', this.eventKeydown);

			input.show().removeClass('inputInit').addClass('inputReady');

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

		/**
		 * 跳转到搜索页面
		 */
		searching: function(val) {
			if (val.length <= 1) {
				sugar.tooltip.setTip({
					'arrow'  : false,
					'tyoe'   : 'warning',
					'content': T('搜索内容不能少于两个字符~')
				});
				return false;
			}

			sugar.controller.go('search?word=' + val);
		},

		/**
		 * 响应回车键搜索
		 */
		eventKeydown: function(evt) {
			var val = this.$doms.input.val();
			if (evt.keyCode === 13) {
				if (val) {
					this.searching(val);
				}
			}
		},

		/**
		 * 点击空白处隐藏INPUT
		 */
		eventClickBlank: function(evt) {
			if (this.$timeStamp !== evt.timeStamp) {
				this.hideSearchInput();
			}
		},

		/**
		 * 隐藏搜索框，解除事件绑定
		 */
		hideSearchInput: function() {
			var doc = this.$doc;
			this.$doms.button.removeClass('act');
			this.$doms.input.val('').addClass('inputInit').removeClass('inputReady');

			// 解除绑定
			this.unbind(doc, 'click.blank_search');
			this.unbind(doc, 'keydown.search');
		},

		/**
		 * 启用headroom插件
		 */
		initHeadRoom: function(target) {
			var headroom = new headRoom(target, {
				'tolerance': {
					'up'  : 0,
					'down': 0
				},
				'offset': 200,
				'classes': {
					'initial' : 'animated',
					'pinned'  : 'slideInDown',
					'unpinned': 'slideOutUp'
				}
			});
			headroom.init();
		},

		/**
		 * 更新导航激活状态消息
		 */
		onUpdateNav: function(ev) {
			var navs = this.vm.get('navs');
			var name = ev.param;
			util.each(navs, function(nav) {
				nav.act = nav.link === '#' + name;
			});
		}
	});
	exports.base = Header;
});