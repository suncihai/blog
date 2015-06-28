/**
 * [页脚模块]
 */
define(function( require, exports ){
	var app = require('app');
	// var c = app.getConfig();
	var $ = require('jquery');
	var util = require('util');

	var Footer = {
		// 初始化方法
		init: function( config, callback ) {
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
						'<div class="M-footerInfo"></div>',
						'<div class="M-footerLang">',
							'<ul class="fr ulLang">',
								'<li class="cn" data-type="zhCN" title="'+ T('简体') +'"></li>',
								'<li class="hk" data-type="zhHK" title="'+ T('繁体') +'"></li>',
								'<li class="us" data-type="enUS" title="'+ T('英文') +'"></li>',
							'</ul>',
						'</div>',
					'</div>',
				'</div>'
			].join(''));
			foot.appendTo( target.hide() );

			this.$doms = {
				'lang': foot.find('.ulLang')
			}

			// 设置语言的默认状态
			this.setLangStatus();

			var cssStyle = config.css;
			if ( cssStyle ) {
				foot.css( cssStyle );
			}

			// 创建完成后回调
			if ( util.isFunc( this.callback ) ) {
				this.callback();
			}
		},

		// 设置语言的默认状态
		setLangStatus: function() {
			var clang = app.cookie.get('lang');
			var dom = this.$doms.lang;
			dom.find('li[data-type="'+ clang +'"]').show().siblings('li').hide();
			// 绑定事件
			app.event.proxy( dom, 'click', 'li', this.eventSwitchLang, this );
		},

		eventSwitchLang: function( evt, elm ) {
			var lang = $(elm).attr('data-type');
			if ( lang === app.cookie.get('lang') ) {
				this.$doms.lang.find('li').fadeIn();
				return false;
			}
			else {
				app.cookie.set('lang', lang);
				app.lang.load( lang );
				window.location.reload();
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
	exports.base = Footer;
});