/**
 * [页脚模块]
 */
define(function(require, exports, module) {
	var app = require('app');
	// var c = app.getConfig();
	var $ = require('jquery');
	var util = require('util');

	var Footer = {
		// 初始化方法
		init: function(config, callback) {
			this.$config = config || {};
			this.callback = callback;
			this.build();
		},

		// 创建页脚, target: 配置中页脚创建的目标DOM
		build: function() {
			var config = this.$config;
			var target = config['target'];

			// DOM结构
			var foot = $([
				'<div class="blogWidth center">',
					'<div class="M-footer">',
						'<div class="M-footerCopy">'+ config.content +'</div>',
						// 多语言切换
						'<div class="M-footerLang">',
							'<ul class="ulLang"/>',
						'</div>',
						// 图标信息
						'<div class="M-footerInfo">',
							'<a class="M-footerInfoSource" href="https://github.com/tangbc/blog" title="'+ T('本站源码') +'" target="_blank">',
								'<i class="fa fa-github"/>',
							'</a>',
						'</div>',
					'</div>',
				'</div>'
			].join(''));
			foot.appendTo(target.hide());

			// 切换列表
			this.$lang = {
				'zhCN': '<li class="cn" data-type="zhCN" title="'+ T('简体') +'"></li>',
				'zhHK': '<li class="hk" data-type="zhHK" title="'+ T('繁体') +'"></li>',
				'enUS': '<li class="us" data-type="enUS" title="'+ T('英文') +'"></li>'
			};

			// DOM缓存
			this.$doms = {
				'lang': foot.find('.ulLang')
			}

			// 设置语言的默认状态
			this.setLangStatus();

			var cssStyle = config.css;
			if (cssStyle) {
				foot.css(cssStyle);
			}

			// 创建完成后回调
			if (util.isFunc(this.callback)) {
				this.callback();
			}
		},

		// 设置语言的默认状态
		setLangStatus: function() {
			var clang = app.cookie.get('lang');
			var dom = this.$doms.lang;
			// 语言数组
			var langs = [this.$lang[clang]];
			// 排列语言顺序,选中的在中间
			for (var la in this.$lang) {
				var tlang = this.$lang[la];
				if (la !== clang) {
					switch (langs.length) {
						case 1:
							langs.unshift(tlang);
						break;
						case 2:
							langs.push(tlang);
						break;
					}
				}
			}

			dom.append(langs.join(''))
				.find('li[data-type="'+ clang +'"]')
				.show()
				.siblings('li')
				.hide();

			// 绑定事件
			app.event.proxy(dom, 'click', 'li', this.eventSwitchLang, this);
		},

		eventSwitchLang: function(evt, elm) {
			var lang = $(elm).attr('data-type');
			this.$timeStamp = evt.timeStamp;

			// 点击空白处收起语言选择
			app.event.bind($(document), 'click.blank', this.eventClickBlank, this);

			if (lang === app.cookie.get('lang')) {
				this.$doms.lang.find('li').fadeIn();
				return false;
			}
			else {
				app.cookie.set('lang', lang);
				app.lang.load(lang);
				window.location.reload();
			}
			return false;
		},

		eventClickBlank: function(evt) {
			var clang = app.cookie.get('lang');
			var dom = this.$doms.lang;

			if (evt.timeStamp !== this.$timeStamp) {
				dom.find('li[data-type="'+ clang +'"]').show().siblings('li').fadeOut();
				// 解除绑定
				app.event.unbind($(document), 'click.blank');
			}
			return false;
		},

		show: function() {
			this.$config.target.show();
		},

		hide: function() {
			this.$config.target.hide();
		}
	}
	module.exports = Footer;
});