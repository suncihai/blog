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
						// 图标信息
						'<div class="M-footerInfo">',
							'<a class="M-footerInfoSource" href="https://github.com/tangbc/blog" title="'+ T('本站源码') +'" target="_blank">',
								'<i class="fa fa-github"/>',
							'</a>',
							// 多语言切换
							'<ul class="M-footerInfoLang">',
								'<li class="cn" data-type="zhCN">'+ T('简体') +'</li>',
								'<li class="hk" data-type="zhHK">'+ T('繁体') +'</li>',
								'<li class="us" data-type="enUS">'+ T('英文') +'</li>',
							'</ul>',
						'</div>',
					'</div>',
				'</div>'
			].join(''));
			foot.appendTo(target.hide());

			this.$doms = {
				'lang': foot.find('.M-footerInfoLang')
			}

			this.$doms.lang.find('li[data-type="'+ app.cookie.get('lang') +'"]').hide();
			// 绑定事件
			app.event.proxy(this.$doms.lang, 'touchstart', 'li', this.eventSwitchLang, this);

			var cssStyle = config.css;
			if (cssStyle) {
				foot.css(cssStyle);
			}

			// 创建完成后回调
			if (util.isFunc(this.callback)) {
				this.callback();
			}
		},

		eventSwitchLang: function(evt, elm) {
			var lang = $(elm).attr('data-type');
			this.$timeStamp = evt.timeStamp;
			if (lang !== app.cookie.get('lang')) {
				app.cookie.set('lang', lang);
				app.lang.load(lang);
				window.location.reload();
			}
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