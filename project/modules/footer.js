/**
 * [页脚模块]
 */
define(function( require, exports ){
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
				'<div class="M-footer">',
					'<div class="M-footerCopy">'+ config.content +'</div>',
					'<div class="M-footerInfo"></div>',
					'<div class="M-footerLang">',
						'<ul class="fr ulLang">',
							// '<li class="cn" data-type="zhCN">简体</li>',
							// '<li class="hk" data-type="zhHK">繁体</li>',
							// '<li class="us" data-type="enUS">英文</li>',
						'</ul>',
					'</div>',
				'</div>'
			].join(''));
			foot.appendTo( target.hide() );

			this.$doms = {
				'lang': foot.find('.ulLang')
			}

			var cssStyle = config.css;
			if ( cssStyle ) {
				foot.css( cssStyle );
			}

			// 创建完成后回调
			if ( util.isFunc( this.callback ) ) {
				this.callback();
			}
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